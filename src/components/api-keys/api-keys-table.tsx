"use client";

import { useState } from "react";
import { MoreHorizontal, Pencil, ShieldAlert, Trash2, Copy } from "lucide-react";
import { toast } from "sonner";
import type { ApiKey } from "@/types/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/shared/status-badge";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { CopyButton } from "@/components/shared/copy-button";
import { formatDate, formatCompactNumber, formatRelativeTime } from "@/lib/format";

interface ApiKeysTableProps {
  keys: ApiKey[];
  onKeysChange: (keys: ApiKey[]) => void;
}

export function ApiKeysTable({ keys, onKeysChange }: ApiKeysTableProps) {
  const [renameTarget, setRenameTarget] = useState<ApiKey | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [revokeTarget, setRevokeTarget] = useState<ApiKey | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ApiKey | null>(null);

  const handleRename = () => {
    if (!renameTarget) return;
    const updated = keys.map((k) =>
      k.id === renameTarget.id ? { ...k, name: renameValue.trim() || k.name } : k
    );
    onKeysChange(updated);
    toast.success("Key renamed");
    setRenameTarget(null);
  };

  const handleRevoke = () => {
    if (!revokeTarget) return;
    onKeysChange(
      keys.map((k) => (k.id === revokeTarget.id ? { ...k, status: "revoked" as const } : k))
    );
    toast.success("Key revoked");
    setRevokeTarget(null);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    onKeysChange(keys.filter((k) => k.id !== deleteTarget.id));
    toast.success("Key deleted");
    setDeleteTarget(null);
  };

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Prefix</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Last used</TableHead>
              <TableHead className="text-right">Usage</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {keys.map((key) => (
              <TableRow key={key.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{key.name}</span>
                    <span className="text-xs text-muted-foreground capitalize">{key.environment}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <code className="font-mono text-[12px]">{key.prefix}...</code>
                    <CopyButton value={key.prefix} ariaLabel={`Copy prefix for ${key.name}`} className="size-6 px-0" />
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{formatDate(key.created)}</TableCell>
                <TableCell className="text-muted-foreground">
                  {key.lastUsed ? formatRelativeTime(key.lastUsed) : "Never"}
                </TableCell>
                <TableCell className="text-right tabular-nums">{formatCompactNumber(key.usage)}</TableCell>
                <TableCell>
                  <StatusBadge status={key.status} />
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" aria-label={`Actions for ${key.name}`}>
                        <MoreHorizontal className="size-4" aria-hidden="true" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setRenameTarget(key);
                          setRenameValue(key.name);
                        }}
                      >
                        <Pencil /> Rename
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          navigator.clipboard?.writeText(key.prefix).catch(() => undefined);
                          toast.success("Prefix copied to clipboard");
                        }}
                      >
                        <Copy className="size-4" /> Copy prefix
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        variant="destructive"
                        disabled={key.status === "revoked"}
                        onClick={() => setRevokeTarget(key)}
                      >
                        <ShieldAlert /> Revoke
                      </DropdownMenuItem>
                      <DropdownMenuItem variant="destructive" onClick={() => setDeleteTarget(key)}>
                        <Trash2 /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={Boolean(renameTarget)} onOpenChange={(v) => !v && setRenameTarget(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Rename key</DialogTitle>
            <DialogDescription>
              Update the display name for this API key.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="rename-key">Key name</Label>
            <Input
              id="rename-key"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameTarget(null)}>
              Cancel
            </Button>
            <Button onClick={handleRename}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={Boolean(revokeTarget)}
        onOpenChange={(v) => !v && setRevokeTarget(null)}
        title={`Revoke "${revokeTarget?.name}"?`}
        description="Requests made with a revoked key will stop immediately. This cannot be undone."
        confirmLabel="Revoke key"
        variant="destructive"
        onConfirm={handleRevoke}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
        title={`Delete "${deleteTarget?.name}"?`}
        description="The key will be permanently removed from your account. Any integrations using it will stop working."
        confirmLabel="Delete key"
        variant="destructive"
        onConfirm={handleDelete}
      />

      {keys.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-12 text-center">
          <p className="text-sm font-medium">No API keys</p>
          <p className="text-sm text-muted-foreground">
            Create a key to start making requests to AtlasFlux.
          </p>
        </div>
      )}
    </>
  );
}
