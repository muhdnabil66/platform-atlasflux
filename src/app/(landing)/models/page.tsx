import type { Metadata } from "next";
import { Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { nenasFlash } from "@/config/models";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatRM } from "@/lib/format";

export const metadata: Metadata = {
  title: "Models",
  description:
    "AtlasFlux Nenas Flash: one model ID for reasoning, multimodal input, web search and structured output.",
};

const CAPABILITY_ROWS = [
  { label: "Text output", value: "Supported", hint: "Chat and completion style output" },
  { label: "Multimodal input", value: "Supported", hint: "Text, images, audio and documents" },
  { label: "Adjustable reasoning", value: "Low / Medium / High", hint: "Set reasoning.effort per request" },
  { label: "Built-in web search", value: "Available", hint: "5 search depth tiers" },
  { label: "Streaming", value: "Supported", hint: "Token-by-token streaming" },
  { label: "Tool calling", value: "Supported", hint: "Function and tool use" },
  { label: "Structured output", value: "Supported", hint: "JSON schema responses" },
  { label: "Context window", value: nenasFlash.contextWindow, hint: "Effective context with intelligent routing" },
  { label: "Max output", value: `${(nenasFlash.maxOutputTokens / 1024).toFixed(0)}K tokens`, hint: "Maximum output tokens per request" },
];

export default function ModelsPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
      <div className="max-w-2xl">
        <Badge variant="secondary" className="font-mono mb-4">
          {nenasFlash.id}
        </Badge>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Nenas Flash
        </h1>
        <p className="mt-3 text-muted-foreground">{nenasFlash.description}</p>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border p-7 lg:col-span-2">
          <h2 className="text-lg font-semibold tracking-tight">Capabilities</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[440px] text-sm">
              <tbody className="divide-y">
                {CAPABILITY_ROWS.map((row) => (
                  <tr key={row.label}>
                    <td className="py-3 font-medium">{row.label}</td>
                    <td className="py-3 text-right">
                      <span className="font-medium">{row.value}</span>
                    </td>
                    <td className="w-8 py-3 pl-2">
                      <Tooltip delayDuration={200}>
                        <TooltipTrigger asChild>
                          <button
                            className="ml-auto flex rounded-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            aria-label={`About ${row.label}`}
                          >
                            <Info className="size-3.5" aria-hidden="true" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="left">{row.hint}</TooltipContent>
                      </Tooltip>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="rounded-xl border p-6">
            <h2 className="text-lg font-semibold tracking-tight">Pricing</h2>
            <ul className="mt-4 flex flex-col gap-3">
              <li className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Input</span>
                <span className="font-mono font-medium tabular-nums">
                  {formatRM(nenasFlash.pricing.inputPerMillion)} / 1M tokens
                </span>
              </li>
              <li className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Output</span>
                <span className="font-mono font-medium tabular-nums">
                  {formatRM(nenasFlash.pricing.outputPerMillion)} / 1M tokens
                </span>
              </li>
              <li className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Web search</span>
                <span className="font-mono font-medium tabular-nums">
                  from {formatRM(nenasFlash.pricing.webSearchFrom)} / search
                </span>
              </li>
              <li className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Reasoning</span>
                <span className="font-mono font-medium tabular-nums">included in output</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
