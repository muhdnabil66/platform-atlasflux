"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Settings2 } from "lucide-react";
import { toast } from "sonner";
import type { PlaygroundConfig, PlaygroundResponse } from "@/types/api";
import { nenasFlash } from "@/config/models";
import { generateMockResponse } from "@/lib/mock-data/playground";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ConfigPanel } from "@/components/playground/config-panel";
import { PromptPanel } from "@/components/playground/prompt-panel";
import { ResponsePanel } from "@/components/playground/response-panel";

const DEFAULT_CONFIG: PlaygroundConfig = {
  model: nenasFlash.id,
  input:
    "Explain the AtlasFlux API and how intelligent model routing works in a few paragraphs.",
  systemInstruction: "",
  temperature: 0.7,
  maxOutputTokens: 2048,
  stream: true,
  reasoning: "medium",
  searchMode: "auto",
  searchDepth: "balanced",
  maxResults: 10,
  maxSearches: 3,
  contentExtraction: true,
  maxContentPages: 5,
  maxTotalCost: 0,
};

export default function PlaygroundPage() {
  const [config, setConfig] = useState<PlaygroundConfig>(DEFAULT_CONFIG);
  const [response, setResponse] = useState<PlaygroundResponse | null>(null);
  const [running, setRunning] = useState(false);
  const [showConfig, setShowConfig] = useState(false);

  const updateConfig = (patch: Partial<PlaygroundConfig>) => {
    setConfig((prev) => ({ ...prev, ...patch }));
  };

  const handleRun = () => {
    if (!config.input.trim()) {
      toast.error("Enter a prompt before running a request");
      return;
    }
    setRunning(true);
    setResponse(null);
    setTimeout(() => {
      setResponse(generateMockResponse(config));
      setRunning(false);
      toast.success("Request completed");
    }, 1100);
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Playground"
        description="Compose a request and preview the mock response, usage and generated code."
      />

      <div className="xl:hidden">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setShowConfig((v) => !v)}
          aria-expanded={showConfig}
        >
          {showConfig ? (
            <ChevronUp className="size-4" aria-hidden="true" />
          ) : (
            <ChevronDown className="size-4" aria-hidden="true" />
          )}
          <Settings2 className="size-4" aria-hidden="true" />
          {showConfig ? "Hide configuration" : "Show configuration"}
        </Button>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,300px)_minmax(0,1fr)_minmax(0,1.1fr)]">
        <Card className={showConfig ? "block" : "hidden xl:block"}>
          <CardContent className="pt-4">
            <ConfigPanel config={config} onChange={updateConfig} />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex min-h-[420px] flex-col pt-4">
            <PromptPanel
              value={config.input}
              onChange={(input) => updateConfig({ input })}
              onRun={handleRun}
              running={running}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <ResponsePanel response={response} running={running} config={config} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
