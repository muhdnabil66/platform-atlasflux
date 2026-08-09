"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { useAuth } from "@/components/providers/auth-provider";
import { useRouter } from "next/navigation";
import { revokeAllApiKeys, deleteAccount } from "@/lib/api-client";
import { useSession, useSessionList } from "@clerk/nextjs";

export function SecuritySection() {
  const { signOut } = useAuth();
  const { session: currentSession } = useSession();
  const { sessions, isLoaded: sessionsLoaded } = useSessionList();
  const router = useRouter();
  const [open, setOpen] = useState<"keys" | "sessions" | "account" | null>(null);
  const [loading, setLoading] = useState<"keys" | "sessions" | "account" | null>(null);

  const handleKeys = async () => {
    setOpen(null);
    setLoading("keys");
    try {
      const result = await revokeAllApiKeys();
      toast.success(`${result.revoked} API key(s) revoked`);
    } catch {
      toast.error("Failed to revoke API keys");
    } finally {
      setLoading(null);
    }
  };

  const otherSessions = sessions?.filter((session) => session.id !== currentSession?.id) ?? [];

  const handleSessions = async () => {
    setOpen(null);
    if (otherSessions.length === 0) {
      toast.info("No other active sessions found");
      return;
    }
    setLoading("sessions");
    try {
      await Promise.all(otherSessions.map((session) => session.end()));
      toast.success("Other sessions signed out");
    } catch {
      toast.error("Failed to sign out other sessions");
    } finally {
      setLoading(null);
    }
  };

  const handleDelete = async () => {
    setOpen(null);
    setLoading("account");
    try {
      await deleteAccount();
      await signOut();
      toast.success("Developer account closed");
      router.push("/");
    } catch {
      toast.error("Failed to delete account");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-sm font-semibold">Active sessions</h3>
        <ul className="mt-3 flex flex-col gap-2">
          {(sessionsLoaded ? sessions ?? [] : []).map((session) => (
            <li
              key={session.id}
              className="flex items-center justify-between gap-4 rounded-lg border bg-background p-3 text-sm"
            >
              <div>
                <p className="font-medium">
                  Session {session.id.slice(-8)}
                  {session.id === currentSession?.id && (
                    <span className="ml-2 rounded-full bg-accent/50 px-2 py-0.5 text-[11px] font-medium text-accent-foreground">
                      Current session
                    </span>
                  )}
                </p>
                <p className="text-xs text-muted-foreground">
                  Last active {session.lastActiveAt.toLocaleString()}
                </p>
              </div>
              {session.id !== currentSession?.id && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => void session.end().then(() => toast.success("Session signed out")).catch(() => toast.error("Failed to sign out session"))}
                >
                  Sign out
                </Button>
              )}
            </li>
          ))}
          </ul>
        {sessionsLoaded && (sessions?.length ?? 0) === 0 && (
          <p className="mt-3 text-sm text-muted-foreground">No active sessions found.</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold">Danger zone</h3>
        <div className="flex flex-col gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium">Revoke all API keys</p>
            <p className="text-xs text-muted-foreground">
              Immediately invalidates every API key on this account.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setOpen("keys")}
            className="text-destructive"
            disabled={loading === "keys"}
          >
            {loading === "keys" ? "Revoking..." : "Revoke all keys"}
          </Button>
          <ConfirmDialog
            open={open === "keys"}
            onOpenChange={(isOpen) => setOpen(isOpen ? "keys" : null)}
            title="Revoke all API keys?"
            description="All API keys on this account will be invalidated immediately. Applications using them will stop working. You can create new keys afterwards."
            confirmLabel="Revoke all keys"
            variant="destructive"
            onConfirm={handleKeys}
          />
        </div>

        <div className="flex flex-col gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium">Sign out other sessions</p>
            <p className="text-xs text-muted-foreground">
              Signs out every active Clerk session except this one.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setOpen("sessions")}
            className="text-destructive"
            disabled={loading === "sessions" || !sessionsLoaded || otherSessions.length === 0}
          >
            Sign out others
          </Button>
          <ConfirmDialog
            open={open === "sessions"}
            onOpenChange={(isOpen) => setOpen(isOpen ? "sessions" : null)}
            title="Sign out other sessions?"
            description="All other active sessions will be signed out immediately. You will stay signed in on this device."
            confirmLabel="Sign out others"
            variant="destructive"
            onConfirm={handleSessions}
          />
        </div>

        <div className="flex flex-col gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium">Close developer account</p>
            <p className="text-xs text-muted-foreground">
              Closes access and revokes API keys while retaining financial records for audit.
            </p>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setOpen("account")}
            disabled={loading === "account"}
          >
            {loading === "account" ? "Closing..." : "Close account"}
          </Button>
          <ConfirmDialog
            open={open === "account"}
            onOpenChange={(isOpen) => setOpen(isOpen ? "account" : null)}
            title="Close your account?"
            description="This will revoke all API keys and close dashboard access. Financial records are retained for audit."
            confirmLabel="Close account"
            variant="destructive"
            onConfirm={handleDelete}
          />
        </div>
      </div>
    </div>
  );
}
