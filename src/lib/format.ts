export function formatRM(value: number): string {
  return new Intl.NumberFormat("en-MY", {
    style: "currency",
    currency: "MYR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
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
