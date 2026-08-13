import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { nenasFlash } from "@/config/models";

const FEATURES = [
  { label: "Adjustable reasoning effort", enabled: true },
  { label: "Built-in web search", enabled: true },
  { label: "Multimodal input", enabled: true },
  { label: "Streaming responses", enabled: true },
  { label: "Tool calling", enabled: true },
  { label: "Structured output", enabled: true },
];

export function ModelSection() {
  return (
    <section id="models" className="border-b scroll-mt-24">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight">
            The AtlasFlux model
          </h2>
          <p className="mt-3 text-muted-foreground">
            AtlasFlux exposes one primary model ID. Behind it, requests are
            optimised for the task at hand so you get good results without
            managing providers.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border p-7">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="font-mono">
                {nenasFlash.id}
              </Badge>
            </div>
            <h3 className="mt-3 text-xl font-semibold tracking-tight">
              Nenas Flash
            </h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              {nenasFlash.tagline}
            </p>
            <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
              {FEATURES.map((feature) => (
                <li key={feature.label} className="flex items-center gap-2 text-sm">
                  <span className="flex size-5 items-center justify-center rounded-full bg-success/12">
                    <Check className="size-3 text-success" aria-hidden="true" />
                  </span>
                  {feature.label}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col rounded-xl border bg-muted/30 p-7">
            <h3 className="text-lg font-semibold tracking-tight">
              Transparent routing
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              AtlasFlux routes each request to the most suitable upstream model.
              The public model ID never changes, even if the underlying routing
              or upstream availability is adjusted to improve quality and
              reliability.
            </p>
            <div className="mt-6 flex flex-col gap-2.5">
              <div className="flex items-center justify-between rounded-lg border bg-background px-4 py-3 text-sm">
                <span className="text-muted-foreground">Input</span>
                <span className="font-mono font-medium">RM1.50 per 1M tokens</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border bg-background px-4 py-3 text-sm">
                <span className="text-muted-foreground">Output</span>
                <span className="font-mono font-medium">RM4.50 per 1M tokens</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border bg-background px-4 py-3 text-sm">
                <span className="text-muted-foreground">Web search</span>
                <span className="font-mono font-medium">from RM0.05 per search</span>
              </div>
            </div>
            <div className="mt-auto pt-6">
              <Button asChild variant="outline">
                <Link href="/models">
                  Explore the model
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
