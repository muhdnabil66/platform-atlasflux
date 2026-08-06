import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/shared/code-block";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Documentation",
  description:
    "Get started with the AtlasFlux API: authentication, endpoints and code examples.",
};

const AUTH_CODE = `curl https://api.atlasflux.my/v1/responses \\
  -H "Authorization: Bearer $ATLASFLUX_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "atlasflux/nenas-flash",
    "input": "Hello, explain the AtlasFlux API in one sentence"
  }'`;

const JS_CODE = `const res = await fetch("https://api.atlasflux.my/v1/responses", {
  method: "POST",
  headers: {
    "Authorization": \`Bearer \${process.env.ATLASFLUX_API_KEY}\`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: "atlasflux/nenas-flash",
    input: "Summarize this document",
    reasoning: { effort: "medium" },
  }),
});
const data = await res.json();`;

const PYTHON_CODE = `import requests

resp = requests.post(
    "https://api.atlasflux.my/v1/responses",
    headers={"Authorization": f"Bearer {ATLASFLUX_API_KEY}"},
    json={
        "model": "atlasflux/nenas-flash",
        "input": "Summarize this document",
        "reasoning": {"effort": "medium"},
    },
)
data = resp.json()`;

const STEPS = [
  {
    title: "Create an account",
    body: "Sign in with your AtlasFlux account. The same authentication is shared with AtlasFlux AI, but your API balance is separate.",
  },
  {
    title: "Generate an API key",
    body: "Create a key in the dashboard. Store it securely, it is shown only once. Use development keys while testing.",
  },
  {
    title: "Top up your balance",
    body: "Add prepaid credit in RM. All usage is deducted from this balance with no monthly commitment.",
  },
  {
    title: "Make your first request",
    body: "Call the responses endpoint with model atlasflux/nenas-flash. Streaming, reasoning and web search are enabled through request parameters.",
  },
];

const CONCEPTS = [
  {
    title: "One model ID",
    body: "Requests use atlasflux/nenas-flash. AtlasFlux routes to the best upstream model and you never manage providers.",
  },
  {
    title: "Reasoning",
    body: "Set reasoning.effort to low, medium or high. Reasoning tokens are billed at the output rate.",
  },
  {
    title: "Web search",
    body: "Enable search with modes off, auto or on, and depth from instant to reasoning. Content extraction is billed per page.",
  },
  {
    title: "Billing",
    body: "Prepaid balance in MYR. Spend is visible in real time and optional per-key monthly limits help control cost.",
  },
];

export default function DocsPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6">
      <Badge variant="secondary" className="mb-4">Documentation</Badge>
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        Quickstart
      </h1>
      <p className="mt-3 text-muted-foreground">
        AtlasFlux exposes an OpenAI-compatible API at{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[13px]">
          https://api.atlasflux.my
        </code>
        . This page is a frontend preview; full endpoint reference will follow
        with the backend.
      </p>

      <section className="mt-12">
        <h2 className="text-xl font-semibold tracking-tight">Getting started</h2>
        <ol className="mt-5 flex flex-col gap-5">
          {STEPS.map((step, index) => (
            <li key={step.title} className="flex gap-4">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full border bg-muted text-sm font-semibold tabular-nums">
                {index + 1}
              </span>
              <div>
                <h3 className="text-sm font-semibold">{step.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {step.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold tracking-tight">Authentication</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Authenticate with a bearer token. Keep keys on the server and never
          expose them in client code.
        </p>
        <div className="mt-4">
          <CodeBlock code={AUTH_CODE} language="bash" />
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold tracking-tight">Code examples</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          The API is compatible with standard OpenAI-style clients.
        </p>
        <div className="mt-4 flex flex-col gap-4">
          <CodeBlock code={JS_CODE} language="javascript" />
          <CodeBlock code={PYTHON_CODE} language="python" />
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold tracking-tight">Key concepts</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {CONCEPTS.map((concept) => (
            <div key={concept.title} className="rounded-xl border p-5">
              <h3 className="text-sm font-semibold">{concept.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {concept.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-12 rounded-xl border bg-muted/30 p-6">
        <h2 className="text-lg font-semibold tracking-tight">
          Ready to build?
        </h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Generate an API key and make your first request from the dashboard.
        </p>
        <Button asChild size="lg" className="mt-4">
          <Link href="/sign-in">
            Get API key
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
