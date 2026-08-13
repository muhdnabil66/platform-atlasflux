import type { UsageBreakdown } from "@/types/api";
import { formatNumber, formatTokens } from "@/lib/format";

const ROWS: Array<{
  key: keyof UsageBreakdown;
  label: string;
  hint: string;
}> = [
  { key: "inputTokens", label: "Input tokens", hint: "Prompt tokens billed at RM1.50 per 1M" },
  { key: "outputTokens", label: "Output tokens", hint: "Generated tokens billed at RM4.50 per 1M" },
  { key: "reasoningTokens", label: "Reasoning tokens", hint: "Included in the output rate" },
  { key: "webSearches", label: "Web searches", hint: "Searches billed from RM0.05 each" },
  { key: "contentPages", label: "Content pages", hint: "Extracted pages billed per page" },
];

interface UsageBreakdownProps {
  data: UsageBreakdown;
}

export function UsageBreakdown({ data }: UsageBreakdownProps) {
  const isTokenRow = (key: keyof UsageBreakdown) =>
    key === "inputTokens" || key === "outputTokens" || key === "reasoningTokens";

  const totalTokens =
    data.inputTokens + data.outputTokens + data.reasoningTokens;

  return (
    <ul className="flex flex-col divide-y">
      {ROWS.map((row) => {
        const value = data[row.key];
        const percent = isTokenRow(row.key)
          ? Math.round((value / totalTokens) * 100)
          : null;
        return (
          <li
            key={row.key}
            className="flex items-center justify-between gap-3 py-2.5"
            title={row.hint}
          >
            <div>
              <p className="text-sm font-medium">{row.label}</p>
              <p className="text-xs text-muted-foreground">{row.hint}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold tabular-nums">
                {isTokenRow(row.key) ? formatTokens(value) : formatNumber(value)}
              </p>
              {percent !== null && (
                <p className="text-xs tabular-nums text-muted-foreground">{percent}%</p>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
