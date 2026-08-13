import type {
  ApiKey,
  BillingSummary,
  CreateApiKeyInput,
  CreatedApiKey,
  RequestLog,
  RequestStatus,
  ReasoningEffort,
  SearchDepth,
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
type TokenProvider = () => Promise<string | null>;

let tokenProvider: TokenProvider | null = null;
let resolveTokenProviderReady: (() => void) | null = null;
const tokenProviderReady = new Promise<void>((resolve) => {
  resolveTokenProviderReady = resolve;
});

export function setTokenProvider(provider: TokenProvider): void {
  tokenProvider = provider;
  resolveTokenProviderReady?.();
  resolveTokenProviderReady = null;
}

async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const method = init?.method?.toUpperCase() ?? "GET";
  const headers: Record<string, string> = {
    ...(init?.headers as Record<string, string> | undefined),
  };
  if (method !== "DELETE") {
    headers["Content-Type"] = "application/json";
  }

  if (!tokenProvider) {
    await tokenProviderReady;
  }

  const token = tokenProvider ? await tokenProvider() : null;
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
  });

  if (!res.ok) {
    if (res.status === 401) {
      if (!token && typeof window !== "undefined" && !window.location.pathname.startsWith("/sign-in")) {
        window.location.assign(new URL("/sign-in", window.location.origin));
      }
      throw new Error(
        token
          ? "The API rejected the current Clerk session. Check that the API and dashboard use the same Clerk instance."
          : "Session expired. Please sign in again."
      );
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

function adaptOverview(res: BackendOverviewResponse, logs: BackendLogEntry[] = []): OverviewData {
  const balanceRm = res.wallet
    ? Number(((res.wallet.availableMicroMyr ?? 0) / 1_000_000).toFixed(2))
    : 0;
  const todaySpendRm = Number(((res.today_usage.costMicroMyr ?? 0) / 1_000_000).toFixed(6));

  const series = res.daily_series.map((p) => ({
    time: p.bucket,
    timestamp: new Date(p.bucket).getTime(),
    spend: Number((p.costMicroMyr / 1_000_000).toFixed(6)),
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
    routing: buildRoutingBreakdown(logs),
    activity: logs.slice(0, 20).map((entry) => ({
      id: entry.requestId,
      time: entry.createdAt,
      requestId: entry.requestId,
      endpoint: entry.endpoint,
      status: entry.status as RequestStatus,
      tokens: entry.inputTokens + entry.outputTokens + entry.reasoningTokens,
      search: entry.searchCount,
      cost: Number((entry.costMicroMyr / 1_000_000).toFixed(6)),
      latencyMs: entry.latencyMs ?? 0,
    })),
    series: { "24h": [], "7d": series, "30d": series, "90d": series },
  };
}

function buildRoutingBreakdown(logs: BackendLogEntry[]): OverviewData["routing"] {
  const totals = new Map<string, { requests: number; cost: number }>();
  for (const entry of logs) {
    const category = entry.routingCategory || "general";
    const current = totals.get(category) ?? { requests: 0, cost: 0 };
    current.requests += 1;
    current.cost += entry.costMicroMyr;
    totals.set(category, current);
  }
  const totalRequests = [...totals.values()].reduce((sum, value) => sum + value.requests, 0);
  return [...totals.entries()]
    .sort((a, b) => b[1].requests - a[1].requests)
    .map(([id, value]) => ({
      id,
      name: id.charAt(0).toUpperCase() + id.slice(1),
      share: totalRequests > 0 ? Number(((value.requests / totalRequests) * 100).toFixed(1)) : 0,
      requests: value.requests,
      cost: Number((value.cost / 1_000_000).toFixed(6)),
    }));
}

export async function getOverviewData(): Promise<OverviewData> {
  const [overviewResult, logsResult] = await Promise.all([
    apiRequest<BackendOverviewResponse>("/dashboard/overview"),
    apiRequest<{ logs: BackendLogEntry[] }>("/dashboard/logs?limit=20"),
  ]);
  return adaptOverview(overviewResult, logsResult.logs);
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
  if (filters.apiKey && filters.apiKey !== "all") params.set("api_key_id", filters.apiKey);
  if (filters.environment !== "all") params.set("environment", filters.environment);
  if (filters.endpoint !== "all") params.set("endpoint", filters.endpoint);
  if (filters.status !== "all") params.set("status", filters.status);
  if (filters.reasoning !== "all") params.set("reasoning_effort", filters.reasoning);
  if (filters.searchDepth !== "all") params.set("search_depth", filters.searchDepth);
  return apiRequest<{
    from: string;
    to: string;
    granularity: string;
    series: Array<{ bucket: string; requests: number; costMicroMyr: number; inputTokens: number; outputTokens: number; reasoningTokens: number; searchCount: number; contentPages: number; latencySumMs: number; successfulRequests: number; failedRequests: number }>;
    overview: { requests: number; inputTokens: number; outputTokens: number; reasoningTokens: number; searchCount: number; contentPages: number; costMicroMyr: number; latencySumMs: number; failedRequests: number };
    cost_breakdown: { inputCostMicroMyr: number; outputCostMicroMyr: number; reasoningCostMicroMyr: number; searchCostMicroMyr: number; contentCostMicroMyr: number };
    by_key: Array<{ key_id: string; key_name: string; prefix: string; requests: number; tokens: number; searches: number; spend_micro_myr: number }>;
    by_category: Array<{ id: string; name: string; requests: number; spend_micro_myr: number }>;
    }>(`/dashboard/usage?${params.toString()}`).then((res) => {
    const series = res.series.map((point) => ({
      time: point.bucket,
      timestamp: new Date(point.bucket).getTime(),
      spend: Number((point.costMicroMyr / 1_000_000).toFixed(6)),
      requests: point.requests,
      tokens: point.inputTokens + point.outputTokens + point.reasoningTokens,
    }));
    const totalSpend = Number((res.overview.costMicroMyr / 1_000_000).toFixed(6));
    const totalRequests = res.overview.requests;
    const totalTokens = res.overview.inputTokens + res.overview.outputTokens + res.overview.reasoningTokens;
    return {
      filters,
      series,
      totals: {
        spend: totalSpend,
        requests: totalRequests,
        tokens: totalTokens,
        webSearches: res.overview.searchCount,
        latencyMs: totalRequests > 0 ? Math.round(res.overview.latencySumMs / totalRequests) : 0,
        errorRate: totalRequests > 0 ? res.overview.failedRequests / totalRequests : 0,
      },
      costBreakdown: {
        inputTokenCost: Number((res.cost_breakdown.inputCostMicroMyr / 1_000_000).toFixed(6)),
        outputTokenCost: Number((res.cost_breakdown.outputCostMicroMyr / 1_000_000).toFixed(6)),
        reasoningCost: Number((res.cost_breakdown.reasoningCostMicroMyr / 1_000_000).toFixed(6)),
        searchCost: Number((res.cost_breakdown.searchCostMicroMyr / 1_000_000).toFixed(6)),
        contentCost: Number((res.cost_breakdown.contentCostMicroMyr / 1_000_000).toFixed(6)),
      },
      byKey: res.by_key.map((key) => ({
        keyId: key.key_id,
        keyName: key.key_name,
        prefix: key.prefix,
        requests: key.requests,
        tokens: key.tokens,
        searches: key.searches,
        spend: Number((key.spend_micro_myr / 1_000_000).toFixed(6)),
      })),
      byCategory: res.by_category.map((category) => ({
        id: category.id,
        name: category.name,
        requests: category.requests,
        spend: Number((category.spend_micro_myr / 1_000_000).toFixed(6)),
        share: res.overview.requests > 0 ? category.requests / res.overview.requests : 0,
      })),
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

function adaptApiKey(k: BackendApiKey, usage = 0): ApiKey {
  return {
    id: k.id,
    name: k.name,
    prefix: k.prefix,
    created: k.created_at,
    lastUsed: k.last_used_at,
    usage,
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

export async function listApiKeys(): Promise<ApiKey[]> {
  const [keysResult, usageResult] = await Promise.all([
    apiRequest<{ keys: BackendApiKey[] }>("/dashboard/api-keys"),
    apiRequest<{ by_key: Array<{ key_id: string; requests: number }> }>(
      `/dashboard/usage?from=${encodeURIComponent(rangeToIso("90d"))}&to=${encodeURIComponent(new Date().toISOString())}&granularity=day`
    ),
  ]);
  const usageByKey = new Map(usageResult.by_key.map((key) => [key.key_id, key.requests]));
  return keysResult.keys.map((key) => adaptApiKey(key, usageByKey.get(key.id) ?? 0));
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
  balance_myr: string;
  reserved_myr: string;
  lifetime_topup_myr: string;
  lifetime_spend_myr: string;
  usage_30d: {
    requests: number;
    inputTokens: number;
    outputTokens: number;
    reasoningTokens: number;
    costMicroMyr: number;
  };
  auto_reload: {
    enabled: boolean;
    threshold_myr: string | null;
    amount_myr: string | null;
    monthly_max_myr: string | null;
  };
}

function adaptBilling(res: BackendBillingResponse): BillingSummary {
  const balance = Number(res.balance_myr ?? 0);
  const requestCount = res.usage_30d?.requests ?? 0;
  const spend30d = Number(((res.usage_30d?.costMicroMyr ?? 0) / 1_000_000).toFixed(6));
  const avgCostPerRequest = requestCount > 0 ? spend30d / requestCount : 0;
  const avgTokensPerRequest = requestCount > 0
    ? Math.round(((res.usage_30d.inputTokens ?? 0) + (res.usage_30d.outputTokens ?? 0) + (res.usage_30d.reasoningTokens ?? 0)) / requestCount)
    : 0;
  return {
    balance,
    estimatedRemainingRequests: avgCostPerRequest > 0 ? Math.floor(balance / avgCostPerRequest) : 0,
    estimatedRemainingTokens: avgCostPerRequest > 0 ? Math.floor(balance / avgCostPerRequest) * avgTokensPerRequest : 0,
    autoReload: {
      enabled: res.auto_reload?.enabled ?? false,
      threshold: Number(res.auto_reload?.threshold_myr ?? 0),
      amount: Number(res.auto_reload?.amount_myr ?? 0),
      monthlyMaximum: res.auto_reload?.monthly_max_myr != null ? Number(res.auto_reload.monthly_max_myr) : null,
    },
    spend30d,
  };
}

export function renameApiKey(id: string, name: string): Promise<void> {
  return apiRequest<{ key: BackendApiKey }>(`/dashboard/api-keys/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ name }),
  }).then(() => {});
}

export function revokeApiKey(id: string): Promise<void> {
  return apiRequest<{ key: BackendApiKey }>(`/dashboard/api-keys/${id}/revoke`, {
    method: "POST",
    body: "{}",
  }).then(() => {});
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
  const amountRm = Number((t.amountMicroMyr / 1_000_000).toFixed(6));
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
  reasoningEffort?: ReasoningEffort | null;
  searchDepth?: SearchDepth | null;
  createdAt: string;
  errorCode?: string | null;
  usageSource?: "provider" | "estimated";
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
    cost: Number((entry.costMicroMyr / 1_000_000).toFixed(6)),
    latencyMs: entry.latencyMs ?? 0,
    routingCategory: entry.routingCategory ?? "general",
    reasoningEffort: entry.reasoningEffort ?? null,
    searchDepth: entry.searchDepth ?? null,
    error: entry.errorCode ?? null,
    usageSource: entry.usageSource ?? "estimated",
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
  if (opts.search?.trim()) params.set("search", opts.search.trim());
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

/* ------------------------------------------------------------------ */
/*  Settings / Profile                                                */
/* ------------------------------------------------------------------ */

export function updateProfile(data: { name?: string }): Promise<{ ok: boolean }> {
  return apiRequest<{ ok: boolean }>("/dashboard/profile", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function updateSettings(data: {
  auto_reload?: { enabled: boolean; threshold_myr?: number | null; amount_myr?: number | null; monthly_max_myr?: number | null };
  low_balance_threshold_myr?: number | null;
  monthly_spend_limit_myr?: number | null;
  preferences?: Record<string, unknown>;
  notifications?: Record<string, boolean>;
}): Promise<{ settings: unknown }> {
  return apiRequest<{ settings: unknown }>("/dashboard/settings", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function getSettings(): Promise<{ settings: Record<string, unknown> | null }> {
  return apiRequest<{ settings: Record<string, unknown> | null }>("/dashboard/settings");
}

/* ------------------------------------------------------------------ */
/*  Security                                                          */
/* ------------------------------------------------------------------ */

export function revokeAllApiKeys(): Promise<{ revoked: number }> {
  return apiRequest<{ revoked: number }>("/dashboard/api-keys/revoke-all", {
    method: "POST",
    body: "{}",
  });
}

/* ------------------------------------------------------------------ */
/*  Payment Card / Auto-Reload                                        */
/* ------------------------------------------------------------------ */

export function createSetupIntent(): Promise<{ client_secret: string; setup_intent_id: string; customer_id: string }> {
  return apiRequest<{ client_secret: string; setup_intent_id: string; customer_id: string }>(
    "/dashboard/billing/setup-intent",
    { method: "POST", body: "{}" }
  );
}

export function getPaymentMethod(): Promise<{ payment_method: { id: string; brand: string; last4: string; exp_month: number; exp_year: number } | null }> {
  return apiRequest<{ payment_method: { id: string; brand: string; last4: string; exp_month: number; exp_year: number } | null }>(
    "/dashboard/billing/payment-method"
  );
}

export function removePaymentMethod(): Promise<{ ok: boolean }> {
  return apiRequest<{ ok: boolean }>("/dashboard/billing/payment-method", {
    method: "DELETE",
  });
}
