import type {
  ActivityItem,
  BalanceSummary,
  RoutingCategory,
  SeriesPoint,
  TimeRange,
  UsageBreakdown,
} from "@/types/api";
import { floatBetween, intBetween, pick, round2, seededRandom } from "./util";

const SAMPLE: Record<TimeRange, number> = {
  "24h": 24,
  "7d": 28,
  "30d": 30,
  "90d": 45,
};

const LABELS: Record<TimeRange, (i: number) => string> = {
  "24h": (i) => `${String(i).padStart(2, "0")}:00`,
  "7d": (i) => {
    const d = new Date(Date.now() - (28 - i) * 3.6e6);
    return d.toLocaleDateString("en-MY", { weekday: "short" });
  },
  "30d": (i) => {
    const d = new Date(Date.now() - (30 - i) * 8.64e7);
    return d.toLocaleDateString("en-MY", { day: "numeric", month: "short" });
  },
  "90d": (i) => {
    const d = new Date(Date.now() - (45 - i) * 4 * 8.64e7);
    return d.toLocaleDateString("en-MY", { month: "short" });
  },
};

export function getSeries(range: TimeRange): SeriesPoint[] {
  const rand = seededRandom(42 + SAMPLE[range]);
  const count = SAMPLE[range];
  const points: SeriesPoint[] = [];
  let spend = 0.9;
  let requests = 900;
  for (let i = 0; i < count; i += 1) {
    spend = Math.max(
      0.2,
      spend + floatBetween(rand, -0.28, 0.5) + (range === "24h" ? 0 : 0.02)
    );
    requests = Math.max(
      250,
      requests + intBetween(rand, -90, 130) + (range === "24h" ? 0 : 8)
    );
    const tokens = requests * intBetween(rand, 2600, 3400);
    points.push({
      time: LABELS[range](i),
      timestamp: Date.now() - (count - i) * stepMs(range),
      spend: round2(spend),
      requests,
      tokens,
    });
  }
  return points;
}

function stepMs(range: TimeRange): number {
  if (range === "24h") return 3.6e6;
  if (range === "7d") return 3.6e6 * 6;
  if (range === "30d") return 8.64e7;
  return 8.64e7 * 4;
}

export function getBalanceSummary(): BalanceSummary {
  return {
    balance: 87.42,
    currency: "RM",
    spendToday: 1.84,
    spendDeltaPercent: 12.4,
    requestsToday: 1248,
    requestsDeltaPercent: 8.1,
    totalTokens: 3_800_000,
    totalTokensDeltaPercent: -3.2,
    projectedDailySpend: 1.96,
  };
}

export function getUsageBreakdown(): UsageBreakdown {
  return {
    inputTokens: 1_940_000,
    outputTokens: 1_260_000,
    reasoningTokens: 600_000,
    webSearches: 128,
    contentPages: 241,
  };
}

export function getRoutingCategories(): RoutingCategory[] {
  const total = 1248;
  return [
    { id: "general", name: "General", share: 38, requests: 474, cost: 0.52 },
    { id: "reasoning", name: "Reasoning", share: 22, requests: 275, cost: 0.71 },
    { id: "multimodal", name: "Multimodal", share: 14, requests: 175, cost: 0.18 },
    { id: "structured-tools", name: "Structured tools", share: 16, requests: 200, cost: 0.27 },
    { id: "fast-tasks", name: "Fast tasks", share: 10, requests: 124, cost: 0.16 },
  ].map((c) => ({ ...c, share: round2((c.requests / total) * 100) }));
}

const ACTIVITY_STATUSES = ["success", "success", "success", "success", "failed", "rate_limited"] as const;
const ENDPOINTS = [
  "/v1/responses",
  "/v1/chat/completions",
  "/v1/responses",
  "/v1/search",
  "/v1/responses",
  "/v1/responses",
] as const;

export function getRecentActivity(limit = 8): ActivityItem[] {
  const rand = seededRandom(77);
  const items: ActivityItem[] = [];
  for (let i = 0; i < limit; i += 1) {
    const status = pick(rand, ACTIVITY_STATUSES);
    const tokens = intBetween(rand, 400, 4800);
    const latency = status === "success" ? intBetween(rand, 320, 2400) : intBetween(rand, 60, 400);
    items.push({
      id: `act_${i + 1}`,
      time: new Date(Date.now() - i * intBetween(rand, 3, 14) * 60000).toISOString(),
      requestId: `req_${randHex(rand)}`,
      endpoint: pick(rand, ENDPOINTS),
      status,
      tokens,
      search: status === "success" ? (rand() > 0.55 ? 1 : 0) : 0,
      cost: round2(tokens / 1_000_000 * 20 + (rand() > 0.55 ? 0.05 : 0)),
      latencyMs: latency,
    });
  }
  return items;
}

export function getOverviewPageData() {
  return {
    summary: getBalanceSummary(),
    series24h: getSeries("24h"),
    series7d: getSeries("7d"),
    series30d: getSeries("30d"),
    series90d: getSeries("90d"),
    breakdown: getUsageBreakdown(),
    routing: getRoutingCategories(),
    activity: getRecentActivity(8),
  };
}

function randHex(rand: () => number): string {
  return Math.floor(rand() * 0xffffff)
    .toString(16)
    .padStart(6, "0");
}
