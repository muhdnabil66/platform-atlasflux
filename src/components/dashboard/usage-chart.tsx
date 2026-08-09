"use client";

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { SeriesPoint, TimeRange } from "@/types/api";
import { cn } from "@/lib/utils";
import { formatCompactNumber, formatRMAdaptive } from "@/lib/format";

type Metric = "spend" | "requests";

interface UsageChartProps {
  data: SeriesPoint[];
  range: TimeRange;
  className?: string;
}

const METRICS: { id: Metric; label: string }[] = [
  { id: "spend", label: "Spend" },
  { id: "requests", label: "Requests" },
];

function ChartTooltip({
  active,
  payload,
  label,
  metric,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
  metric: Metric;
}) {
  if (!active || !payload || payload.length === 0) return null;
  const value = payload[0].value;
  return (
    <div className="rounded-lg border bg-popover px-3 py-2 text-sm shadow-md">
      <p className="font-medium text-foreground">{label}</p>
      <p className="tabular-nums text-muted-foreground">
        {metric === "spend" ? formatRMAdaptive(value) : formatCompactNumber(value)}
      </p>
    </div>
  );
}

export function UsageChart({ data, range, className }: UsageChartProps) {
  const [metric, setMetric] = useState<Metric>("spend");

  const yTicks = useMemo(() => {
    if (metric === "spend") {
      return {
        tickFormatter: (v: number) => `RM${v}`,
      };
    }
    return {
      tickFormatter: (v: number) => formatCompactNumber(v),
    };
  }, [metric]);

  const domain: [number | "auto", number | "auto"] =
    metric === "spend" ? ["auto", "auto"] : [0, "auto"];

  return (
    <div className={cn("flex h-full flex-col", className)}>
      <div
        className="mb-3 inline-flex w-fit items-center gap-1 rounded-lg border bg-muted/40 p-0.5"
        role="tablist"
        aria-label="Chart metric"
      >
        {METRICS.map((m) => (
          <button
            key={m.id}
            role="tab"
            aria-selected={metric === m.id}
            onClick={() => setMetric(m.id)}
            className={cn(
              "h-7 rounded-md px-3 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              metric === m.id
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="min-h-64 flex-1" aria-label={`${metric} over ${range}`}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.18} />
                <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
              minTickGap={24}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              tickLine={false}
              axisLine={false}
              width={46}
              domain={domain}
              {...yTicks}
            />
            <Tooltip
              content={<ChartTooltip metric={metric} />}
              cursor={{ stroke: "var(--border)", strokeWidth: 1 }}
            />
            <Area
              type="monotone"
              dataKey={metric}
              stroke="var(--chart-1)"
              strokeWidth={2}
              fill="url(#chartFill)"
              dot={false}
              activeDot={{ r: 3, strokeWidth: 0 }}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
