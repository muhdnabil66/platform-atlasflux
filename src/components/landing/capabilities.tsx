import {
  BarChart3,
  Bot,
  Brain,
  Globe2,
  Layers,
  Search,
  Webhook,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";

const CAPABILITIES = [
  {
    icon: Layers,
    title: "Intelligent model routing",
    description:
      "Each request is routed to the best upstream model for the task. One model ID stays stable while routing adapts underneath.",
  },
  {
    icon: Brain,
    title: "Adjustable reasoning",
    description:
      "Control reasoning effort per request with low, medium and high levels to balance quality and cost.",
  },
  {
    icon: Search,
    title: "Built-in web search",
    description:
      "Ground answers in current sources with configurable search depth, result limits and content extraction.",
  },
  {
    icon: Bot,
    title: "Multimodal input",
    description:
      "Send text, images, audio and documents through the same endpoint for understanding beyond plain text.",
  },
  {
    icon: Globe2,
    title: "OpenAI-compatible API",
    description:
      "Drop-in compatible with existing OpenAI SDKs. No new client libraries required to get started.",
  },
  {
    icon: Wallet,
    title: "Usage-based billing in MYR",
    description:
      "One prepaid API balance in Malaysian Ringgit. No invoices, no monthly plans, no minimums.",
  },
  {
    icon: Webhook,
    title: "Streaming responses",
    description:
      "Token-by-token streaming for responsive chat experiences, with the same cost accounting as batch calls.",
  },
  {
    icon: BarChart3,
    title: "Detailed usage analytics",
    description:
      "Understand spend, tokens, searches, latency and errors down to the request level in the dashboard.",
  },
];

export function Capabilities() {
  return (
    <section id="product" className="border-b scroll-mt-24">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight">
            Everything you need to ship with AI
          </h2>
          <p className="mt-3 text-muted-foreground">
            A developer platform built around one stable model ID, transparent
            pricing and the control surfaces you expect.
          </p>
        </div>
        <div className="mt-10 grid gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {CAPABILITIES.map((feature) => (
            <div
              key={feature.title}
              className="group bg-background p-6 transition-colors hover:bg-muted/40"
            >
              <div
                className={cn(
                  "mb-4 flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors",
                  "group-hover:bg-accent group-hover:text-accent-foreground"
                )}
              >
                <feature.icon className="size-4.5" aria-hidden="true" />
              </div>
              <h3 className="text-sm font-semibold">{feature.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
