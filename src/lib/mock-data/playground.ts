import type {
  Citation,
  PlaygroundConfig,
  PlaygroundResponse,
  PlaygroundUsage,
  SearchDepth,
} from "@/types/api";
import { getSearchTier, searchTiers } from "@/config/models";
import { round2 } from "./util";

export interface CostEstimate {
  inputTokens: number;
  outputTokens: number;
  reasoningTokens: number;
  searches: number;
  contentPages: number;
  costs: {
    input: number;
    output: number;
    reasoning: number;
    search: number;
    content: number;
  };
  totalCost: number;
  aboveLimit: boolean;
}

export function estimatePlaygroundCost(config: PlaygroundConfig): CostEstimate {
  const inputTokens = Math.max(120, Math.ceil((config.input.length + config.systemInstruction.length) / 3.6));
  const outputTokens = Math.min(config.maxOutputTokens, 900 + Math.floor(config.maxOutputTokens / 8));
  const reasoningRatio =
    config.reasoning === "low" ? 0.2 : config.reasoning === "high" ? 0.8 : 0.45;
  const reasoningTokens = Math.round(outputTokens * reasoningRatio);

  const searches = searchCountFor(config);
  const tier = getSearchTier(config.searchDepth);
  const resultsCharge = config.maxResults > 10 ? (config.maxResults - 10) * 0.005 : 0;
  const contentPages = config.contentExtraction ? Math.min(config.maxContentPages, 1 + Math.ceil(searches / 2)) : 0;

  const inputCost = round2((inputTokens * 5) / 1_000_000);
  const outputCost = round2((outputTokens * 25) / 1_000_000);
  const reasoningCost = round2((reasoningTokens * 25) / 1_000_000);
  const searchCost = round2(searches * tier.basePrice + resultsCharge);
  const contentCost = round2(contentPages * 0.02);
  const totalCost = round2(inputCost + outputCost + reasoningCost + searchCost + contentCost);

  return {
    inputTokens,
    outputTokens,
    reasoningTokens,
    searches,
    contentPages,
    costs: { input: inputCost, output: outputCost, reasoning: reasoningCost, search: searchCost, content: contentCost },
    totalCost,
    aboveLimit: config.maxTotalCost > 0 && totalCost > config.maxTotalCost,
  };
}

function searchCountFor(config: PlaygroundConfig): number {
  if (config.searchMode === "off") return 0;
  const base =
    config.searchMode === "on"
      ? Math.min(config.maxSearches, config.reasoning === "high" ? 3 : 2)
      : config.searchMode === "auto"
        ? (config.reasoning === "high" || config.searchDepth === "deep" || config.searchDepth === "reasoning"
            ? Math.min(config.maxSearches, 2)
            : 1)
        : 0;
  if (config.searchDepth === "deep" || config.searchDepth === "reasoning") {
    return Math.min(config.maxSearches, base + 1);
  }
  return Math.min(config.maxSearches, base);
}

export function generateMockResponse(config: PlaygroundConfig): PlaygroundResponse {
  const estimate = estimatePlaygroundCost(config);
  const prompt = config.input.trim() || "Your prompt";
  const searchesUsed = estimate.searches;

  const content = buildContent(prompt, config, searchesUsed);

  const citations = buildCitations(config, searchesUsed, prompt);

  const usage: PlaygroundUsage = {
    inputTokens: estimate.inputTokens,
    outputTokens: estimate.outputTokens,
    reasoningTokens: estimate.reasoningTokens,
    searches: searchesUsed,
    contentPages: estimate.contentPages,
    costs: {
      inputTokenCost: estimate.costs.input,
      outputTokenCost: estimate.costs.output,
      reasoningCost: estimate.costs.reasoning,
      searchCost: estimate.costs.search,
      contentCost: estimate.costs.content,
    },
    totalCost: estimate.totalCost,
    latencyMs: 480 + (searchesUsed > 0 ? searchesUsed * 420 : 0),
    routingCategory: config.reasoning === "high" ? "Reasoning" : searchesUsed > 0 ? "Search synthesis" : "General",
    requestId: `req_${Math.random().toString(16).slice(2, 8)}_${Math.random().toString(16).slice(2, 8)}`,
  };

  return {
    content,
    citations,
    usage,
    finishReason: config.stream ? "stop" : "stop",
    createdAt: new Date().toISOString(),
  };
}

function buildContent(prompt: string, config: PlaygroundConfig, searchesUsed: number): string {
  const lines: string[] = [];
  lines.push(`Here is a structured answer for your request.`);
  lines.push("");
  lines.push(`> ${prompt}`);
  lines.push("");
  lines.push(`## Summary`);
  lines.push("");
  lines.push(
    `Based on the analysis, the main considerations for this task fall into three areas: architecture, implementation details, and validation. The approach below assumes you are integrating against the AtlasFlux API at \`api.atlasflux.my\`.`
  );
  lines.push("");
  lines.push(`## Key points`);
  lines.push("");
  lines.push(`1. **Model**: Requests default to \`atlasflux/nenas-flash\`. Set \`reasoning.effort\` to control token spend.`);
  lines.push(
    `2. **Web search**: Mode is \`${config.searchMode}\` with depth \`${config.searchDepth}\`. ${
      searchesUsed > 0
        ? `This request used ${searchesUsed} search${searchesUsed > 1 ? "es" : ""} to verify sources.`
        : `No live searches were triggered for this request.`
    }`
  );
  lines.push(
    `3. **Configuration**: Temperature ${config.temperature}, max output ${config.maxOutputTokens.toLocaleString()} tokens, streaming ${config.stream ? "enabled" : "disabled"}.`
  );
  lines.push("");
  lines.push(`## Implementation notes`);
  lines.push("");
  lines.push(`- Keep the API key in a server-side environment variable and never expose it to the browser.`);
  lines.push(`- Use the OpenAI-compatible endpoint for drop-in compatibility with existing SDKs.`);
  lines.push(`- Monitor spend through the usage dashboard; billing is prepaid in RM.`);
  lines.push("");
  lines.push(`## Validation`);
  lines.push("");
  lines.push(`- Verify the response schema against the documentation before shipping.`);
  lines.push(`- Add retry logic with exponential backoff for transient errors.`);
  lines.push(`- Test with \`max_total_cost\` set to bound spend in production.`);
  lines.push("");
  lines.push(
    `This is a mock response generated for the frontend preview. It will be replaced by a real response once the backend is connected.`
  );

  return lines.join("\n");
}

function buildCitations(config: PlaygroundConfig, searchesUsed: number, prompt: string): Citation[] {
  if (searchesUsed === 0) return [];
  const tier = getSearchTier(config.searchDepth);
  const count = Math.min(config.maxResults, tier.recommendedMaxResults + 2, searchesUsed * 3 + 2);
  const topics = ["API reference", "Model routing", "Web search", "Pricing"];
  const hosts = ["platform.atlasflux.my", "docs.atlasflux.my", "ai.atlasflux.my"];
  const citations: Citation[] = [];
  for (let i = 0; i < count; i += 1) {
    const topic = topics[i % topics.length];
    const host = hosts[i % hosts.length];
    citations.push({
      index: i + 1,
      title: `${topic} ${i + 1}: ${prompt.length > 40 ? prompt.slice(0, 40) + "..." : prompt || "AtlasFlux"}`,
      url: `https://${host}/docs/${topic.toLowerCase().replace(/ /g, "-")}`,
      publisher: host,
      date: new Date(Date.now() - i * 8.64e7).toISOString().slice(0, 10),
      snippet: `Relevant passage for ${topic.toLowerCase()} with context extracted at ${config.searchDepth} depth.`,
    });
  }
  return citations;
}

export function maxSearchDepthCharge(depth: SearchDepth): number {
  return searchTiers.find((t) => t.id === depth)?.basePrice ?? 0.06;
}
