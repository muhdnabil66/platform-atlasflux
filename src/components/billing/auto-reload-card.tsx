"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";
import type { AutoReloadConfig } from "@/types/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { formatRM } from "@/lib/format";

export function AutoReloadCard({ initial }: { initial: AutoReloadConfig }) {
  const [enabled, setEnabled] = useState(initial.enabled);
  const [threshold, setThreshold] = useState(initial.threshold);
  const [amount, setAmount] = useState(initial.amount);
  const [monthlyMaximum, setMonthlyMaximum] = useState<number | null>(initial.monthlyMaximum);

  const handleSave = () => {
    toast.success("Auto-reload settings saved (mock)");
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="size-4 text-muted-foreground" aria-hidden="true" />
              Auto-reload
            </CardTitle>
            <CardDescription className="mt-1">
              Automatically top up when your balance drops below a threshold.
            </CardDescription>
          </div>
          <Switch
            checked={enabled}
            onCheckedChange={setEnabled}
            aria-label="Enable auto-reload"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div
          className="grid gap-4 transition-opacity sm:grid-cols-3"
          style={{ opacity: enabled ? 1 : 0.5 }}
          aria-disabled={!enabled}
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="reload-threshold">Trigger when balance below</Label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-mono text-sm text-muted-foreground">
                RM
              </span>
              <Input
                id="reload-threshold"
                type="number"
                min={1}
                value={threshold}
                disabled={!enabled}
                className="pl-9"
                onChange={(e) => setThreshold(Number(e.target.value) || 0)}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="reload-amount">Reload amount</Label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-mono text-sm text-muted-foreground">
                RM
              </span>
              <Input
                id="reload-amount"
                type="number"
                min={10}
                value={amount}
                disabled={!enabled}
                className="pl-9"
                onChange={(e) => setAmount(Number(e.target.value) || 0)}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="reload-max">Monthly maximum</Label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-mono text-sm text-muted-foreground">
                RM
              </span>
              <Input
                id="reload-max"
                type="number"
                min={0}
                value={monthlyMaximum ?? 0}
                disabled={!enabled}
                className="pl-9"
                onChange={(e) => setMonthlyMaximum(Number(e.target.value) || 0)}
              />
            </div>
          </div>
        </div>
        {enabled && (
          <p className="mt-3 text-xs text-muted-foreground">
            When your balance drops below {formatRM(threshold)}, we add{" "}
            {formatRM(amount)} automatically. All payments go through Stripe
            Checkout.
          </p>
        )}
        <div className="mt-4">
          <Button onClick={handleSave} disabled={!enabled}>
            Save settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
