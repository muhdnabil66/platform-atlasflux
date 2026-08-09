"use client";

import { Coins, EyeOff, FileText } from "lucide-react";
import type { RequestLog } from "@/types/api";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { StatusBadge } from "@/components/shared/status-badge";
import { CopyButton } from "@/components/shared/copy-button";
import { Separator } from "@/components/ui/separator";
import { AppIcon } from "./app-icon";
import { formatDateTime, formatDuration, formatNumber, formatRM, truncateId } from "@/lib/format";

interface LogDetailDrawerProps {
  log: RequestLog | null;
  onOpenChange: (open: boolean) => void;
}

export function LogDetailDrawer({ log, onOpenChange }: LogDetailDrawerProps) {
  return (
    <Sheet open={Boolean(log)} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full gap-0 p-0 sm:max-w-lg">
        {log && (
          <>
            <SheetHeader className="px-5 pb-4 pt-6">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                <StatusBadge status={log.status} />
                <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <AppIcon name={log.appName} domain={log.appDomain} className="size-4" />
                  <span>{log.appName}</span>
                </span>
                <code className="font-mono text-xs text-muted-foreground">
                  {log.apiKeyPrefix}...
                </code>
              </div>
              <SheetTitle className="flex items-center gap-2 break-all pr-6">
                <code className="font-mono text-sm">{truncateId(log.requestId, 34)}</code>
                <CopyButton value={log.requestId} ariaLabel="Copy request ID" className="size-6 px-0" />
              </SheetTitle>
              <SheetDescription>
                Request details and usage breakdown.
              </SheetDescription>
            </SheetHeader>

            <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-5 pb-10 pt-2">
              <section className="flex flex-col gap-2.5">
                <h3 className="text-sm font-semibold">Request metadata</h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                  <Detail label="Timestamp" value={formatDateTime(log.timestamp)} />
                  <Detail label="Endpoint" value={log.endpoint} mono />
                  <Detail label="Model" value={log.model} mono />
                  <Detail label="API key" value={log.apiKeyName} />
                </div>
              </section>

              <Separator />

              <section className="flex flex-col gap-2.5">
                <h3 className="text-sm font-semibold">Generation details</h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                  <Detail label="Input tokens" value={formatNumber(log.inputTokens)} />
                  <Detail label="Output tokens" value={formatNumber(log.outputTokens)} />
                  <Detail label="Reasoning tokens" value={formatNumber(log.reasoningTokens)} />
                  <Detail
                    label="Cached input"
                    value={log.cachedTokens > 0 ? formatNumber(log.cachedTokens) : "0"}
                  />
                  <Detail label="Search count" value={String(log.searchCount)} />
                  <Detail label="Latency" value={formatDuration(log.latencyMs)} />
                </div>
                <div className="mt-1 flex items-center justify-between rounded-lg border bg-muted/40 px-3 py-2.5 text-sm">
                  <span className="text-muted-foreground">Total cost</span>
                  <span className="inline-flex items-center gap-1.5 font-mono text-base font-semibold tabular-nums">
                    {formatRM(log.cost)}
                    {log.cachedTokens > 0 && (
                      <Tooltip delayDuration={150}>
                        <TooltipTrigger
                          className="rounded-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          aria-label={`Provider cached ${formatNumber(log.cachedTokens)} prompt tokens`}
                        >
                          <Coins className="size-3.5" aria-hidden="true" />
                        </TooltipTrigger>
                        <TooltipContent>
                          Provider cached {formatNumber(log.cachedTokens)} prompt tokens
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </span>
                </div>
              </section>

              <Separator />

              <section className="flex flex-col gap-2.5">
                <h3 className="text-sm font-semibold">Routing</h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                  <Detail label="Routing category" value={log.routingCategory} />
                  <Detail label="Reasoning effort" value={log.reasoningEffort} capitalize />
                  <Detail label="Search depth" value={log.searchDepth} capitalize />
                </div>
              </section>

              {log.costs && (
                <>
                  <Separator />
                  <section className="flex flex-col gap-2.5">
                    <h3 className="text-sm font-semibold">Cost breakdown</h3>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                      <Detail label="Input" value={formatRM(log.costs.inputTokenCost)} />
                      <Detail label="Output" value={formatRM(log.costs.outputTokenCost)} />
                      <Detail label="Reasoning" value={formatRM(log.costs.reasoningCost)} />
                      <Detail label="Search" value={formatRM(log.costs.searchCost)} />
                      <Detail label="Content" value={formatRM(log.costs.contentCost)} />
                    </div>
                  </section>
                </>
              )}

              {log.error && (
                <>
                  <Separator />
                  <section className="flex flex-col gap-2.5">
                    <h3 className="text-sm font-semibold text-destructive">Error</h3>
                    <p className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm leading-relaxed text-destructive">
                      {log.error}
                    </p>
                  </section>
                </>
              )}

              <Separator />

              <section className="flex flex-col gap-2.5 rounded-lg border bg-muted/40 p-4">
                <div className="flex items-center gap-2">
                  <EyeOff className="size-4 text-muted-foreground" aria-hidden="true" />
                  <h3 className="text-sm font-semibold">Request content</h3>
                </div>
                <p className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground">
                  <FileText className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  The prompt and response payloads are hidden for privacy and
                  compliance. Raw request logs are available in your ingestion
                  pipeline.
                </p>
              </section>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function Detail({
  label,
  value,
  mono,
  capitalize,
}: {
  label: string;
  value: string | null;
  mono?: boolean;
  capitalize?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className={mono ? "font-mono text-[13px] break-all" : capitalize ? "capitalize" : ""}>
        {value ?? "Not recorded"}
      </dd>
    </div>
  );
}
