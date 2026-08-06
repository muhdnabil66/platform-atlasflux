import type { PlaygroundUsage } from "@/types/api";
import { formatCompactNumber, formatDuration, formatRM } from "@/lib/format";

interface UsageSummaryPanelProps {
  usage: PlaygroundUsage;
}

export function UsageSummaryPanel({ usage }: UsageSummaryPanelProps) {
  return (
    <div className="rounded-lg border bg-background p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-semibold">Usage</h4>
        <span className="font-mono text-sm font-semibold tabular-nums text-primary">
          Total cost: {formatRM(usage.totalCost)}
        </span>
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-xs sm:grid-cols-3">
        <UsageRow label="Request ID" value={usage.requestId} mono />
        <UsageRow label="Routing" value={usage.routingCategory} />
        <UsageRow label="Latency" value={formatDuration(usage.latencyMs)} />
        <UsageRow label="Input tokens" value={formatCompactNumber(usage.inputTokens)} />
        <UsageRow label="Output tokens" value={formatCompactNumber(usage.outputTokens)} />
        <UsageRow label="Reasoning tokens" value={formatCompactNumber(usage.reasoningTokens)} />
        <UsageRow label="Searches" value={String(usage.searches)} />
        <UsageRow label="Content pages" value={String(usage.contentPages)} />
        <UsageRow
          label="Cost breakdown"
          value={`${formatRM(usage.costs.inputTokenCost)} input · ${formatRM(usage.costs.outputTokenCost)} output · ${formatRM(usage.costs.reasoningCost)} reasoning · ${formatRM(usage.costs.searchCost)} search`}
        />
      </dl>
    </div>
  );
}

function UsageRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={mono ? "font-mono tabular-nums" : "tabular-nums"}>
        {value}
      </dd>
    </div>
  );
}
