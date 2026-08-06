"use client";

import { useMemo, useState } from "react";
import { Calculator } from "lucide-react";
import type { SearchDepth } from "@/types/api";
import { getSearchTier, searchDepthOptions } from "@/config/models";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatRM } from "@/lib/format";

export function CostCalculator() {
  const [depth, setDepth] = useState<SearchDepth>("balanced");
  const [results, setResults] = useState(10);
  const [pages, setPages] = useState(0);
  const [searches, setSearches] = useState(1);

  const tier = getSearchTier(depth);

  const estimate = useMemo(() => {
    const searchCost = searches * tier.basePrice;
    const extraResults = Math.max(0, results - 10) * 0.005;
    const contentCost = pages * 0.02;
    return searchCost + extraResults + contentCost;
  }, [tier, results, pages, searches]);

  return (
    <div className="rounded-xl border bg-muted/30 p-6">
      <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight">
        <Calculator className="size-4 text-muted-foreground" aria-hidden="true" />
        Cost calculator
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Estimate the cost of a single request with web search.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="calc-depth">Search depth</Label>
          <Select value={depth} onValueChange={(v) => setDepth(v as SearchDepth)}>
            <SelectTrigger id="calc-depth" className="w-full capitalize">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {searchDepthOptions.map((option) => (
                <SelectItem key={option} value={option} className="capitalize">
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="calc-results">Number of results</Label>
          <Input
            id="calc-results"
            type="number"
            min={1}
            max={25}
            value={results}
            onChange={(e) => setResults(clamp(Number(e.target.value), 1, 25))}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="calc-pages">Content pages</Label>
          <Input
            id="calc-pages"
            type="number"
            min={0}
            max={10}
            value={pages}
            onChange={(e) => setPages(clamp(Number(e.target.value), 0, 10))}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="calc-searches">Number of searches</Label>
          <Input
            id="calc-searches"
            type="number"
            min={1}
            max={5}
            value={searches}
            onChange={(e) => setSearches(clamp(Number(e.target.value), 1, 5))}
          />
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 rounded-lg border bg-background p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Estimated cost</p>
          <p className="text-2xl font-semibold tabular-nums tracking-tight">
            {formatRM(estimate)}
          </p>
        </div>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs text-muted-foreground">
          <dt>Base ({tier.name}):</dt>
          <dd className="tabular-nums text-right">{formatRM(tier.basePrice)} / search</dd>
          <dt>Results above 10:</dt>
          <dd className="tabular-nums text-right">{formatRM(0.005)} / result</dd>
          <dt>Content extraction:</dt>
          <dd className="tabular-nums text-right">{formatRM(0.02)} / page</dd>
        </dl>
      </div>
    </div>
  );
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
