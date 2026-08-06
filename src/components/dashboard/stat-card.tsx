import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { formatPercent } from "@/lib/format";

interface StatCardProps {
  label: string;
  value: string;
  delta?: number;
  deltaSuffix?: string;
  tone?: "positive" | "negative" | "neutral";
  icon?: LucideIcon;
  hint?: string;
  footer?: string;
}

export function StatCard({
  label,
  value,
  delta,
  deltaSuffix = "vs previous period",
  tone,
  icon: Icon,
  hint,
  footer,
}: StatCardProps) {
  const isPositive = (delta ?? 0) >= 0;
  const effectiveTone: "positive" | "negative" | "neutral" =
    tone ?? (isPositive ? "positive" : "negative");

  const deltaClass =
    effectiveTone === "positive"
      ? "text-success"
      : effectiveTone === "negative"
        ? "text-destructive"
        : "text-muted-foreground";

  const content = (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {label}
          </CardTitle>
          {Icon && (
            <div className="flex size-7 items-center justify-center rounded-md bg-muted">
              <Icon className="size-3.5 text-muted-foreground" aria-hidden="true" />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold tracking-tight tabular-nums text-foreground">
          {value}
        </p>
        {footer ? (
          <div className="mt-1.5 text-xs text-muted-foreground">{footer}</div>
        ) : (
          delta !== undefined && (
            <div className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground">
              <span
                className={cn(
                  "inline-flex items-center gap-0.5 font-medium tabular-nums",
                  deltaClass
                )}
              >
                {isPositive ? (
                  <ArrowUpRight className="size-3" aria-hidden="true" />
                ) : (
                  <ArrowDownRight className="size-3" aria-hidden="true" />
                )}
                {formatPercent(delta, true)}
              </span>
              <span>{deltaSuffix}</span>
            </div>
          )
        )}
      </CardContent>
    </Card>
  );

  if (!hint) return content;

  return (
    <Tooltip delayDuration={200}>
      <TooltipTrigger asChild>{content}</TooltipTrigger>
      <TooltipContent>{hint}</TooltipContent>
    </Tooltip>
  );
}
