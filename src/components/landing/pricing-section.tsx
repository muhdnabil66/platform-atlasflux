import { Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { LandingPrimaryCta } from "@/components/landing/auth-actions";

const PRICING_ROWS = [
  {
    label: "Input",
    price: "RM5",
    unit: "per 1M tokens",
    hint: "Prompt and system tokens",
  },
  {
    label: "Output",
    price: "RM25",
    unit: "per 1M tokens",
    hint: "Generated tokens",
  },
  {
    label: "Web search",
    price: "RM0.05",
    unit: "per search",
    hint: "From, depending on depth",
  },
  {
    label: "Reasoning",
    price: "Output rate",
    unit: "per 1M tokens",
    hint: "Reasoning tokens billed at the output rate",
  },
];

const TOP_UPS = [10, 25, 50, 100, 250, 500];

export function PricingSection() {
  return (
    <section id="pricing" className="border-b">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight">
            Simple, prepaid pricing in MYR
          </h2>
          <p className="mt-3 text-muted-foreground">
            All usage is deducted from a single prepaid API balance. Top up when
            you need to, with no monthly commitment and no minimum spend.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border p-7">
            <h3 className="text-sm font-semibold text-muted-foreground">
              Rate card
            </h3>
            <ul className="mt-4 divide-y">
              {PRICING_ROWS.map((row) => (
                <li
                  key={row.label}
                  className="flex items-center justify-between gap-4 py-3.5"
                >
                  <div>
                    <p className="text-sm font-medium">{row.label}</p>
                    <p className="text-xs text-muted-foreground">{row.hint}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-sm font-semibold tabular-nums">
                      {row.price}
                    </p>
                    <p className="text-xs text-muted-foreground">{row.unit}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex items-start gap-2.5 rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">
              <Check className="mt-0.5 size-4 shrink-0 text-success" aria-hidden="true" />
              <p>
                Reasoning tokens are billed at the output rate. Search results
                above 10 and extracted content pages are billed as additional
                usage.
              </p>
            </div>
          </div>

          <div className="flex flex-col rounded-xl border bg-muted/30 p-7">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-muted-foreground">
                Top-up options
              </h3>
              <Badge icon={Sparkles}>Popular: RM100</Badge>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {TOP_UPS.map((amount) => (
                <div
                  key={amount}
                  className={cn(
                    "flex flex-col items-center justify-center rounded-lg border bg-background px-3 py-4",
                    amount === 100 &&
                      "border-primary/40 bg-primary/5 ring-1 ring-primary/30"
                  )}
                >
                  <span className="font-mono text-lg font-semibold tabular-nums">
                    RM{amount}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {amount === 100 ? "Most popular" : "Credit"}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
              Topping up adds prepaid credit to your API balance. There are no
              plans to buy and no expiring credits.
            </p>
            <div className="mt-auto pt-6">
              <div className="[&>a]:w-full [&>a]:justify-center">
                <LandingPrimaryCta />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Badge({ children, icon: Icon }: { children: React.ReactNode; icon?: typeof Sparkles }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-accent-foreground">
      {Icon && <Icon className="size-3" aria-hidden="true" />}
      {children}
    </span>
  );
}
