"use client";

import type { TimeRange } from "@/types/api";
import { cn } from "@/lib/utils";

const RANGES: TimeRange[] = ["24h", "7d", "30d", "90d"];

interface DateRangeFilterProps {
  value: TimeRange;
  onChange: (range: TimeRange) => void;
}

export function DateRangeFilter({ value, onChange }: DateRangeFilterProps) {
  return (
    <div
      className="inline-flex items-center gap-0.5 rounded-lg border bg-muted/40 p-0.5"
      role="group"
      aria-label="Date range"
    >
      {RANGES.map((range) => (
        <button
          key={range}
          onClick={() => onChange(range)}
          aria-pressed={value === range}
          className={cn(
            "h-7 rounded-md px-2.5 text-xs font-medium tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            value === range
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {range}
        </button>
      ))}
    </div>
  );
}
