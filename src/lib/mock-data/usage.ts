import type {
  CostBreakdown,
  Environment,
  ReasoningEffort,
  RequestStatus,
  SearchDepth,
  TimeRange,
  UsageByCategory,
  UsageByKey,
  UsageFilters,
  UsageSummary,
} from "@/types/api";
import { floatBetween, intBetween, pick, round2, seededRandom } from "./util";

const ranges: Record<TimeRange, number> = {
  "24h": 24,
  "7d": 28,
  "30d": 30,
  "90d": 45,
};

const keySeeds: Record<string, { name: string; prefix: string; weight: number }> = {
  all: { name: "All keys", prefix: "", weight: 1 },
  key_1: { name: "Production app", prefix: "af_live_7X3K", weight: 0.6 },
  key_2: { name: "Local development", prefix: "af_test_9Q2N", weight: 0.25 },
  key_3: { name: "CI pipeline", prefix: "af_test_4M8F", weight: 0.15 },
};

export function getUsageSummary(filters: UsageFilters): UsageSummary {
  const rand = seededRandom(1337 + ranges[filters.range]);
  const count = ranges[filters.range];
  const keyScale = filters.apiKey !== "all" ? keySeeds[filters.apiKey]?.weight ?? 1 : 1;

  const series = [];
  let spend = 1.4 * keyScale;
  let requests = 1150 * keyScale;
  for (let i = 0; i < count; i += 1) {
    spend = Math.max(0.2, spend + floatBetween(rand, -0.3, 0.52));
    requests = Math.max(300, requests + intBetween(rand, -95, 140));
    series.push({
      time: label(filters.range, i),
      timestamp: Date.now() - (count - i) * stepMs(filters.range),
      spend: round2(spend),
      requests,
      tokens: requests * intBetween(rand, 2700, 3500),
    });
  }

  const totalsSpend = round2(series.reduce((a, s) => a + s.spend, 0));
  const totalsRequests = series.reduce((a, s) => a + s.requests, 0);
  const totalsTokens = series.reduce((a, s) => a + s.tokens, 0);
  const totalsSearches = Math.round(totalsRequests * 0.11);
  const latency = round2(intBetween(rand, 420, 980));
  const errorRate = round2(floatBetween(rand, 0.6, 3.4));

  const shareInput = 0.51;
  const shareOutput = 0.33;
  const shareReasoning = 0.16;

  const inputCost = round2(totalsTokens * shareInput * 5 / 1_000_000);
  const outputCost = round2(totalsTokens * shareOutput * 25 / 1_000_000);
  const reasoningCost = round2(totalsTokens * shareReasoning * 25 / 1_000_000);
  const searchCost = round2(totalsSearches * 0.06);
  const contentCost = round2(totalsSearches * 2.2 * 0.02);

  const costBreakdown: CostBreakdown = {
    inputTokenCost: inputCost,
    outputTokenCost: outputCost,
    reasoningCost,
    searchCost,
    contentCost,
  };

  const byKey: UsageByKey[] = (["key_1", "key_2", "key_3"] as const)
    .map((id) => {
      const meta = keySeeds[id];
      const weight = meta.weight;
      return {
        keyId: id,
        keyName: meta.name,
        prefix: meta.prefix,
        requests: Math.round(totalsRequests * weight),
        tokens: Math.round(totalsTokens * weight),
        searches: Math.round(totalsSearches * weight),
        spend: round2(totalsSpend * weight),
      };
    })
    .sort((a, b) => b.spend - a.spend);

  const categories: UsageByCategory[] = [
    { id: "general", name: "General", requests: Math.round(totalsRequests * 0.38), spend: round2(totalsSpend * 0.28), share: 0.38 },
    { id: "reasoning", name: "Reasoning", requests: Math.round(totalsRequests * 0.22), spend: round2(totalsSpend * 0.39), share: 0.22 },
    { id: "multimodal", name: "Multimodal", requests: Math.round(totalsRequests * 0.14), spend: round2(totalsSpend * 0.1), share: 0.14 },
    { id: "structured-output", name: "Structured output", requests: Math.round(totalsRequests * 0.16), spend: round2(totalsSpend * 0.14), share: 0.16 },
    { id: "search-synthesis", name: "Search synthesis", requests: Math.round(totalsRequests * 0.1), spend: round2(totalsSpend * 0.09), share: 0.1 },
  ];

  return {
    filters,
    series,
    totals: {
      spend: totalsSpend,
      requests: totalsRequests,
      tokens: totalsTokens,
      webSearches: totalsSearches,
      latencyMs: latency,
      errorRate,
    },
    costBreakdown,
    byKey,
    byCategory: categories,
  };
}

export const usageFilterOptions = {
  ranges: ["24h", "7d", "30d", "90d"] as TimeRange[],
  endpoints: ["/v1/responses", "/v1/chat/completions", "/v1/search", "/v1/embeddings"],
  statuses: ["success", "failed", "rate_limited"] as RequestStatus[],
  reasoning: ["low", "medium", "high"] as ReasoningEffort[],
  searchDepths: ["instant", "fast", "balanced", "deep", "reasoning"] as SearchDepth[],
  environments: ["production", "development"] as Environment[],
};

function label(range: TimeRange, i: number): string {
  if (range === "24h") return `${String(i).padStart(2, "0")}:00`;
  if (range === "7d") {
    return new Date(Date.now() - (28 - i) * 3.6e6).toLocaleDateString("en-MY", { weekday: "short" });
  }
  if (range === "30d") {
    return new Date(Date.now() - (30 - i) * 8.64e7).toLocaleDateString("en-MY", { day: "numeric", month: "short" });
  }
  return new Date(Date.now() - (45 - i) * 4 * 8.64e7).toLocaleDateString("en-MY", { month: "short" });
}

function stepMs(range: TimeRange): number {
  if (range === "24h") return 3.6e6;
  if (range === "7d") return 3.6e6 * 6;
  if (range === "30d") return 8.64e7;
  return 8.64e7 * 4;
}

export { pick };
