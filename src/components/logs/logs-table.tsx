"use client";

import { useState } from "react";
import { ChevronRight, Coins, FileText } from "lucide-react";
import type { RequestLog } from "@/types/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { StatusBadge } from "@/components/shared/status-badge";
import { AppIcon } from "./app-icon";
import { formatDateTime, formatDuration, formatNumber, formatRMExact, truncateId } from "@/lib/format";
import { LogDetailDrawer } from "./log-detail-drawer";

interface LogsTableProps {
  logs: RequestLog[];
}

export function LogsTable({ logs }: LogsTableProps) {
  const [selected, setSelected] = useState<RequestLog | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <>
      <div className="overflow-x-auto">
        <Table className="min-w-[980px]">
          <TableHeader>
            <TableRow>
              <TableHead className="w-8" />
              <TableHead>Timestamp</TableHead>
              <TableHead>Request ID</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>App</TableHead>
              <TableHead>API key</TableHead>
              <TableHead>Endpoint</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Input</TableHead>
              <TableHead className="text-right">Output</TableHead>
              <TableHead className="text-right">Reasoning</TableHead>
              <TableHead className="text-right">Search</TableHead>
              <TableHead className="min-w-36 text-right">Cost</TableHead>
              <TableHead className="text-right">Latency</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <LogsRow
                key={log.id}
                log={log}
                expanded={expanded === log.id}
                onToggleExpand={() =>
                  setExpanded((prev) => (prev === log.id ? null : log.id))
                }
                onSelect={() => setSelected(log)}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      <LogDetailDrawer log={selected} onOpenChange={(open) => !open && setSelected(null)} />
    </>
  );
}

function LogsRow({
  log,
  expanded,
  onToggleExpand,
  onSelect,
}: {
  log: RequestLog;
  expanded: boolean;
  onToggleExpand: () => void;
  onSelect: () => void;
}) {
  return (
    <>
      <TableRow
        className="cursor-pointer [&>td]:py-3.5 [&>td]:px-3"
        onClick={onSelect}
        aria-label={`View details for ${log.requestId}`}
      >
        <TableCell className="w-8 px-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand();
            }}
            aria-label={expanded ? "Collapse row" : "Expand row"}
            aria-expanded={expanded}
            className="flex size-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ChevronRight
              className={`size-3.5 transition-transform ${expanded ? "rotate-90" : ""}`}
              aria-hidden="true"
            />
          </button>
        </TableCell>
        <TableCell className="whitespace-nowrap text-muted-foreground">
          <time dateTime={log.timestamp}>{formatDateTime(log.timestamp)}</time>
        </TableCell>
        <TableCell>
          <code className="font-mono text-[12px]">{truncateId(log.requestId)}</code>
        </TableCell>
        <TableCell>
          <code className="font-mono text-[12px] text-muted-foreground">{log.model}</code>
        </TableCell>
        <TableCell>
          <span className="flex items-center gap-2">
            <AppIcon name={log.appName} domain={log.appDomain} />
            <span className="max-w-36 truncate" title={log.appName}>
              {log.appName}
            </span>
          </span>
        </TableCell>
        <TableCell className="whitespace-nowrap text-muted-foreground">{log.apiKeyName}</TableCell>
        <TableCell>
          <code className="font-mono text-[12px] text-muted-foreground">{log.endpoint}</code>
        </TableCell>
        <TableCell>
          <StatusBadge status={log.status} />
        </TableCell>
        <TableCell className="whitespace-nowrap text-right tabular-nums">{formatNumber(log.inputTokens)}</TableCell>
        <TableCell className="whitespace-nowrap text-right tabular-nums">{formatNumber(log.outputTokens)}</TableCell>
        <TableCell className="whitespace-nowrap text-right tabular-nums">{formatNumber(log.reasoningTokens)}</TableCell>
        <TableCell className="whitespace-nowrap text-right tabular-nums">{log.searchCount}</TableCell>
        <TableCell className="min-w-36 whitespace-nowrap text-right">
          <span className="inline-flex w-full items-center justify-end gap-1.5">
            {log.usageSource === "provider" && log.cachedTokens > 0 ? (
              <Tooltip delayDuration={150}>
                <TooltipTrigger
                  onClick={(e) => e.stopPropagation()}
                  className="flex size-3.5 shrink-0 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label={`Model provider reported ${formatNumber(log.cachedTokens)} cached input tokens`}
                >
                  <Coins className="size-3.5" aria-hidden="true" />
                </TooltipTrigger>
                <TooltipContent>
                  Model provider reported {formatNumber(log.cachedTokens)} cached input tokens
                </TooltipContent>
              </Tooltip>
            ) : null}
            <span className="font-mono tabular-nums">{formatRMExact(log.cost)}</span>
          </span>
        </TableCell>
        <TableCell className="whitespace-nowrap text-right tabular-nums text-muted-foreground">
          {formatDuration(log.latencyMs)}
        </TableCell>
      </TableRow>
      {expanded && (
        <TableRow>
          <TableCell colSpan={14} className="bg-muted/30 p-0">
            <div className="flex items-start gap-2.5 px-4 py-3.5">
              <FileText className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              <div className="text-sm text-muted-foreground">
                {log.error ? (
                  <p>
                    <span className="font-medium text-destructive">Error: </span>
                    {log.error}
                  </p>
                ) : (
                  <p>
                    Routed via <span className="font-medium text-foreground">{log.routingCategory}</span>.{" "}
                    {log.reasoningEffort || log.searchDepth ? (
                      <>Request settings: {log.reasoningEffort ?? "reasoning effort not recorded"} reasoning, {log.searchDepth ?? "search depth not recorded"} search depth.</>
                    ) : (
                      <>Reasoning effort and search depth were not recorded for this request.</>
                    )}{" "}
                    Click the row to view the full request detail.
                  </p>
                )}
              </div>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
