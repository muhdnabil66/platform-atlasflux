import { Globe2 } from "lucide-react";
import { searchTiers } from "@/config/models";
import { CostCalculator } from "@/components/web-search/cost-calculator";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatRM } from "@/lib/format";

export default function WebSearchPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Web Search"
        description="Ground responses in current sources. Choose a search depth per request and control cost with limits."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {searchTiers.map((tier) => (
          <Card key={tier.id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 capitalize">
                <Globe2 className="size-4 text-muted-foreground" aria-hidden="true" />
                {tier.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Best for
                </p>
                <p className="mt-0.5 text-sm">{tier.bestFor}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Typical latency
                  </p>
                  <p className="mt-0.5 text-sm tabular-nums">{tier.typicalLatency}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Base price
                  </p>
                  <p className="mt-0.5 font-mono text-sm font-medium tabular-nums">
                    {formatRM(tier.basePrice)}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Search quality
                </p>
                <p className="mt-0.5 text-sm text-muted-foreground">{tier.searchQuality}</p>
              </div>
              <div className="mt-auto flex items-center justify-between border-t pt-3 text-sm">
                <span className="text-muted-foreground">Recommended max results</span>
                <span className="font-medium tabular-nums">{tier.recommendedMaxResults}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Additional charges</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="flex flex-col gap-2.5">
            <li className="flex items-start justify-between gap-4 rounded-lg border bg-background p-3 text-sm">
              <span className="text-muted-foreground">
                More than 10 results in a single search
              </span>
              <span className="shrink-0 font-mono font-medium tabular-nums">
                +{formatRM(0.005)} per result
              </span>
            </li>
            <li className="flex items-start justify-between gap-4 rounded-lg border bg-background p-3 text-sm">
              <span className="text-muted-foreground">Content extraction</span>
              <span className="shrink-0 font-mono font-medium tabular-nums">
                {formatRM(0.02)} per page
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>

      <CostCalculator />
    </div>
  );
}
