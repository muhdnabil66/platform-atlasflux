import type { ApiKey, CreatedApiKey, CreateApiKeyInput } from "@/types/api";
import { intBetween, round2, seededRandom } from "./util";

let sequence = 4;

const baseKeys: ApiKey[] = [
  {
    id: "key_1",
    name: "Production app",
    prefix: "af_live_7X3K",
    created: "2026-05-12T09:14:00.000Z",
    lastUsed: "2026-08-06T02:31:00.000Z",
    usage: 48291,
    status: "active",
    environment: "production",
    monthlySpendLimit: 250,
    expiresAt: null,
  },
  {
    id: "key_2",
    name: "Local development",
    prefix: "af_test_9Q2N",
    created: "2026-06-02T14:22:00.000Z",
    lastUsed: "2026-08-05T20:04:00.000Z",
    usage: 12204,
    status: "active",
    environment: "development",
    monthlySpendLimit: null,
    expiresAt: null,
  },
  {
    id: "key_3",
    name: "CI pipeline",
    prefix: "af_test_4M8F",
    created: "2026-07-19T08:40:00.000Z",
    lastUsed: "2026-08-06T01:12:00.000Z",
    usage: 881,
    status: "active",
    environment: "development",
    monthlySpendLimit: 10,
    expiresAt: "2026-12-31T23:59:00.000Z",
  },
  {
    id: "key_4",
    name: "Legacy worker",
    prefix: "af_live_1K6H",
    created: "2026-03-08T11:05:00.000Z",
    lastUsed: "2026-07-28T16:45:00.000Z",
    usage: 81204,
    status: "revoked",
    environment: "production",
    monthlySpendLimit: null,
    expiresAt: null,
  },
];

export function getApiKeys(): ApiKey[] {
  return baseKeys.map((k) => ({ ...k }));
}

export function getApiKeysOptions() {
  return baseKeys.filter((k) => k.status === "active");
}

export function createMockApiKey(input: CreateApiKeyInput): CreatedApiKey {
  const rand = seededRandom(Date.now() % 100000);
  const id = `key_${sequence}`;
  sequence += 1;
  const env = input.environment === "production" ? "live" : "test";
  const body = Math.floor(rand() * 0xffffffff).toString(16).toUpperCase().padStart(10, "0");
  const prefix = `af_${env}_${body.slice(0, 4)}`;
  const secret = `af_${env}_${body}${Math.floor(rand() * 0xffffffff).toString(16).toUpperCase().padStart(10, "0")}`;
  const now = new Date();
  return {
    id,
    name: input.name,
    prefix,
    secret,
    created: now.toISOString(),
    lastUsed: null,
    usage: 0,
    status: "active",
    environment: input.environment,
    monthlySpendLimit: input.monthlySpendLimit ?? null,
    expiresAt: input.expiration ?? null,
  };
}

export function getApiKeyMockStats(keyId: string) {
  const rand = seededRandom(keyId.length * 31 + 7);
  return {
    requests: intBetween(rand, 200, 1200),
    tokens: intBetween(rand, 40_000, 900_000),
    searches: intBetween(rand, 0, 60),
    spend: round2(floatFrom(rand, 0.2, 4.8)),
  };
}

function floatFrom(rand: () => number, min: number, max: number): number {
  return rand() * (max - min) + min;
}

export function revokeMockApiKey(keyId: string): void {
  const key = baseKeys.find((k) => k.id === keyId);
  if (key) key.status = "revoked";
}

export function deleteMockApiKey(keyId: string): void {
  const idx = baseKeys.findIndex((k) => k.id === keyId);
  if (idx >= 0) baseKeys.splice(idx, 1);
}

export function renameMockApiKey(keyId: string, name: string): void {
  const key = baseKeys.find((k) => k.id === keyId);
  if (key) key.name = name;
}

export function copyKeyPrefix(prefix: string): void {
  void prefix;
}
