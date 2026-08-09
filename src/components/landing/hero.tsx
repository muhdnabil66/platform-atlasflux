import Link from "next/link";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/shared/code-block";
import { Badge } from "@/components/ui/badge";
import { LandingPrimaryCta } from "@/components/landing/auth-actions";

const REQUEST_CODE = `curl https://api.atlasflux.my/v1/responses \\
  -H "Authorization: Bearer $ATLASFLUX_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "atlasflux/nenas-flash",
    "input": "Explain this architecture",
    "reasoning": {
      "effort": "medium"
    }
  }'`;

const RESPONSE_CODE = `{
  "id": "resp_arq_8f2k3m9x",
  "object": "response",
  "status": "completed",
  "model": "atlasflux/nenas-flash",
  "output_text": "This architecture uses a single API gateway...",
  "usage": {
    "input_tokens": 1842,
    "output_tokens": 512,
    "reasoning_tokens": 640,
    "cached_tokens": 0,
    "searches": 0,
    "content_pages": 0,
    "total_tokens": 2994,
    "cost_myr": "0.04",
    "latency_ms": 1840
  },
  "request_id": "arq_8f2k3m9x"
}`;

export function Hero() {
  return (
    <section className="border-b">
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="gap-1.5">
              <span className="size-1.5 rounded-full bg-success" aria-hidden="true" />
              Open for developers
            </Badge>
            <Badge variant="secondary">OpenAI-compatible</Badge>
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            One API. Intelligent model routing.
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Access AtlasFlux Nenas Flash through a single OpenAI-compatible API
            with reasoning, multimodal understanding, web search and automatic
            model routing.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <LandingPrimaryCta />
            <Button asChild variant="outline" size="lg">
              <Link href="https://api-docs.atlasflux.my">
                <BookOpen className="size-4" aria-hidden="true" />
                View documentation
              </Link>
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span>No monthly commitment</span>
            <span aria-hidden="true" className="text-border">•</span>
            <span>Prepaid balance in RM</span>
            <span aria-hidden="true" className="text-border">•</span>
            <span>Usage-based billing</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <CodeBlock code={REQUEST_CODE} language="bash" />
          <CodeBlock code={RESPONSE_CODE} language="json" />
        </div>
      </div>
    </section>
  );
}
