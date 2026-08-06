"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Settings2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";
import type { PlaygroundConfig, PlaygroundResponse } from "@/types/api";
import { nenasFlash } from "@/config/models";
import { API_BASE_URL } from "@/lib/api-client";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ConfigPanel } from "@/components/playground/config-panel";
import { PromptPanel } from "@/components/playground/prompt-panel";
import { ResponsePanel } from "@/components/playground/response-panel";

const DEFAULT_CONFIG: PlaygroundConfig = {
  model: nenasFlash.id,
  input: "",
  systemInstruction: "",
  temperature: 0.7,
  maxOutputTokens: 1024,
  stream: true,
  reasoning: "low",
  searchMode: "off",
  searchDepth: "balanced",
  maxResults: 5,
  maxSearches: 2,
  contentExtraction: false,
  maxContentPages: 3,
  maxTotalCost: 0,
};

export default function PlaygroundPage() {
  const { getToken } = useAuth();
  const [config, setConfig] = useState<PlaygroundConfig>(DEFAULT_CONFIG);
  const [response, setResponse] = useState<PlaygroundResponse | null>(null);
  const [running, setRunning] = useState(false);
  const [showConfig, setShowConfig] = useState(false);

  const updateConfig = (patch: Partial<PlaygroundConfig>) => {
    setConfig((prev) => ({ ...prev, ...patch }));
  };

  const handleRun = async () => {
    if (!config.input.trim()) {
      toast.error("Enter a prompt before running a request");
      return;
    }
    setRunning(true);
    setResponse(null);
    try {
      const token = await getToken();
      const res = await fetch(`${API_BASE_URL}/v1/responses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          model: config.model,
          input: config.input,
          temperature: config.temperature,
          max_output_tokens: config.maxOutputTokens,
          reasoning: { effort: config.reasoning },
          ...(config.searchMode !== "off" ? {
            web_search: {
              mode: config.searchMode,
              search_depth: config.searchDepth,
              max_results: config.maxResults,
              max_searches: config.maxSearches,
              content: { enabled: config.contentExtraction, max_pages: config.maxContentPages },
            },
          } : {}),
        }),
      });
      const data = await res.json();
      const normalized: PlaygroundResponse = {
        content: data.output_text ?? data.content ?? data.output ?? data.choices?.[0]?.message?.content ?? "",
        citations: data.citations ?? [],
        usage: {
          inputTokens: data.usage?.input_tokens ?? data.usage?.inputTokens ?? 0,
          outputTokens: data.usage?.output_tokens ?? data.usage?.outputTokens ?? 0,
          reasoningTokens: data.usage?.reasoning_tokens ?? data.usage?.reasoningTokens ?? 0,
          cachedTokens: data.usage?.cached_tokens ?? data.usage?.cachedTokens ?? 0,
          searches: data.usage?.searches ?? data.usage?.search_count ?? 0,
          contentPages: data.usage?.content_pages ?? data.usage?.contentPages ?? 0,
          costs: data.usage?.costs ? {
            inputTokenCost: Number(data.usage.costs.input ?? 0) || 0,
            outputTokenCost: Number(data.usage.costs.output ?? 0) || 0,
            reasoningCost: Number(data.usage.costs.reasoning ?? 0) || 0,
            searchCost: Number(data.usage.costs.search ?? 0) || 0,
            contentCost: Number(data.usage.costs.content ?? 0) || 0,
          } : {
            inputTokenCost: Number(data.usage?.cost_myr ?? 0) || 0,
            outputTokenCost: 0,
            reasoningCost: 0,
            searchCost: 0,
            contentCost: 0,
          },
          totalCost: Number(data.usage?.cost_myr ?? 0) || 0,
          latencyMs: data.usage?.latency_ms ?? data.usage?.latencyMs ?? 0,
          routingCategory: data.routing?.category ?? data.usage?.routing_category ?? data.usage?.routingCategory ?? "general",
          requestId: data.request_id ?? data.requestId ?? data.id ?? "",
        },
        finishReason: data.finish_reason ?? data.finishReason ?? "stop",
        createdAt: data.created_at ?? data.createdAt ?? new Date().toISOString(),
      };
      setResponse(normalized);
      toast.success("Request completed");
    } catch {
      toast.error("Request failed");
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Playground"
        description="Compose a request and preview the response, usage and generated code."
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
