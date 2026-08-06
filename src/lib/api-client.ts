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
  User,
} from "@/types/api";
import { getApiKeys, createMockApiKey } from "@/lib/mock-data/api-keys";
import { getBalanceSummary, getRecentActivity, getRoutingCategories, getSeries, getUsageBreakdown } from "@/lib/mock-data/overview";
import { getUsageSummary } from "@/lib/mock-data/usage";
import { getBillingSummary, getTransactions as getMockTransactions } from "@/lib/mock-data/billing";
import { getLogs } from "@/lib/mock-data/logs";
import { mockUser } from "@/lib/mock-data/user";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api.atlasflux.my";

/**
 * Set to false once the Fly.io backend is ready. All functions in this module
 * return mock data today and will call the real backend through `apiRequest`.
 */
const USE_MOCK = true;

const MOCK_DELAY = 320;

async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    ...init,
  });
  if (!res.ok) {
    throw new Error(`API request to ${path} failed with ${res.status}`);
  }
  return res.json() as Promise<T>;
}

async function mock<T>(data: T): Promise<T> {
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));
  return data;
}

export interface OverviewData {
  summary: ReturnType<typeof getBalanceSummary>;
  breakdown: ReturnType<typeof getUsageBreakdown>;
  routing: ReturnType<typeof getRoutingCategories>;
  activity: ReturnType<typeof getRecentActivity>;
  series: Record<string, ReturnType<typeof getSeries>>;
}

export function getOverviewData(): Promise<OverviewData> {
  if (!USE_MOCK) {
    return apiRequest<OverviewData>("/v1/dashboard/overview");
  }
  return mock({
    summary: getBalanceSummary(),
    breakdown: getUsageBreakdown(),
    routing: getRoutingCategories(),
    activity: getRecentActivity(8),
    series: {
      "24h": getSeries("24h"),
      "7d": getSeries("7d"),
      "30d": getSeries("30d"),
      "90d": getSeries("90d"),
    },
  });
}

export function getUsageData(filters: UsageFilters): Promise<UsageSummary> {
  if (!USE_MOCK) {
    return apiRequest<UsageSummary>(
      `/v1/dashboard/usage?range=${filters.range}&key=${filters.apiKey}&env=${filters.environment}&endpoint=${filters.endpoint}&status=${filters.status}&reasoning=${filters.reasoning}&depth=${filters.searchDepth}`
    );
  }
  return mock(getUsageSummary(filters));
}

export function listApiKeys(): Promise<ApiKey[]> {
  if (!USE_MOCK) return apiRequest<ApiKey[]>("/v1/api-keys");
  return mock(getApiKeys());
}

export function createApiKey(input: CreateApiKeyInput): Promise<CreatedApiKey> {
  if (!USE_MOCK) {
    return apiRequest<CreatedApiKey>("/v1/api-keys", {
      method: "POST",
      body: JSON.stringify(input),
    });
  }
  return mock(createMockApiKey(input));
}

export function getBilling(): Promise<BillingSummary> {
  if (!USE_MOCK) return apiRequest<BillingSummary>("/v1/billing/summary");
  return mock(getBillingSummary());
}

export function getTransactions(): Promise<Transaction[]> {
  if (!USE_MOCK) return apiRequest<Transaction[]>("/v1/billing/transactions");
  return mock(getMockTransactions());
}

export function getRequestLogs(opts: {
  search?: string;
  status?: "all" | RequestStatus;
  limit?: number;
  offset?: number;
}): Promise<{ logs: RequestLog[]; total: number }> {
  if (!USE_MOCK) {
    return apiRequest("/v1/logs", {
      method: "POST",
      body: JSON.stringify(opts),
    });
  }
  return mock(getLogs(opts));
}

export function getCurrentUser(): Promise<User> {
  if (!USE_MOCK) return apiRequest<User>("/v1/me");
  return mock(mockUser);
}
