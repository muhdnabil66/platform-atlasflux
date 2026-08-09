"use client";

import { useEffect, useMemo, useState } from "react";
import { ExternalLink, Loader2, TerminalSquare } from "lucide-react";
import type { PlaygroundConfig, PlaygroundResponse } from "@/types/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeBlock } from "@/components/shared/code-block";
import { CopyButton } from "@/components/shared/copy-button";
import { EmptyState } from "@/components/shared/empty-state";
import { UsageSummaryPanel } from "./usage-summary";
import { buildCurlSnippet, buildJavaScriptSnippet, buildPythonSnippet } from "./snippets";

interface ResponsePanelProps {
  response: PlaygroundResponse | null;
  running: boolean;
  config: PlaygroundConfig;
}

export function ResponsePanel({ response, running, config }: ResponsePanelProps) {
  const json = useMemo(() => (response ? JSON.stringify(response, null, 2) : ""), [response]);
  const curl = useMemo(() => buildCurlSnippet(config), [config]);
  const js = useMemo(() => buildJavaScriptSnippet(config), [config]);
  const python = useMemo(() => buildPythonSnippet(config), [config]);

  return (
    <Tabs defaultValue="response" className="h-full">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <TabsList>
          <TabsTrigger value="response">Response</TabsTrigger>
          <TabsTrigger value="json">JSON</TabsTrigger>
          <TabsTrigger value="curl">cURL</TabsTrigger>
          <TabsTrigger value="javascript">JavaScript</TabsTrigger>
          <TabsTrigger value="python">Python</TabsTrigger>
        </TabsList>
        {running && (
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
            Running request
          </span>
        )}
      </div>

      <TabsContent value="response" className="mt-3">
        {!response && !running && (
          <EmptyState
            icon={TerminalSquare}
            title="Run a request"
            description="Enter a prompt and press Run request to see the response here."
            className="py-16"
          />
        )}
        {running && !response && (
          <div className="flex h-full min-h-64 flex-col gap-3 p-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-1.5">
                <div className="h-3 w-full animate-pulse rounded bg-muted" style={{ animationDelay: `${i * 120}ms` }} />
                <div className="h-3 w-3/4 animate-pulse rounded bg-muted" style={{ animationDelay: `${i * 120 + 60}ms` }} />
              </div>
            ))}
          </div>
        )}
        {response && (
          <div className="flex flex-col gap-4">
            <div className="min-h-56 rounded-lg border bg-background p-4">
              <StreamedText
                key={`${response.usage?.requestId ?? "none"}-${config.stream}`}
                text={response.content ?? ""}
                stream={config.stream}
              />
            </div>

            {response.citations?.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold">Citations</h4>
                <ul className="mt-2 flex flex-col gap-2">
                  {response.citations.map((citation, i) => (
                    <li
                      key={citation.url ?? i}
                      className="flex items-start gap-2.5 rounded-lg border bg-background p-3"
                    >
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium tabular-nums">
                        {citation.index}
                      </span>
                      <div className="min-w-0">
                        <a
                          href={citation.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm font-medium hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                        >
                          {citation.title}
                          <ExternalLink className="size-3" aria-hidden="true" />
                        </a>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {citation.publisher} · {citation.date}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {response.usage && <UsageSummaryPanel usage={response.usage} />}
          </div>
        )}
      </TabsContent>

      <TabsContent value="json" className="mt-3">
        {response ? (
          <div className="relative">
            <div className="absolute right-2 top-2 z-10">
              <CopyButton value={json} ariaLabel="Copy JSON response" />
            </div>
            <CodeBlock code={json} language="json" compact />
          </div>
        ) : (
          <EmptyState icon={TerminalSquare} title="No response yet" description="Run a request to see the JSON response." />
        )}
      </TabsContent>

      {(
        [
          ["curl", curl],
          ["javascript", js],
          ["python", python],
        ] as const
      ).map(([tab, code]) => (
        <TabsContent key={tab} value={tab} className="mt-3">
          <div className="relative">
            <div className="absolute right-2 top-2 z-10">
              <CopyButton value={code} ariaLabel={`Copy ${tab} snippet`} />
            </div>
            <CodeBlock code={code} language={tab} compact />
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}

interface StreamedTextProps {
  text: string;
  stream: boolean;
}

function StreamedText({ text, stream }: StreamedTextProps) {
  const safeText = text ?? "";
  const [streamedText, setStreamedText] = useState("");
  const streaming = stream && streamedText.length < safeText.length;

  useEffect(() => {
    if (!stream) return;
    let index = 0;
    const interval = setInterval(() => {
      index += 4 + Math.floor(Math.random() * 6);
      setStreamedText(safeText.slice(0, index));
      if (index >= safeText.length) {
        clearInterval(interval);
      }
    }, 16);
    return () => clearInterval(interval);
  }, [safeText, stream]);

  return (
    <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
      {stream ? streamedText : safeText}
      {streaming && <span className="animate-pulse text-chart-1">▍</span>}
    </pre>
  );
}
