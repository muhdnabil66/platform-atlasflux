import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Usage-based pricing in MYR. Input at RM1.50 per 1M tokens, output at RM4.50 per 1M tokens (reasoning included), web search from RM0.05 per search. 75% OFF.",
};

const RATE_ROWS = [
  {
    metric: "Input",
    detail: "Prompt and system tokens",
    price: "RM1.50",
    unit: "per 1M tokens",
  },
  {
    metric: "Output",
    detail: "Generated tokens, reasoning included",
    price: "RM4.50",
    unit: "per 1M tokens",
  },
  {
    metric: "Web search",
    detail: "From, depending on search depth",
    price: "RM0.05",
    unit: "per search",
  },
  {
    metric: "Content extraction",
    detail: "Billed per extracted page",
    price: "RM0.01",
    unit: "per page",
  },
  {
    metric: "Extra search results",
    detail: "Results 11-20 / results 21-25",
    price: "+RM0.05 / +RM0.13",
    unit: "per search",
  },
];

const TOP_UPS = [10, 25, 50, 100, 250, 500];

const INCLUDED = [
  "No monthly commitment",
  "No minimum spend",
  "Prepaid balance in RM",
  "Spend limits per API key",
  "Usage analytics and logs",
  "Streaming and non-streaming",
];

export default function PricingPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Simple, transparent pricing
        </h1>
        <p className="mt-3 text-muted-foreground">
          Pay only for what you use. Top up a prepaid API balance in Malaysian
          Ringgit and keep an eye on spend from the dashboard.
        </p>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border p-7 lg:col-span-2">
          <h2 className="text-lg font-semibold tracking-tight">
            Rate card
            <span className="ml-2 inline-flex items-center rounded-full bg-green-500/15 px-2.5 py-0.5 text-xs font-semibold text-green-600 dark:text-green-400">
              75% OFF
            </span>
          </h2>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[480px] text-sm">
              <thead>
                <tr className="border-b">
                  <th className="pb-3 text-left font-medium text-muted-foreground">Metric</th>
                  <th className="pb-3 text-right font-medium text-muted-foreground">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {RATE_ROWS.map((row) => (
                  <tr key={row.metric}>
                    <td className="py-3">
                      <p className="font-medium">{row.metric}</p>
                      <p className="text-xs text-muted-foreground">{row.detail}</p>
                    </td>
                    <td className="py-3 text-right">
                      <p className="font-mono font-semibold tabular-nums">{row.price}</p>
                      <p className="text-xs text-muted-foreground">{row.unit}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-5 rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">
            All usage is deducted from one prepaid API balance in RM. There are
            no separate products, plans or subscriptions to manage.
          </div>
        </div>

        <div className="flex flex-col rounded-xl border bg-muted/30 p-7">
          <h2 className="text-lg font-semibold tracking-tight">Included</h2>
          <ul className="mt-5 flex flex-col gap-3">
            {INCLUDED.map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-sm">
                <span className="flex size-5 items-center justify-center rounded-full bg-success/12">
                  <Check className="size-3 text-success" aria-hidden="true" />
                </span>
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-auto pt-6">
            <Button asChild size="lg" className="w-full">
              <Link href="/sign-in">
                Get API key
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-14">
        <h2 className="text-lg font-semibold tracking-tight">Top-up options</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Add credit to your API balance whenever you need it.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {TOP_UPS.map((amount) => (
            <div
              key={amount}
              className={cn(
                "flex flex-col items-center justify-center rounded-lg border bg-background px-3 py-5",
                amount === 100 && "border-primary/40 bg-primary/5 ring-1 ring-primary/30"
              )}
            >
              <span className="font-mono text-lg font-semibold tabular-nums">RM{amount}</span>
              <span className="mt-0.5 text-xs text-muted-foreground">
                {amount === 100 ? "Most popular" : "Credit"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
