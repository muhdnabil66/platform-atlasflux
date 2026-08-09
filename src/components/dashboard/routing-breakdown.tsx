import type { RoutingCategory } from "@/types/api";
import { formatCompactNumber, formatRMAdaptive } from "@/lib/format";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface RoutingBreakdownProps {
  categories: RoutingCategory[];
}

export function RoutingBreakdown({ categories }: RoutingBreakdownProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-1.5">
        <p className="text-sm text-muted-foreground">
          Customer-facing routing categories
        </p>
        <Tooltip delayDuration={200}>
          <TooltipTrigger asChild>
            <button
              className="rounded-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="About routing categories"
            >
              <Info className="size-3.5" aria-hidden="true" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top">
            AtlasFlux selects an upstream model per request. You see the routing
            category, not the internal provider.
          </TooltipContent>
        </Tooltip>
      </div>
      <ul className="flex flex-col gap-3">
        {categories.map((cat) => (
          <li key={cat.id}>
            <div className="mb-1 flex items-center justify-between gap-2 text-sm">
              <span className="font-medium">{cat.name}</span>
              <span className="tabular-nums text-muted-foreground">
                {cat.share}% · {formatRMAdaptive(cat.cost)}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted" role="presentation">
              <div
                className="h-full rounded-full bg-chart-1"
                style={{ width: `${cat.share}%` }}
              />
            </div>
            <p className="mt-0.5 text-xs tabular-nums text-muted-foreground">
              {formatCompactNumber(cat.requests)} requests
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
