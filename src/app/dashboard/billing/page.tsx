"use client";

import { useEffect, useState } from "react";
import { Coins, Gauge, RefreshCw, TrendingUp, Wallet } from "lucide-react";
import { toast } from "sonner";
import type { BillingSummary, Transaction } from "@/types/api";
import { getBilling, getTransactions } from "@/lib/api-client";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { AddFundsDialog } from "@/components/billing/add-funds-dialog";
import { AutoReloadCard } from "@/components/billing/auto-reload-card";
import { PaymentCardSection } from "@/components/billing/payment-card-section";
import { TransactionTable } from "@/components/billing/transaction-table";
import { topUpOptions, popularTopUp } from "@/config/billing";
import { formatCompactNumber, formatRM, formatRMAdaptive } from "@/lib/format";
import { cn } from "@/lib/utils";

export default function BillingPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [preset, setPreset] = useState<number | undefined>(undefined);
  const [billing, setBilling] = useState<BillingSummary | null>(null);
  const [transactions, setTransactions] = useState<Transaction[] | null>(null);
  const [txLoading, setTxLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshVersion, setRefreshVersion] = useState(0);

  useEffect(() => {
    let active = true;
    Promise.all([getBilling(), getTransactions()])
      .then(([nextBilling, nextTransactions]) => {
        if (!active) return;
        setBilling(nextBilling);
        setTransactions(nextTransactions);
      })
      .catch(() => {
        if (active) toast.error("Could not refresh billing data");
      })
      .finally(() => {
        if (!active) return;
        setTxLoading(false);
        setRefreshing(false);
      });
    return () => {
      active = false;
    };
  }, [refreshVersion]);

  const openDialog = (amount?: number) => {
    setPreset(amount);
    setDialogOpen(true);
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Billing"
        description="Prepaid API balance in MYR. Add funds when you need them, with no plans or monthly commitment."
        actions={
          <>
            <Button
              variant="outline"
              disabled={refreshing || txLoading}
              onClick={() => {
                setRefreshing(true);
                setRefreshVersion((version) => version + 1);
              }}
            >
              <RefreshCw className={`size-4 ${refreshing ? "animate-spin" : ""}`} aria-hidden="true" />
              Refresh
            </Button>
            <Button onClick={() => openDialog()}>
              <Coins className="size-4" aria-hidden="true" />
              Add funds
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {billing ? (
          <>
            <StatCard
              label="Current balance"
              value={formatRM(billing.balance)}
              icon={Wallet}
              hint="Remaining prepaid balance in MYR"
              footer={`Spend last 30 days: ${formatRMAdaptive(billing.spend30d)}`}
            />
            <StatCard
              label="Estimated remaining requests"
              value={formatCompactNumber(billing.estimatedRemainingRequests)}
              icon={Gauge}
              hint="Based on recent average cost per request"
              footer="Estimate only, based on recent usage"
            />
            <StatCard
              label="Estimated remaining tokens"
              value={formatCompactNumber(billing.estimatedRemainingTokens, { decimals: 1 })}
              icon={TrendingUp}
              hint="Rough token runway at current usage"
              footer="Estimate only, based on recent usage"
            />
          </>
        ) : (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-28" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-24" />
                <Skeleton className="mt-2 h-3 w-32" />
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Top-up options</CardTitle>
          <Badge variant="secondary" className="hidden sm:inline-flex">
            Popular: RM{popularTopUp}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
            {topUpOptions.map((option) => (
              <button
                key={option}
                onClick={() => openDialog(option)}
                className={cn(
                  "flex flex-col items-center justify-center rounded-lg border px-2 py-5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  option === popularTopUp
                    ? "border-primary/40 bg-primary/5 ring-1 ring-primary/30 hover:bg-primary/10"
                    : "bg-background hover:bg-muted"
                )}
              >
                <span className="font-mono text-base font-semibold tabular-nums">
                  RM{option}
                </span>
                <span className="mt-0.5 text-xs text-muted-foreground">
                  {option === popularTopUp ? "Most popular" : "Credit"}
                </span>
              </button>
            ))}
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Topping up adds credit to your API balance. All usage is deducted
            from this balance. Billing is separate from AtlasFlux AI credits.
          </p>
        </CardContent>
      </Card>

      {billing ? (
        <AutoReloadCard initial={billing.autoReload} />
      ) : (
        <Skeleton className="h-64 w-full" />
      )}

      <PaymentCardSection />

      <Card>
        <CardHeader>
          <CardTitle>Transaction history</CardTitle>
        </CardHeader>
        <CardContent>
          {txLoading ? (
            <div className="flex flex-col gap-3 py-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : transactions ? (
            <TransactionTable transactions={transactions} />
          ) : null}
        </CardContent>
      </Card>

      <AddFundsDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        presetAmount={preset}
      />
    </div>
  );
}
