import type { PlaygroundConfig, SearchDepth } from "@/types/api";

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

const SEARCH_PRICES: Record<SearchDepth, number> = {
  instant: 0.05,
  fast: 0.05,
  balanced: 0.06,
  deep: 0.08,
  reasoning: 0.1,
};

export function estimatePlaygroundCost(config: PlaygroundConfig): CostEstimate {
  const inputTokens = Math.max(120, Math.ceil((config.input.length + config.systemInstruction.length) / 3.6));
  const outputTokens = Math.min(config.maxOutputTokens, 900 + Math.floor(config.maxOutputTokens / 8));
  const reasoningRatio =
    config.reasoning === "low" ? 0.2 : config.reasoning === "high" ? 0.8 : 0.45;
  const reasoningTokens = Math.round(outputTokens * reasoningRatio);

  const searches = searchCountFor(config);
  const searchPrice = SEARCH_PRICES[config.searchDepth] ?? 0.06;
  const resultsCharge = config.maxResults > 10 ? (config.maxResults - 10) * 0.005 : 0;
  const contentPages = config.contentExtraction ? Math.min(config.maxContentPages, 1 + Math.ceil(searches / 2)) : 0;

  const inputCost = round2((inputTokens * 5) / 1_000_000);
  const outputCost = round2((outputTokens * 25) / 1_000_000);
  const reasoningCost = round2((reasoningTokens * 25) / 1_000_000);
  const searchCost = round2(searches * searchPrice + resultsCharge);
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

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}
