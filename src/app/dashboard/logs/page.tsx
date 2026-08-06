"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Search, ScrollText } from "lucide-react";
import type { RequestLog, RequestStatus } from "@/types/api";
import { getRequestLogs } from "@/lib/api-client";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { LogsTable } from "@/components/logs/logs-table";

const PAGE_SIZE = 20;

export default function LogsPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState<"all" | RequestStatus>("all");
  const [logs, setLogs] = useState<RequestLog[] | null>(null);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    let active = true;
    getRequestLogs({ search: debouncedSearch, status, limit: PAGE_SIZE, offset }).then(
      (result) => {
        if (!active) return;
        setLogs(result.logs);
        setTotal(result.total);
        setLoading(false);
      }
    );
    return () => {
      active = false;
    };
  }, [debouncedSearch, status, offset]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.floor(offset / PAGE_SIZE) + 1;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Logs"
        description="Inspect individual requests: tokens, search, cost, latency and status."
      />

      <Card>
        <CardContent className="flex flex-col gap-3 pt-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setOffset(0);
              }}
              placeholder="Search by request ID, key, endpoint..."
              className="pl-9"
              aria-label="Search logs"
            />
          </div>
          <Select
            value={status}
            onValueChange={(v) => {
              setStatus(v as "all" | RequestStatus);
              setOffset(0);
            }}
          >
            <SelectTrigger className="w-full sm:w-44" aria-label="Filter by status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="succeeded">Successful</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          {loading && logs === null ? (
            <div className="flex flex-col gap-3 py-2">
              {Array.from({ length: 10 }).map((_, i) => (
                <Skeleton key={i} className="h-11 w-full" />
              ))}
            </div>
          ) : logs && logs.length === 0 ? (
            <EmptyState
              icon={ScrollText}
              title="No logs found"
              description={
                search
                  ? `No requests match "${search}". Try a different search term.`
                  : "No requests match the current filters."
              }
            />
          ) : logs ? (
            <LogsTable logs={logs} />
          ) : null}

          {logs && logs.length > 0 && (
            <div className="mt-4 flex flex-col items-center justify-between gap-3 border-t pt-4 sm:flex-row">
              <p className="text-sm tabular-nums text-muted-foreground">
                Showing{" "}
                <span className="font-medium text-foreground">
                  {offset + 1} to {Math.min(offset + PAGE_SIZE, total)}
                </span>{" "}
                of <span className="font-medium text-foreground">{total}</span> requests
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage <= 1}
                  onClick={() => setOffset((o) => Math.max(0, o - PAGE_SIZE))}
                >
                  <ChevronLeft className="size-4" aria-hidden="true" />
                  Previous
                </Button>
                <span className="text-sm tabular-nums text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage >= totalPages}
                  onClick={() => setOffset((o) => o + PAGE_SIZE)}
                >
                  Next
                  <ChevronRight className="size-4" aria-hidden="true" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
