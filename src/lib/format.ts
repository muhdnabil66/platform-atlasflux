export function formatRM(value: number): string {
  return new Intl.NumberFormat("en-MY", {
    style: "currency",
    currency: "MYR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Format per-request costs without changing their RM scale.
 *
 * Normal currency values keep two decimals (RM0.04, RM0.20, RM2.40).
 * Sub-cent costs keep up to six decimals and remove insignificant trailing
 * zeroes (RM0.0003, RM0.00462, RM0.000431).
 */
export function formatRMExact(value: number): string {
  const absolute = Math.abs(value);
  if (absolute === 0) return "RM0.00";
  const amount = absolute >= 0.01
    ? absolute.toFixed(2)
    : absolute.toFixed(6).replace(/0+$/, "").replace(/\.$/, "");
  return value < 0 ? `-RM${amount}` : `RM${amount}`;
}

/** Keep normal MYR amounts compact while preserving non-zero sub-sen values. */
export function formatRMAdaptive(value: number): string {
  return value !== 0 && Math.abs(value) < 0.01
    ? formatRMExact(value)
    : formatRM(value);
}

export function formatRMCompact(value: number): string {
  if (Math.abs(value) >= 1000) {
    return `RM${formatCompactNumber(value, { decimals: 2 })}`;
  }
  return formatRM(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatCompactNumber(
  value: number,
  options?: { decimals?: number }
): string {
  const decimals = options?.decimals ?? 1;
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatTokens(value: number): string {
  return formatCompactNumber(value);
}

export function formatPercent(value: number, sign = false): string {
  const prefix = sign && value > 0 ? "+" : "";
  return `${prefix}${value.toFixed(1)}%`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-MY", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-MY", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-MY", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function formatDuration(ms: number): string {
  if (ms >= 1000) {
    return `${(ms / 1000).toFixed(2)}s`;
  }
  return `${Math.round(ms)}ms`;
}

export function truncateId(id: string, max = 20): string {
  if (id.length <= max) return id;
  const keep = Math.max(6, max - 3);
  const head = Math.ceil(keep / 2);
  const tail = keep - head;
  return `${id.slice(0, head)}...${id.slice(-tail)}`;
}

export function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

export function timeAgoLabel(deltaMs: number): string {
  const mins = Math.floor(deltaMs / 60000);
  if (mins < 1) return "this hour";
  if (mins < 60) return `past ${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `past ${hours}h`;
  return `past ${Math.floor(hours / 24)}d`;
}
