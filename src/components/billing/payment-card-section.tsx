"use client";

import { useCallback, useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { toast } from "sonner";
import { CreditCard, Trash2 } from "lucide-react";
import { createSetupIntent, getPaymentMethod, removePaymentMethod } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ""
);

interface PaymentCardInfo {
  id: string;
  brand: string;
  last4: string;
  exp_month: number;
  exp_year: number;
}

function AddCardForm({ onDone }: { onDone: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setProcessing(true);
    try {
      const { error } = await stripe.confirmSetup({
        elements,
        confirmParams: { return_url: window.location.href },
      });
      if (error) {
        toast.error(error.message ?? "Failed to save card");
      } else {
        toast.success("Payment card saved");
        onDone();
      }
    } catch {
      toast.error("Failed to save card");
    } finally {
      setProcessing(false);
    }
  }, [stripe, elements, onDone]);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <PaymentElement />
      <Button type="submit" disabled={!stripe || processing}>
        {processing ? "Saving..." : "Save card"}
      </Button>
    </form>
  );
}

export function PaymentCardSection() {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [card, setCard] = useState<PaymentCardInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  const fetchCard = useCallback(async () => {
    try {
      const res = await getPaymentMethod();
      setCard(res.payment_method);
    } catch {
      setCard(null);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      await fetchCard();
      if (!cancelled) setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, [fetchCard]);

  const handleAddCard = async () => {
    try {
      const res = await createSetupIntent();
      setClientSecret(res.client_secret);
      setShowAdd(true);
    } catch {
      toast.error("Failed to initialize card setup");
    }
  };

  const handleRemoveCard = async () => {
    try {
      await removePaymentMethod();
      setCard(null);
      toast.success("Payment card removed");
    } catch {
      toast.error("Failed to remove card");
    }
  };

  const handleDone = () => {
    setShowAdd(false);
    setClientSecret(null);
    fetchCard();
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="size-4 text-muted-foreground" />
            Payment card
          </CardTitle>
          <CardDescription>Manage your card for auto-reload top-ups.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="size-4 text-muted-foreground" />
          Payment card
        </CardTitle>
        <CardDescription>Manage your card for auto-reload top-ups.</CardDescription>
      </CardHeader>
      <CardContent>
        {card ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="uppercase">
                {card.brand}
              </Badge>
              <span className="font-mono text-sm">
                **** **** **** {card.last4}
              </span>
              <span className="text-xs text-muted-foreground">
                Expires {String(card.exp_month).padStart(2, "0")}/{card.exp_year}
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={handleRemoveCard}>
              <Trash2 className="size-4" />
              Remove
            </Button>
          </div>
        ) : showAdd && clientSecret ? (
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: { theme: "stripe" },
            }}
          >
            <AddCardForm onDone={handleDone} />
          </Elements>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-muted-foreground">
              No payment card on file. Add a card to enable auto-reload.
            </p>
            <Button variant="outline" onClick={handleAddCard}>
              <CreditCard className="size-4" />
              Add payment card
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
