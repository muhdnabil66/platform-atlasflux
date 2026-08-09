"use client";

import type { ActivityItem } from "@/types/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/status-badge";
import { CopyButton } from "@/components/shared/copy-button";
import { formatDuration, formatNumber, formatRMExact, formatTime } from "@/lib/format";

interface ActivityTableProps {
  items: ActivityItem[];
}

export function ActivityTable({ items }: ActivityTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Time</TableHead>
            <TableHead>Request ID</TableHead>
            <TableHead>Endpoint</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Tokens</TableHead>
            <TableHead className="text-right">Search</TableHead>
            <TableHead className="text-right">Cost</TableHead>
            <TableHead className="text-right">Latency</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="text-muted-foreground">
                <time dateTime={item.time}>{formatTime(item.time)}</time>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <code className="font-mono text-[12px] text-foreground">{item.requestId}</code>
                  <CopyButton value={item.requestId} ariaLabel="Copy request ID" className="size-6 px-0" />
                </div>
              </TableCell>
              <TableCell>
                <code className="font-mono text-[12px] text-muted-foreground">{item.endpoint}</code>
              </TableCell>
              <TableCell>
                <StatusBadge status={item.status} />
              </TableCell>
              <TableCell className="text-right tabular-nums">{formatNumber(item.tokens)}</TableCell>
              <TableCell className="text-right tabular-nums">{item.search}</TableCell>
              <TableCell className="min-w-36 text-right font-mono tabular-nums">{formatRMExact(item.cost)}</TableCell>
              <TableCell className="text-right tabular-nums text-muted-foreground">
                {formatDuration(item.latencyMs)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
