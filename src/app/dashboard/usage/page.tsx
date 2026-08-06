"use client";

import { useMemo, useState } from "react";
import { Download, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import type {
  Environment,
  ReasoningEffort,
  RequestStatus,
  SearchDepth,
  UsageFilters,
} from "@/types/api";
import { getUsageData } from "@/lib/api-client";
import { useMockData } from "@/hooks/use-mock-data";
import { usageFilterOptions } from "@/lib/mock-data/usage";
import { PageHeader } from "@/components/shared/page-header";
import { DateRangeFilter } from "@/components/dashboard/date-range-filter";
import { MetricChart } from "@/components/usage/metric-chart";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  formatCompactNumber,
  formatDuration,
  formatNumber,
  formatPercent,
  formatRM,
} from "@/lib/format";

const DEFAULT_FILTERS: UsageFilters = {
  range: "30d",
  apiKey: "all",
  environment: "all",
  endpoint: "all",
  status: "all",
  reasoning: "all",
  searchDepth: "all",
};

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

export default function UsagePage() {
  const [filters, setFilters] = useState<UsageFilters>(DEFAULT_FILTERS);

  const { data, loading } = useMockData(() => getUsageData(filters), [filters]);

  const derived = useMemo(() => {
    if (!data) return null;
    return data.series.map((point) => ({
      ...point,
      webSearches: Math.round(point.requests * 0.11),
      latencyMs: Math.round(620 + ((point.timestamp % 47) / 46) * 320),
      errorRate: Number((1.1 + ((point.timestamp % 19) / 18) * 2.4).toFixed(2)),
    }));
  }, [data]);

  const setFilter = (patch: Partial<UsageFilters>) => {
    setFilters((prev) => ({ ...prev, ...patch }));
  };

  const handleExport = () => {
    toast.success("CSV export queued (frontend placeholder)");
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Usage"
        description="Analyse spend, requests, tokens and search activity across your API usage."
        actions={
          <>
            <Button variant="outline" onClick={handleExport}>
              <Download className="size-4" aria-hidden="true" />
              Export CSV
            </Button>
            <Button variant="ghost" onClick={() => toast.info("Filters reset")}>
              <RefreshCw className="size-4" aria-hidden="true" />
              Reset
            </Button>
          </>
        }
      />

      <Card>
        <CardContent className="flex flex-col gap-4 pt-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Label>Date range</Label>
              <div className="mt-1.5">
                <DateRangeFilter value={filters.range} onChange={(range) => setFilter({ range })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              <FilterSelect
                label="API key"
                value={filters.apiKey}
                options={[
                  { value: "all", label: "All keys" },
                  { value: "key_1", label: "Production app" },
                  { value: "key_2", label: "Local development" },
                  { value: "key_3", label: "CI pipeline" },
                ]}
                onValueChange={(v) => setFilter({ apiKey: v })}
              />
              <FilterSelect
                label="Environment"
                value={filters.environment}
                options={[
                  { value: "all", label: "All" },
                  { value: "production", label: "Production" },
                  { value: "development", label: "Development" },
                ]}
                onValueChange={(v) => setFilter({ environment: v as "all" | Environment })}
              />
              <FilterSelect
                label="Endpoint"
                value={filters.endpoint}
                options={[
                  { value: "all", label: "All" },
                  ...usageFilterOptions.endpoints.map((e) => ({ value: e, label: e })),
                ]}
                onValueChange={(v) => setFilter({ endpoint: v })}
              />
              <FilterSelect
                label="Status"
                value={filters.status}
                options={[
                  { value: "all", label: "All" },
                  ...usageFilterOptions.statuses.map((s) => ({ value: s, label: s })),
                ]}
                onValueChange={(v) => setFilter({ status: v as "all" | RequestStatus })}
              />
              <FilterSelect
                label="Reasoning"
                value={filters.reasoning}
                options={[
                  { value: "all", label: "All" },
                  ...usageFilterOptions.reasoning.map((r) => ({ value: r, label: r })),
                ]}
                onValueChange={(v) => setFilter({ reasoning: v as "all" | ReasoningEffort })}
              />
              <FilterSelect
                label="Search depth"
                value={filters.searchDepth}
                options={[
                  { value: "all", label: "All" },
                  ...usageFilterOptions.searchDepths.map((d) => ({ value: d, label: d })),
                ]}
                onValueChange={(v) => setFilter({ searchDepth: v as "all" | SearchDepth })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        {loading || !derived ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-40 w-full" />
              </CardContent>
            </Card>
          ))
        ) : (
          <>
            <MetricChart
              title="Spend"
              data={derived}
              metric="spend"
              formatter={(v) => formatRM(v)}
              color={CHART_COLORS[0]}
            />
            <MetricChart
              title="Requests"
              data={derived}
              metric="requests"
              formatter={(v) => formatNumber(v)}
              color={CHART_COLORS[1]}
            />
            <MetricChart
              title="Tokens"
              data={derived}
              metric="tokens"
              formatter={(v) => formatCompactNumber(v)}
              color={CHART_COLORS[2]}
            />
            <MetricChart
              title="Web searches"
              data={derived}
              metric="webSearches"
              formatter={(v) => formatNumber(v)}
              color={CHART_COLORS[3]}
            />
            <MetricChart
              title="Latency"
              data={derived}
              metric="latencyMs"
              formatter={(v) => formatDuration(v)}
              color={CHART_COLORS[4]}
            />
            <MetricChart
              title="Error rate"
              data={derived}
              metric="errorRate"
              formatter={(v) => formatPercent(v)}
              color="var(--destructive)"
            />
          </>
        )}
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Cost breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            {loading || !data ? (
              <Skeleton className="h-44 w-full" />
            ) : (
              <ul className="flex flex-col divide-y">
                <CostRow label="Input tokens" hint="RM5 / 1M" value={formatRM(data.costBreakdown.inputTokenCost)} />
                <CostRow label="Output tokens" hint="RM25 / 1M" value={formatRM(data.costBreakdown.outputTokenCost)} />
                <CostRow label="Reasoning" hint="Output rate" value={formatRM(data.costBreakdown.reasoningCost)} />
                <CostRow label="Search" hint="Per search" value={formatRM(data.costBreakdown.searchCost)} />
                <CostRow label="Content" hint="Per page" value={formatRM(data.costBreakdown.contentCost)} />
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Usage by API key</CardTitle>
          </CardHeader>
          <CardContent>
            {loading || !data ? (
              <Skeleton className="h-44 w-full" />
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Key</TableHead>
                      <TableHead className="text-right">Requests</TableHead>
                      <TableHead className="text-right">Tokens</TableHead>
                      <TableHead className="text-right">Searches</TableHead>
                      <TableHead className="text-right">Spend</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.byKey.map((key) => (
                      <TableRow key={key.keyId}>
                        <TableCell>
                          <span className="font-medium">{key.keyName}</span>
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {formatCompactNumber(key.requests)}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {formatCompactNumber(key.tokens)}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {formatNumber(key.searches)}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {formatRM(key.spend)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Usage by category</CardTitle>
          </CardHeader>
          <CardContent>
            {loading || !data ? (
              <Skeleton className="h-44 w-full" />
            ) : (
              <ul className="flex flex-col gap-3">
                {data.byCategory.map((cat, index) => (
                  <li key={cat.id}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="font-medium">{cat.name}</span>
                      <span className="tabular-nums text-muted-foreground">
                        {formatRM(cat.spend)} · {cat.share}%
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted" role="presentation">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${cat.share}%`, backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onValueChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onValueChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger size="sm" className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value} className="capitalize">
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function CostRow({ label, hint, value }: { label: string; hint: string; value: string }) {
  return (
    <li className="flex items-center justify-between py-2.5">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </div>
      <p className="font-mono text-sm font-medium tabular-nums">{value}</p>
    </li>
  );
}
