import type { ModelInfo, SearchTier, SearchDepth } from "@/types/api";

export const PUBLIC_MODEL_ID = "atlasflux/nenas-flash";

export const nenasFlash: ModelInfo = {
  id: PUBLIC_MODEL_ID,
  name: "Nenas Flash",
  tagline: "The AtlasFlux model. One ID for reasoning, multimodal input, web search and structured output.",
  description:
    "Nenas Flash is the primary model on the AtlasFlux platform. It exposes a single OpenAI-compatible API while AtlasFlux routes each request to the best upstream model for the task. Reasoning effort, web search and output structure are controlled through request parameters.",
  inputTypes: ["Text", "Images", "Audio", "Documents"],
  contextWindow: "1M tokens (placeholder)",
  maxOutputTokens: 65536,
  multimodal: true,
  reasoning: true,
  webSearch: true,
  streaming: true,
  toolCalling: true,
  structuredOutput: true,
  pricing: {
    inputPerMillion: 5,
    outputPerMillion: 25,
    webSearchFrom: 0.05,
    reasoningBilledAtOutput: true,
  },
};

export const searchTiers: SearchTier[] = [
  {
    id: "instant",
    name: "Instant",
    bestFor: "Simple factual lookups and quick answers",
    typicalLatency: "0.3 to 0.8s",
    searchQuality: "High recall on well-indexed sources",
    basePrice: 0.05,
    recommendedMaxResults: 5,
  },
  {
    id: "fast",
    name: "Fast",
    bestFor: "Straightforward questions with a few sources",
    typicalLatency: "0.6 to 1.4s",
    searchQuality: "Balanced speed and relevance",
    basePrice: 0.05,
    recommendedMaxResults: 8,
  },
  {
    id: "balanced",
    name: "Balanced",
    bestFor: "Default for most research questions",
    typicalLatency: "1 to 2.5s",
    searchQuality: "Good diversity across sources",
    basePrice: 0.06,
    recommendedMaxResults: 10,
  },
  {
    id: "deep",
    name: "Deep",
    bestFor: "Technical research and multiple angles",
    typicalLatency: "2 to 5s",
    searchQuality: "Comprehensive multi-query exploration",
    basePrice: 0.08,
    recommendedMaxResults: 12,
  },
  {
    id: "reasoning",
    name: "Reasoning",
    bestFor: "Complex problems that require synthesis",
    typicalLatency: "3 to 8s",
    searchQuality: "Deep synthesis with cross-source reasoning",
    basePrice: 0.1,
    recommendedMaxResults: 15,
  },
];

export const searchDepthOptions: SearchDepth[] = ["instant", "fast", "balanced", "deep", "reasoning"];

export function getSearchTier(id: SearchDepth): SearchTier {
  return searchTiers.find((t) => t.id === id) ?? searchTiers[2];
}
