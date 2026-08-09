export type RequestStatus =
  | "success"
  | "failed"
  | "rate_limited"
  | "pending"
  | "cancelled"
  | "succeeded"
  | "billed";

export type Environment = "live" | "test";

export type TimeRange = "24h" | "7d" | "30d" | "90d";

export type ReasoningEffort = "low" | "medium" | "high";

export type SearchMode = "off" | "auto" | "on";

export type SearchDepth = "instant" | "fast" | "balanced" | "deep" | "reasoning";

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  clerkId: string | null;
}

export interface BalanceSummary {
  balance: number;
  currency: "RM";
  spendToday: number;
  spendDeltaPercent: number;
  requestsToday: number;
  requestsDeltaPercent: number;
  totalTokens: number;
  totalTokensDeltaPercent: number;
  projectedDailySpend: number;
}

export interface SeriesPoint {
  time: string;
  timestamp: number;
  spend: number;
  requests: number;
  tokens: number;
}

export interface UsageBreakdown {
  inputTokens: number;
  outputTokens: number;
  reasoningTokens: number;
  webSearches: number;
  contentPages: number;
}

export interface RoutingCategory {
  id: string;
  name: string;
  share: number;
  requests: number;
  cost: number;
}

export interface ActivityItem {
  id: string;
  time: string;
  requestId: string;
  endpoint: string;
  status: RequestStatus;
  tokens: number;
  search: number;
  cost: number;
  latencyMs: number;
}

export interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  created: string;
  lastUsed: string | null;
  usage: number;
  status: "active" | "revoked" | "expired";
  environment: Environment;
  monthlySpendLimit: number | null;
  expiresAt: string | null;
}

export interface CreateApiKeyInput {
  name: string;
  environment: Environment;
  monthlySpendLimit?: number;
  expiration?: string;
}

export interface CreatedApiKey extends ApiKey {
  secret: string;
}

export interface PlaygroundConfig {
  model: string;
  input: string;
  systemInstruction: string;
  temperature: number;
  maxOutputTokens: number;
  stream: boolean;
  reasoning: ReasoningEffort;
  searchMode: SearchMode;
  searchDepth: SearchDepth;
  maxResults: number;
  maxSearches: number;
  contentExtraction: boolean;
  maxContentPages: number;
  maxTotalCost: number;
}

export interface Citation {
  index: number;
  title: string;
  url: string;
  publisher: string;
  date: string;
  snippet: string;
}

export interface CostBreakdown {
  inputTokenCost: number;
  outputTokenCost: number;
  reasoningCost: number;
  searchCost: number;
  contentCost: number;
}

export interface PlaygroundUsage {
  inputTokens: number;
  outputTokens: number;
  reasoningTokens: number;
  cachedTokens: number;
  searches: number;
  contentPages: number;
  costs: CostBreakdown;
  totalCost: number;
  latencyMs: number;
  routingCategory: string;
  requestId: string;
}

export interface PlaygroundResponse {
  content: string;
  citations: Citation[];
  usage: PlaygroundUsage;
  finishReason: string;
  createdAt: string;
}

export interface UsageFilters {
  range: TimeRange;
  apiKey: string;
  environment: "all" | Environment;
  endpoint: string;
  status: "all" | RequestStatus;
  reasoning: "all" | ReasoningEffort;
  searchDepth: "all" | SearchDepth;
}

export interface UsageByKey {
  keyId: string;
  keyName: string;
  prefix: string;
  requests: number;
  tokens: number;
  searches: number;
  spend: number;
}

export interface UsageByCategory {
  id: string;
  name: string;
  requests: number;
  spend: number;
  share: number;
}

export interface UsageSummary {
  filters: UsageFilters;
  series: SeriesPoint[];
  totals: {
    spend: number;
    requests: number;
    tokens: number;
    webSearches: number;
    latencyMs: number;
    errorRate: number;
  };
  costBreakdown: CostBreakdown;
  byKey: UsageByKey[];
  byCategory: UsageByCategory[];
}

export interface RequestLog {
  id: string;
  timestamp: string;
  requestId: string;
  apiKeyName: string;
  apiKeyPrefix: string;
  endpoint: string;
  model: string;
  status: RequestStatus;
  appName: string;
  appDomain: string;
  inputTokens: number;
  outputTokens: number;
  reasoningTokens: number;
  cachedTokens: number;
  searchCount: number;
  cost: number;
  latencyMs: number;
  routingCategory: string;
  // These fields were not persisted by the original API request ledger.
  // Keep them nullable so the dashboard never presents invented values.
  reasoningEffort: ReasoningEffort | null;
  searchDepth: SearchDepth | "off" | null;
  error?: string | null;
  costs?: CostBreakdown;
}

export type TransactionType = "top_up" | "api_usage" | "refund" | "adjustment";

export type TransactionStatus = "succeeded" | "pending" | "failed" | "refunded";

export interface AutoReloadConfig {
  enabled: boolean;
  threshold: number;
  amount: number;
  monthlyMaximum: number | null;
}

export interface BillingSummary {
  balance: number;
  estimatedRemainingRequests: number;
  estimatedRemainingTokens: number;
  autoReload: AutoReloadConfig;
  spend30d: number;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  receipt?: string;
}

export interface ModelPricing {
  inputPerMillion: number;
  outputPerMillion: number;
  webSearchFrom: number;
  reasoningBilledAtOutput: boolean;
}

export interface ModelInfo {
  id: string;
  name: string;
  tagline: string;
  description: string;
  inputTypes: string[];
  contextWindow: string;
  maxOutputTokens: number;
  multimodal: boolean;
  reasoning: boolean;
  webSearch: boolean;
  streaming: boolean;
  toolCalling: boolean;
  structuredOutput: boolean;
  pricing: ModelPricing;
}

export interface SearchTier {
  id: SearchDepth;
  name: string;
  bestFor: string;
  typicalLatency: string;
  searchQuality: string;
  basePrice: number;
  recommendedMaxResults: number;
}

export interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}
