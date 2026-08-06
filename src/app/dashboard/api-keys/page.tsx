"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { KeyRound, Plus, ShieldCheck } from "lucide-react";
import type { ApiKey, CreatedApiKey } from "@/types/api";
import { listApiKeys } from "@/lib/api-client";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { CreateKeyDialog } from "@/components/api-keys/create-key-dialog";
import { ApiKeysTable } from "@/components/api-keys/api-keys-table";
import { Badge } from "@/components/ui/badge";

export default function ApiKeysPage() {
  return (
    <Suspense fallback={<Skeleton className="h-64 w-full" />}>
      <ApiKeysPageContent />
    </Suspense>
  );
}

function ApiKeysPageContent() {
  const searchParams = useSearchParams();
  const [keys, setKeys] = useState<ApiKey[] | null>(null);
  const [dialogOpen, setDialogOpen] = useState(() => searchParams.get("new") === "1");

  useEffect(() => {
    let active = true;
    listApiKeys().then((result) => {
      if (active) setKeys(result);
    });
    return () => {
      active = false;
    };
  }, []);

  const handleCreated = (created: CreatedApiKey) => {
    setKeys((prev) => {
      const base = prev ?? [];
      return [
        {
          id: created.id,
          name: created.name,
          prefix: created.prefix,
          created: created.created,
          lastUsed: created.lastUsed,
          usage: created.usage,
          status: created.status,
          environment: created.environment,
          monthlySpendLimit: created.monthlySpendLimit,
          expiresAt: created.expiresAt,
        },
        ...base,
      ];
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="API Keys"
        description="Create and manage keys used to authenticate requests to AtlasFlux."
        actions={
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="size-4" aria-hidden="true" />
            Create API key
          </Button>
        }
      />

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Keys</CardTitle>
          <Badge variant="secondary" className="gap-1.5">
            <ShieldCheck className="size-3" aria-hidden="true" />
            Keys are shown once at creation
          </Badge>
        </CardHeader>
        <CardContent>
          {keys === null ? (
            <div className="flex flex-col gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : keys.length === 0 ? (
            <EmptyState
              icon={KeyRound}
              title="No API keys yet"
              description="Create your first API key to authenticate requests to AtlasFlux."
              action={
                <Button onClick={() => setDialogOpen(true)}>
                  <Plus className="size-4" aria-hidden="true" />
                  Create API key
                </Button>
              }
            />
          ) : (
            <ApiKeysTable keys={keys} onKeysChange={setKeys} />
          )}
        </CardContent>
      </Card>

      <CreateKeyDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onCreated={handleCreated}
      />
    </div>
  );
}
