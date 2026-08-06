import type {
  AutoReloadConfig,
  BillingSummary,
  Transaction,
} from "@/types/api";
import { intBetween, pick, round2, seededRandom } from "./util";

export const topUpOptions = [10, 25, 50, 100, 250, 500] as const;
export const popularTopUp = 100;

const rand = seededRandom(901);

export function getBillingSummary(): BillingSummary {
  return {
    balance: 87.42,
    estimatedRemainingRequests: 14800,
    estimatedRemainingTokens: 12_400_000,
    autoReload: getAutoReloadConfig(),
    spend30d: 58.76,
  };
}

export function getAutoReloadConfig(): AutoReloadConfig {
  return {
    enabled: false,
    threshold: 20,
    amount: 100,
    monthlyMaximum: 500,
  };
}

export function getTransactions(): Transaction[] {
  const rows: Transaction[] = [];
  for (let i = 0; i < 26; i += 1) {
    const type = i % 6 === 0 ? "top_up" : "api_usage";
    rows.push({
      id: `txn_${1000 + i}`,
      date: new Date(Date.now() - i * intBetween(rand, 1, 4) * 8.64e7).toISOString(),
      description:
        type === "top_up"
          ? `Top-up via card (Stripe checkout)`
          : `API usage ${new Date(Date.now() - i * 8.64e7).toLocaleDateString("en-MY", { month: "short", day: "numeric" })}`,
      type,
      amount: type === "top_up" ? pick(rand, [10, 25, 50, 100, 100, 250]) : -round2(floatFrom(rand, 0.3, 4.9)),
      status:
        type === "top_up"
          ? pick(rand, ["succeeded", "succeeded", "succeeded", "pending"])
          : "succeeded",
      receipt: type === "top_up" ? `rcpt_${1000 + i}` : undefined,
    });
  }
  return rows.sort((a, b) => b.date.localeCompare(a.date));
}

function floatFrom(rand: () => number, min: number, max: number): number {
  return rand() * (max - min) + min;
}
