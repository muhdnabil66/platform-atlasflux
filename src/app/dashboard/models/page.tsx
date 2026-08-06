import { Bot, Brain, Check, FileJson, Globe2, Rows3, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { nenasFlash } from "@/config/models";
import { formatRM } from "@/lib/format";

const CAPABILITIES = [
  { icon: Zap, label: "Text output", hint: "Chat and completion style responses" },
  { icon: Brain, label: "Adjustable reasoning", hint: "Low, medium and high effort" },
  { icon: Globe2, label: "Built-in web search", hint: "5 depth tiers with content extraction" },
  { icon: Rows3, label: "Multimodal input", hint: "Text, images, audio and documents" },
  { icon: Check, label: "Streaming", hint: "Token-by-token responses" },
  { icon: FileJson, label: "Tool calling", hint: "Function calling support" },
  { icon: Check, label: "Structured output", hint: "JSON schema responses" },
];

export default function DashboardModelsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <Badge variant="secondary" className="mb-3 font-mono">
          {nenasFlash.id}
        </Badge>
        <h1 className="text-xl font-semibold tracking-tight">Nenas Flash</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          {nenasFlash.description}
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="size-4 text-muted-foreground" aria-hidden="true" />
              Capabilities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="grid gap-3 sm:grid-cols-2">
              {CAPABILITIES.map((capability) => (
                <li
                  key={capability.label}
                  className="flex items-start gap-2.5 rounded-lg border bg-background p-3"
                >
                  <capability.icon
                    className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="text-sm font-medium">{capability.label}</p>
                    <p className="text-xs text-muted-foreground">{capability.hint}</p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="flex flex-col divide-y">
                <li className="flex items-center justify-between py-2.5">
                  <span className="text-sm text-muted-foreground">Input</span>
                  <span className="font-mono text-sm font-medium tabular-nums">
                    {formatRM(nenasFlash.pricing.inputPerMillion)} / 1M tokens
                  </span>
                </li>
                <li className="flex items-center justify-between py-2.5">
                  <span className="text-sm text-muted-foreground">Output</span>
                  <span className="font-mono text-sm font-medium tabular-nums">
                    {formatRM(nenasFlash.pricing.outputPerMillion)} / 1M tokens
                  </span>
                </li>
                <li className="flex items-center justify-between py-2.5">
                  <span className="text-sm text-muted-foreground">Web search</span>
                  <span className="font-mono text-sm font-medium tabular-nums">
                    from {formatRM(nenasFlash.pricing.webSearchFrom)} / search
                  </span>
                </li>
                <li className="flex items-center justify-between py-2.5">
                  <span className="text-sm text-muted-foreground">Context window</span>
                  <span className="font-mono text-sm font-medium tabular-nums">
                    {nenasFlash.contextWindow}
                  </span>
                </li>
                <li className="flex items-center justify-between py-2.5">
                  <span className="text-sm text-muted-foreground">Max output</span>
                  <span className="font-mono text-sm font-medium tabular-nums">
                    {(nenasFlash.maxOutputTokens / 1024).toFixed(0)}K tokens
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
