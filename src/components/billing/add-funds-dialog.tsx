"use client";

import { useRef, useState } from "react";
import { CreditCard, ExternalLink, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { topUpOptions, popularTopUp } from "@/config/billing";
import { API_BASE_URL } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import { formatRM } from "@/lib/format";

interface AddFundsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdded?: (amount: number) => void;
  presetAmount?: number;
}

export function AddFundsDialog({ open, onOpenChange, onAdded, presetAmount }: AddFundsDialogProps) {
  const [amount, setAmount] = useState<number>(popularTopUp);
  const [custom, setCustom] = useState(false);
  const [customValue, setCustomValue] = useState("");
  const [loading, setLoading] = useState(false);
  const customInputRef = useRef<HTMLInputElement>(null);
  const [lastOpen, setLastOpen] = useState(open);

  if (open !== lastOpen) {
    setLastOpen(open);
    if (open) {
      if (presetAmount) {
        setAmount(presetAmount);
        setCustom(false);
        setCustomValue("");
      } else {
        setAmount(popularTopUp);
        setCustom(false);
        setCustomValue("");
      }
    }
  }

  const selectPreset = (option: number) => {
    setAmount(option);
    setCustom(false);
    setCustomValue("");
  };

  const handleCustomClick = () => {
    setCustom(true);
    customInputRef.current?.focus();
  };

  const handleCustomChange = (value: string) => {
    setCustomValue(value);
    const parsed = Number(value);
    if (value.trim() !== "" && !Number.isNaN(parsed)) {
      setAmount(parsed);
    }
  };

  const handleConfirm = async () => {
    if (!Number.isFinite(amount) || amount < 10 || amount > 500) {
      toast.error("Enter an amount between RM10 and RM500");
      return;
    }

    setLoading(true);
    try {
      // Convert MYR to sen (1 MYR = 100 sen)
      const amountSen = Math.round(amount * 100);

      const res = await fetch(`${API_BASE_URL}/dashboard/billing/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ amountSen }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error?.message ?? "Failed to create checkout session");
      }

      const data = await res.json() as { url: string; session_id: string };

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to start checkout";
      toast.error(message);
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mb-1 flex size-10 items-center justify-center rounded-lg bg-muted">
            <CreditCard className="size-5 text-muted-foreground" aria-hidden="true" />
          </div>
          <DialogTitle>Add funds</DialogTitle>
          <DialogDescription>
            Top up your prepaid API balance. Amounts are charged in Malaysian
            Ringgit.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-4 gap-2">
              {topUpOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => selectPreset(option)}
                  aria-pressed={amount === option && !custom}
                  className={cn(
                    "flex flex-col items-center justify-center rounded-lg border px-1.5 py-2.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    amount === option && !custom
                      ? "border-primary bg-primary/5 ring-1 ring-primary/40"
                      : "bg-background hover:bg-muted"
                  )}
                >
                  <span className="font-mono text-sm font-semibold tabular-nums">
                    RM{option}
                  </span>
                  {option === popularTopUp && (
                    <span className="text-[11px] text-muted-foreground">Popular</span>
                  )}
                </button>
              ))}
              <button
                onClick={handleCustomClick}
                aria-pressed={custom}
                className={cn(
                  "flex flex-col items-center justify-center rounded-lg border px-1.5 py-2.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  custom
                    ? "border-primary bg-primary/5 ring-1 ring-primary/40"
                    : "bg-background hover:bg-muted"
                )}
              >
                <span className="text-sm font-semibold">Custom</span>
                <span className="text-[11px] text-muted-foreground">RM10-500</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="shrink-0 text-sm font-medium">Custom amount</span>
              <div className="relative flex-1">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                  RM
                </span>
                <Input
                  id="custom-amount"
                  ref={customInputRef}
                  type="number"
                  inputMode="numeric"
                  min={10}
                  max={500}
                  placeholder="10 to 500"
                  className="h-9 pl-9"
                  value={customValue}
                  onChange={(e) => handleCustomChange(e.target.value)}
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Preset or custom, from RM10 to RM500.
            </p>
          </div>

          <div className="flex items-center justify-between rounded-lg border bg-muted/40 px-3 py-2 text-sm">
            <span className="text-muted-foreground">Amount</span>
            <span className="font-mono text-base font-semibold tabular-nums">
              {formatRM(amount)}
            </span>
          </div>

          <div className="rounded-lg border p-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-muted-foreground">
                <CreditCard className="size-4" aria-hidden="true" />
                Payment method
              </span>
              <span className="font-medium">Card / FPX</span>
            </div>
            <p className="mt-1.5 flex items-start gap-2 text-xs text-muted-foreground">
              <ExternalLink className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
              You will be redirected to Stripe Checkout to complete the payment
              securely.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={loading}>
            {loading && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
            Confirm top-up
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
