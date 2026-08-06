import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type Tone = "success" | "warning" | "destructive" | "neutral" | "info";

export const STATUS_CONFIG: Record<
  string,
  { label: string; tone: Tone }
> = {
  success: { label: "Successful", tone: "success" },
  succeeded: { label: "Succeeded", tone: "success" },
  failed: { label: "Failed", tone: "destructive" },
  rate_limited: { label: "Rate limited", tone: "warning" },
  pending: { label: "Pending", tone: "warning" },
  cancelled: { label: "Cancelled", tone: "neutral" },
  active: { label: "Active", tone: "success" },
  revoked: { label: "Revoked", tone: "neutral" },
  expired: { label: "Expired", tone: "neutral" },
  refunded: { label: "Refunded", tone: "info" },
  top_up: { label: "Top-up", tone: "info" },
  api_usage: { label: "API usage", tone: "neutral" },
  refund: { label: "Refund", tone: "info" },
  adjustment: { label: "Adjustment", tone: "neutral" },
};

const toneClasses: Record<Tone, string> = {
  success: "border-transparent bg-success/12 text-success",
  warning: "border-transparent bg-warning/15 text-warning dark:text-warning",
  destructive: "border-transparent bg-destructive/12 text-destructive",
  neutral: "border-transparent bg-muted text-muted-foreground",
  info: "border-transparent bg-info/12 text-info",
};

const dotClasses: Record<Tone, string> = {
  success: "bg-success",
  warning: "bg-warning",
  destructive: "bg-destructive",
  neutral: "bg-muted-foreground",
  info: "bg-info",
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? { label: status, tone: "neutral" as Tone };
  return (
    <Badge
      variant="secondary"
      className={cn("inline-flex items-center gap-1.5 font-medium", toneClasses[config.tone], className)}
    >
      <span className={cn("size-1.5 rounded-full", dotClasses[config.tone])} aria-hidden="true" />
      {config.label}
    </Badge>
  );
}
