import type {
  ApiKey,
  BillingSummary,
  CreateApiKeyInput,
  CreatedApiKey,
  RequestLog,
  RequestStatus,
  Transaction,
  UsageFilters,
  UsageSummary,
} from "@/types/api";
import type { ActivityItem } from "@/types/api";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api.atlasflux.my";

/**
 * Token provider function. Set by the auth system to provide fresh Clerk
 * session tokens for each API request. Never stale.
 */
let tokenProvider: (() => Promise<string | null>) | null = null;

export function setTokenProvider(provider: () => Promise<string | null>): void {
  tokenProvider = provider;
}

async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const method = init?.method?.toUpperCase() ?? "GET";
  const headers: Record<string, string> = {
    ...(init?.headers as Record<string, string> | undefined),
  };
  if (method !== "DELETE") {
    headers["Content-Type"] = "application/json";
  }

  if (tokenProvider) {
    const token = await tokenProvider();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
  });

  if (!res.ok) {
    if (res.status === 401) {
      if (typeof window !== "undefined") {
        window.location.assign(new URL("/sign-in", window.location.origin));
      }
      throw new Error("Session expired. Please sign in again.");
    }
    const body = await res.json().catch(() => null);
    const message =
      body?.error?.message ?? `API request to ${path} failed with ${res.status}`;
    throw new Error(message);
  }

  return res.json() as Promise<T>;
}

/* ------------------------------------------------------------------ */
/*  Overview                                                          */
/* ------------------------------------------------------------------ */

export interface OverviewData {
  summary: {
    balance: number;
    currency: string;
    spendToday: number;
    spendDeltaPercent: number;
    requestsToday: number;
    requestsDeltaPercent: number;
    totalTokens: number;
    totalTokensDeltaPercent: number;
    projectedDailySpend: number;
  };
  breakdown: {
    inputTokens: number;
    outputTokens: number;
    reasoningTokens: number;
    webSearches: number;
    contentPages: number;
  };
  routing: Array<{ id: string; name: string; share: number; requests: number; cost: number }>;
  activity: ActivityItem[];
  series: Record<string, Array<{ time: string; timestamp: number; spend: number; requests: number; tokens: number }>>;
}

interface BackendOverviewResponse {
  wallet: {
    availableMicroMyr: number;
    reservedMicroMyr: number;
    lifetimeTopupMicroMyr: number;
    lifetimeSpendMicroMyr: number;
  } | null;
  total_usage: {
    requests: number;
    successfulRequests: number;
    failedRequests: number;
    inputTokens: number;
    outputTokens: number;
    reasoningTokens: number;
    searchCount: number;
    contentPages: number;
    costMicroMyr: number;
    latencySumMs: number;
    averageLatencyMs: number;
  };
  today_usage: {
    requests: number;
    successfulRequests: number;
    failedRequests: number;
    inputTokens: number;
    outputTokens: number;
    reasoningTokens: number;
    searchCount: number;
    contentPages: number;
    costMicroMyr: number;
    latencySumMs: number;
    averageLatencyMs: number;
  };
  daily_series: Array<{ bucket: string; requests: number; costMicroMyr: number; inputTokens: number; outputTokens: number; reasoningTokens: number }>;
  api_key_count: number;
  active_api_key_count: number;
}

function adaptOverview(res: BackendOverviewResponse): OverviewData {
  const balanceRm = res.wallet
    ? Number(((res.wallet.availableMicroMyr ?? 0) / 1_000_000).toFixed(2))
    : 0;
  const todaySpendRm = Number(((res.today_usage.costMicroMyr ?? 0) / 1_000_000).toFixed(2));

  const series = res.daily_series.map((p) => ({
    time: p.bucket,
    timestamp: new Date(p.bucket).getTime(),
    spend: Number((p.costMicroMyr / 1_000_000).toFixed(2)),
    requests: p.requests,
    tokens: p.inputTokens + p.outputTokens + p.reasoningTokens,
  }));

  return {
    summary: {
      balance: balanceRm,
      currency: "RM",
      spendToday: todaySpendRm,
      spendDeltaPercent: 0,
      requestsToday: res.today_usage.requests,
      requestsDeltaPercent: 0,
      totalTokens: res.today_usage.inputTokens + res.today_usage.outputTokens + res.today_usage.reasoningTokens,
      totalTokensDeltaPercent: 0,
      projectedDailySpend: todaySpendRm,
    },
    breakdown: {
      inputTokens: res.total_usage.inputTokens,
      outputTokens: res.total_usage.outputTokens,
      reasoningTokens: res.total_usage.reasoningTokens,
      webSearches: res.total_usage.searchCount,
      contentPages: res.total_usage.contentPages,
    },
    routing: [],
    activity: [],
    series: { "24h": [], "7d": series, "30d": series, "90d": series },
  };
}

export function getOverviewData(): Promise<OverviewData> {
  return apiRequest<BackendOverviewResponse>("/dashboard/overview").then(adaptOverview);
}

/* ------------------------------------------------------------------ */
/*  Usage                                                             */
/* ------------------------------------------------------------------ */

export function getUsageData(filters: UsageFilters): Promise<UsageSummary> {
  const params = new URLSearchParams({
    from: rangeToIso(filters.range),
    to: new Date().toISOString(),
    granularity: filters.range === "24h" ? "hour" : "day",
  });
  if (filters.apiKey) params.set("api_key_id", filters.apiKey);
  return apiRequest<{ from: string; to: string; granularity: string; series: Array<{ time: string; timestamp: number; spend: number; requests: number; tokens: number }> }>(
    `/dashboard/usage?${params.toString()}`
  ).then((res) => {
    const totalSpend = res.series.reduce((a, s) => a + s.spend, 0);
    const totalRequests = res.series.reduce((a, s) => a + s.requests, 0);
    const totalTokens = res.series.reduce((a, s) => a + s.tokens, 0);
    const totalSearches = 0;
    return {
      filters,
      series: res.series,
      totals: {
        spend: totalSpend,
        requests: totalRequests,
        tokens: totalTokens,
        webSearches: totalSearches,
        latencyMs: 0,
        errorRate: 0,
      },
      costBreakdown: {
        inputTokenCost: 0,
        outputTokenCost: 0,
        reasoningCost: 0,
        searchCost: 0,
        contentCost: 0,
      },
      byKey: [],
      byCategory: [],
    };
  });
}

function rangeToIso(range: string): string {
  const now = Date.now();
  const ms: Record<string, number> = {
    "24h": 86_400_000,
    "7d": 7 * 86_400_000,
    "30d": 30 * 86_400_000,
    "90d": 90 * 86_400_000,
  };
  return new Date(now - (ms[range] ?? ms["30d"])).toISOString();
}

/* ------------------------------------------------------------------ */
/*  API Keys                                                          */
/* ------------------------------------------------------------------ */

interface BackendApiKey {
  id: string;
  name: string;
  prefix: string;
  environment: string;
  status: string;
  scopes: string[];
  monthly_spend_limit_micro_myr: number | null;
  expires_at: string | null;
  last_used_at: string | null;
  created_at: string;
}

function adaptApiKey(k: BackendApiKey): ApiKey {
  return {
    id: k.id,
    name: k.name,
    prefix: k.prefix,
    created: k.created_at,
    lastUsed: k.last_used_at,
    usage: 0,
    status: k.status as ApiKey["status"],
    environment: k.environment as ApiKey["environment"],
    monthlySpendLimit: k.monthly_spend_limit_micro_myr != null
      ? Number((k.monthly_spend_limit_micro_myr / 1_000_000).toFixed(2))
      : null,
    expiresAt: k.expires_at,
  };
}

interface BackendCreateKeyResponse {
  key: { id: string; name: string; prefix: string; environment: string; status: string; scopes: string[] };
  full_key: string;
  warning: string;
}

export function listApiKeys(): Promise<ApiKey[]> {
  return apiRequest<{ keys: BackendApiKey[] }>("/dashboard/api-keys").then((res) =>
    res.keys.map(adaptApiKey)
  );
}

export function createApiKey(input: CreateApiKeyInput): Promise<CreatedApiKey> {
  return apiRequest<BackendCreateKeyResponse>("/dashboard/api-keys", {
    method: "POST",
    body: JSON.stringify({
      name: input.name,
      environment: input.environment,
      monthly_spend_limit_myr: input.monthlySpendLimit,
      expires_at: input.expiration,
    }),
  }).then((res) => ({
    ...adaptApiKey(res.key as BackendApiKey),
    secret: res.full_key,
  }));
}

export function deleteApiKey(id: string): Promise<void> {
  return apiRequest<{ ok: boolean }>(`/dashboard/api-keys/${id}`, {
    method: "DELETE",
  }).then(() => {});
}

/* ------------------------------------------------------------------ */
/*  Billing                                                           */
/* ------------------------------------------------------------------ */

interface BackendBillingResponse {
  wallet: {
    availableMicroMyr: number;
    reservedMicroMyr: number;
    lifetimeTopupMicroMyr: number;
    lifetimeSpendMicroMyr: number;
  } | null;
  balance_myr: number;
  reserved_myr: number;
  lifetime_topup_myr: number;
  lifetime_spend_myr: number;
}

function adaptBilling(res: BackendBillingResponse): BillingSummary {
  const balance = res.balance_myr ?? 0;
  const avgCostPerRequest = 0.006;
  const avgTokensPerRequest = 3000;
  return {
    balance,
    estimatedRemainingRequests: Math.floor(balance / avgCostPerRequest),
    estimatedRemainingTokens: Math.floor(balance / avgCostPerRequest) * avgTokensPerRequest,
    autoReload: { enabled: false, threshold: 20, amount: 100, monthlyMaximum: 500 },
    spend30d: res.lifetime_spend_myr ?? 0,
  };
}

interface BackendLedgerEntry {
  id: string;
  walletId: string;
  type: string;
  amountMicroMyr: number;
  balanceAfterMicroMyr: number;
  requestId: string | null;
  paymentTransactionId: string | null;
  description: string | null;
  metadata: Record<string, unknown> | null;
  idempotencyKey: string | null;
  createdAt: string;
}

function adaptTransaction(t: BackendLedgerEntry): Transaction {
  const amountRm = Number((t.amountMicroMyr / 1_000_000).toFixed(2));
  let type: Transaction["type"] = "api_usage";
  if (t.type === "topup") type = "top_up";
  else if (t.type === "usage_refund") type = "refund";
  else if (t.type === "manual_adjustment") type = "adjustment";

  return {
    id: t.id,
    date: t.createdAt,
    description: t.description ?? t.type,
    type,
    amount: amountRm,
    status: amountRm >= 0 ? "succeeded" : "succeeded",
  };
}

export function getBilling(): Promise<BillingSummary> {
  return apiRequest<BackendBillingResponse>("/dashboard/billing/balance").then(adaptBilling);
}

export function getTransactions(): Promise<Transaction[]> {
  return apiRequest<{ ledger: BackendLedgerEntry[] }>(
    "/dashboard/billing/transactions"
  ).then((res) => res.ledger.map(adaptTransaction));
}

/* ------------------------------------------------------------------ */
/*  Request Logs                                                      */
/* ------------------------------------------------------------------ */

interface BackendLogEntry {
  requestId: string;
  developerAccountId: string;
  apiKeyId: string | null;
  publicModel: string;
  endpoint: string;
  status: string;
  inputTokens: number;
  outputTokens: number;
  reasoningTokens: number;
  cachedTokens: number;
  searchCount: number;
  contentPages: number;
  costMicroMyr: number;
  latencyMs: number | null;
  routingCategory: string | null;
  createdAt: string;
}

function adaptLog(entry: BackendLogEntry): RequestLog {
  return {
    id: entry.requestId,
    timestamp: entry.createdAt,
    requestId: entry.requestId,
    apiKeyName: "",
    apiKeyPrefix: "",
    endpoint: entry.endpoint,
    model: entry.publicModel,
    status: entry.status as RequestStatus,
    appName: "AtlasFlux API",
    appDomain: "api.atlasflux.my",
    inputTokens: entry.inputTokens,
    outputTokens: entry.outputTokens,
    reasoningTokens: entry.reasoningTokens,
    cachedTokens: entry.cachedTokens ?? 0,
    searchCount: entry.searchCount,
    cost: Number((entry.costMicroMyr / 1_000_000).toFixed(4)),
    latencyMs: entry.latencyMs ?? 0,
    routingCategory: entry.routingCategory ?? "general",
    reasoningEffort: "medium",
    searchDepth: "off",
  };
}

export function getRequestLogs(opts: {
  search?: string;
  status?: "all" | RequestStatus;
  limit?: number;
  offset?: number;
}): Promise<{ logs: RequestLog[]; total: number }> {
  const params = new URLSearchParams();
  if (opts.limit) params.set("limit", String(opts.limit));
  if (opts.offset) params.set("page", String(Math.floor((opts.offset / (opts.limit ?? 20)) + 1)));
  if (opts.status && opts.status !== "all") params.set("status", opts.status);
  return apiRequest<{ logs: BackendLogEntry[]; total: number }>(
    `/dashboard/logs?${params.toString()}`
  ).then((res) => ({
    logs: res.logs.map(adaptLog),
    total: res.total,
  }));
}

/* ------------------------------------------------------------------ */
/*  Current User                                                      */
/* ------------------------------------------------------------------ */

export function getCurrentUser(): Promise<{ id: string; name: string; email: string; avatarUrl: string | null; clerkId: string | null }> {
  return apiRequest<{ id: string; name: string; email: string; avatarUrl: string | null; clerkId: string | null }>("/dashboard/settings");
}
