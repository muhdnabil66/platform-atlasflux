"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CircleDollarSign,
  Coins,
  KeyRound,
  Layers,
  Loader2,
  MousePointerClick,
} from "lucide-react";
import type { TimeRange } from "@/types/api";
import { getOverviewData, type OverviewData } from "@/lib/api-client";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { UsageChart } from "@/components/dashboard/usage-chart";
import { DateRangeFilter } from "@/components/dashboard/date-range-filter";
import { ActivityTable } from "@/components/dashboard/activity-table";
import { UsageBreakdown } from "@/components/dashboard/usage-breakdown";
import { RoutingBreakdown } from "@/components/dashboard/routing-breakdown";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCompactNumber, formatNumber, formatRM } from "@/lib/format";

export default function OverviewPage() {
  const router = useRouter();
  const [data, setData] = useState<OverviewData | null>(null);
  const [range, setRange] = useState<TimeRange>("7d");

  useEffect(() => {
    let active = true;
    getOverviewData().then((result) => {
      if (active) setData(result);
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Overview"
        description="Monitor your API usage, balance and platform activity."
        actions={
          <>
            <Button variant="outline" onClick={() => router.push("/dashboard/billing")}>
              <Coins className="size-4" aria-hidden="true" />
              Add funds
            </Button>
            <Button onClick={() => router.push("/dashboard/api-keys?new=1")}>
              <KeyRound className="size-4" aria-hidden="true" />
              Create API key
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {data ? (
          <>
          <StatCard
            label="API balance"
            value={formatRM(data.summary.balance)}
            icon={CircleDollarSign}
            hint="Remaining prepaid balance in MYR"
            footer={`Spend today: ${formatRM(data.summary.spendToday)}`}
          />
          <StatCard
            label="Spend today"
            value={formatRM(data.summary.spendToday)}
            delta={data.summary.spendDeltaPercent}
            tone="negative"
            icon={Coins}
            hint={`Projected daily spend: ${formatRM(data.summary.projectedDailySpend)}`}
          />
          <StatCard
            label="Requests today"
            value={formatNumber(data.summary.requestsToday)}
            delta={data.summary.requestsDeltaPercent}
            tone="positive"
            icon={MousePointerClick}
            hint="Total API requests today"
          />
          <StatCard
            label="Total tokens"
            value={formatCompactNumber(data.summary.totalTokens, { decimals: 1 })}
            delta={data.summary.totalTokensDeltaPercent}
            tone="neutral"
            icon={Layers}
            hint="Tokens used today, including reasoning"
          />
          </>
        ) : (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-28" />
                <Skeleton className="mt-2 h-3 w-32" />
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle>Usage</CardTitle>
              {data && <DateRangeFilter value={range} onChange={setRange} />}
            </div>
          </CardHeader>
          <CardContent>
            {data ? (
              <UsageChart data={data.series[range]} range={range} />
            ) : (
              <Skeleton className="h-64 w-full" />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Usage breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            {data ? (
              <UsageBreakdown data={data.breakdown} />
            ) : (
              <div className="flex flex-col gap-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Model routing</CardTitle>
          </CardHeader>
          <CardContent>
            {data ? (
              <RoutingBreakdown categories={data.routing} />
            ) : (
              <Skeleton className="h-56 w-full" />
            )}
          </CardContent>
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Recent activity</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard/logs")}>
              View all logs
            </Button>
          </CardHeader>
          <CardContent>
            {data ? (
              <ActivityTable items={data.activity} />
            ) : (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="size-5 animate-spin text-muted-foreground" aria-hidden="true" />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
