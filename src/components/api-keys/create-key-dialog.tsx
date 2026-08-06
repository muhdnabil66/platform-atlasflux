"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AlertTriangle, CheckCircle2, KeyRound } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CopyButton } from "@/components/shared/copy-button";
import { createApiKey } from "@/lib/api-client";
import type { CreatedApiKey } from "@/types/api";

const schema = z.object({
  name: z.string().trim().min(1, "Key name is required").max(64, "Key name is too long"),
  environment: z.enum(["development", "production"]),
  monthlySpendLimit: z
    .number({ error: "Enter a valid amount" })
    .positive("Amount must be greater than 0")
    .max(100000, "Amount is too large")
    .optional(),
  expiration: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface CreateKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (key: CreatedApiKey) => void;
}

export function CreateKeyDialog({ open, onOpenChange, onCreated }: CreateKeyDialogProps) {
  const [submitting, setSubmitting] = useState(false);
  const [created, setCreated] = useState<CreatedApiKey | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      environment: "development",
      monthlySpendLimit: undefined,
      expiration: "",
    },
  });

  const environment = watch("environment");

  const close = () => {
    onOpenChange(false);
    setCreated(null);
    setConfirmed(false);
    reset();
  };

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      const key = await createApiKey({
        name: values.name,
        environment: values.environment,
        monthlySpendLimit: values.monthlySpendLimit,
        expiration: values.expiration || undefined,
      });
      setCreated(key);
      onCreated(key);
      toast.success("API key created");
    } catch {
      toast.error("Failed to create API key");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => (v ? undefined : close())}>
      <DialogContent className="sm:max-w-md">
        {created ? (
          <>
            <DialogHeader>
              <div className="mb-1 flex size-10 items-center justify-center rounded-lg bg-success/12">
                <CheckCircle2 className="size-5 text-success" aria-hidden="true" />
              </div>
              <DialogTitle>API key created</DialogTitle>
              <DialogDescription>
                Copy your key now. You will not be able to view it again.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-2">
              <Label htmlFor="created-key">Full key</Label>
              <div className="flex items-center gap-2">
                <code
                  id="created-key"
                  className="flex-1 overflow-x-auto rounded-lg border bg-muted/50 px-3 py-2 font-mono text-[13px] break-all"
                >
                  {created.secret}
                </code>
                <CopyButton value={created.secret} label="Copy" ariaLabel="Copy full API key" />
              </div>
            </div>

            <div className="flex items-start gap-2.5 rounded-lg border border-warning/30 bg-warning/10 p-3">
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden="true" />
              <p className="text-xs leading-relaxed text-muted-foreground">
                Store this key securely. This is the only time the full key is
                shown. Anyone with this key can make requests from your balance.
              </p>
            </div>

            <label className="flex items-start gap-2.5 text-sm">
              <Checkbox checked={confirmed} onCheckedChange={(v) => setConfirmed(Boolean(v))} />
              <span className="text-muted-foreground">
                I have stored this key securely and understand that it will not
                be shown again.
              </span>
            </label>

            <DialogFooter>
              <Button onClick={close} disabled={!confirmed} className="w-full">
                Done
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <div className="mb-1 flex size-10 items-center justify-center rounded-lg bg-muted">
                <KeyRound className="size-5 text-muted-foreground" aria-hidden="true" />
              </div>
              <DialogTitle>Create API key</DialogTitle>
              <DialogDescription>
                Keys authenticate requests to the AtlasFlux API.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="key-name">Key name</Label>
                <Input
                  id="key-name"
                  placeholder="Production app"
                  autoFocus
                  {...register("name")}
                  aria-invalid={Boolean(errors.name)}
                />
                {errors.name && (
                  <p className="text-xs text-destructive">{errors.name.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label>Environment</Label>
                <Select
                  value={environment}
                  onValueChange={(v) => setValue("environment", v as FormValues["environment"])}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select environment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="development">Development</SelectItem>
                    <SelectItem value="production">Production</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Development keys use the test prefix{" "}
                  <code className="font-mono">af_test_</code>. Production keys
                  use <code className="font-mono">af_live_</code>.
                </p>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="spend-limit">
                  Monthly spend limit <span className="font-normal text-muted-foreground">(optional, RM)</span>
                </Label>
                <Input
                  id="spend-limit"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  placeholder="e.g. 100"
                  {...register("monthlySpendLimit", {
                    setValueAs: (v) => (v === "" ? undefined : Number(v)),
                  })}
                  aria-invalid={Boolean(errors.monthlySpendLimit)}
                />
                {errors.monthlySpendLimit && (
                  <p className="text-xs text-destructive">{errors.monthlySpendLimit.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="expiration">
                  Expiration <span className="font-normal text-muted-foreground">(optional)</span>
                </Label>
                <Input
                  id="expiration"
                  type="date"
                  {...register("expiration")}
                />
              </div>

              <DialogFooter className="mt-2">
                <Button type="submit" disabled={submitting} className="w-full">
                  {submitting ? "Creating..." : "Create key"}
                </Button>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
