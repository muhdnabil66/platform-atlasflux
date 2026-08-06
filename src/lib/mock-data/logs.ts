import type { RequestLog, RequestStatus } from "@/types/api";
import { intBetween, pick, round2, seededRandom } from "./util";

const rand = seededRandom(2026);

const ENDPOINTS = ["/v1/responses", "/v1/chat/completions", "/v1/search"] as const;
const MODELS = ["atlasflux/nenas-flash"] as const;
const STATUSES: RequestStatus[] = ["success", "success", "success", "success", "failed", "rate_limited"];
const CATEGORIES = ["General", "Reasoning", "Multimodal", "Structured tools", "Fast tasks"] as const;
const REASONING = ["low", "medium", "medium", "high"] as const;
const DEPTHS = ["off", "instant", "fast", "balanced", "deep", "reasoning"] as const;
const APPS = [
  { name: "MyStore", domain: "mystore.my" },
  { name: "Chat Assistant", domain: "chatassistant.dev" },
  { name: "Bantuan AI", domain: "bantuan.ai" },
  { name: "API Gateway", domain: "gateway.niaga.my" },
  { name: "Backend Service", domain: "backend.svc" },
  { name: "Search Bot", domain: "searchbot.co" },
  { name: "Analytics", domain: "analytics.app" },
] as const;

function generateLogs(): RequestLog[] {
  const logs: RequestLog[] = [];
  const start = Date.now() - 6 * 24 * 3.6e6;
  for (let i = 0; i < 220; i += 1) {
    const status = pick(rand, STATUSES);
    const depth = pick(rand, DEPTHS) as RequestLog["searchDepth"];
    const app = pick(rand, APPS);
    const searchCount = depth === "off" ? 0 : intBetween(rand, 0, 3);
    const inputTokens = intBetween(rand, 120, 9000);
    const outputTokens = intBetween(rand, 80, 4000);
    const reasoningTokens = status === "success" && rand() > 0.4 ? intBetween(rand, 60, 2400) : 0;
    const cachedTokens = rand() > 0.45 ? intBetween(rand, 200, 9200) : 0;
    const costs = round2(
      (inputTokens * 5 + (outputTokens + reasoningTokens) * 25) / 1_000_000 +
        searchCount * (depth === "deep" ? 0.08 : depth === "reasoning" ? 0.1 : 0.06) +
        (rand() > 0.7 ? intBetween(rand, 1, 3) * 0.02 : 0)
    );
    logs.push({
      id: `log_${i + 1}`,
      timestamp: new Date(start + i * intBetween(rand, 20, 70) * 60000).toISOString(),
      requestId: `req_${randHex(rand)}_${randHex(rand)}`,
      apiKeyName: pick(rand, ["Production app", "Local development", "CI pipeline"]),
      apiKeyPrefix: pick(rand, ["af_live_7X3K", "af_test_9Q2N", "af_test_4M8F"]),
      endpoint: pick(rand, ENDPOINTS),
      model: pick(rand, MODELS),
      status,
      appName: app.name,
      appDomain: app.domain,
      inputTokens,
      outputTokens,
      reasoningTokens,
      cachedTokens,
      searchCount,
      cost: costs,
      latencyMs: status === "success" ? intBetween(rand, 320, 2600) : intBetween(rand, 40, 500),
      routingCategory: pick(rand, CATEGORIES),
      reasoningEffort: pick(rand, REASONING),
      searchDepth: depth,
      error:
        status === "failed"
          ? "Upstream provider returned an error (HTTP 502). The request was retried automatically."
          : status === "rate_limited"
            ? "Request was rate limited. Retry after 1 second."
            : null,
      costs: {
        inputTokenCost: round2((inputTokens * 5) / 1_000_000),
        outputTokenCost: round2((outputTokens * 25) / 1_000_000),
        reasoningCost: round2((reasoningTokens * 25) / 1_000_000),
        searchCost: round2(searchCount * 0.06),
        contentCost: round2(rand() > 0.7 ? intBetween(rand, 1, 3) * 0.02 : 0),
      },
    });
  }
  return logs.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
}

const allLogs = generateLogs();

export function getLogs(opts: {
  search?: string;
  status?: "all" | RequestStatus;
  limit?: number;
  offset?: number;
}): { logs: RequestLog[]; total: number } {
  const { search = "", status = "all", limit = 20, offset = 0 } = opts;
  const query = search.trim().toLowerCase();
  const filtered = allLogs.filter((log) => {
    if (status !== "all" && log.status !== status) return false;
    if (!query) return true;
    return (
      log.requestId.toLowerCase().includes(query) ||
      log.apiKeyName.toLowerCase().includes(query) ||
      log.apiKeyPrefix.toLowerCase().includes(query) ||
      log.endpoint.toLowerCase().includes(query)
    );
  });
  return {
    logs: filtered.slice(offset, offset + limit),
    total: filtered.length,
  };
}

export function getLogById(requestId: string): RequestLog | undefined {
  return allLogs.find((log) => log.requestId === requestId);
}

function randHex(rand: () => number): string {
  return Math.floor(rand() * 0xffffff)
    .toString(16)
    .padStart(6, "0");
}

export function countLogsByStatus(): Record<RequestStatus, number> {
  const counts: Record<RequestStatus, number> = {
    success: 0,
    failed: 0,
    rate_limited: 0,
    pending: 0,
    cancelled: 0,
  };
  for (const log of allLogs) counts[log.status] += 1;
  return counts;
}
