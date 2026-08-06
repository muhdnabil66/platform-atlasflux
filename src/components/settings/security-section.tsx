"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { useAuth } from "@/components/providers/auth-provider";
import { useRouter } from "next/navigation";

const SESSIONS: { device: string; location: string; current: boolean }[] = [];

export function SecuritySection() {
  const { signOut } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState<"keys" | "sessions" | "account" | null>(null);

  const handleKeys = () => {
    setOpen(null);
    toast.success("All API keys revoked");
  };

  const handleSessions = () => {
    setOpen(null);
    toast.success("Other sessions signed out");
  };

  const handleDelete = async () => {
    setOpen(null);
    await signOut();
    toast.success("Developer account deleted");
    router.push("/");
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-sm font-semibold">Active sessions</h3>
        <ul className="mt-3 flex flex-col gap-2">
          {SESSIONS.map((session) => (
            <li
              key={session.device}
              className="flex items-center justify-between gap-4 rounded-lg border bg-background p-3 text-sm"
            >
              <div>
                <p className="font-medium">
                  {session.device}
                  {session.current && (
                    <span className="ml-2 rounded-full bg-accent/50 px-2 py-0.5 text-[11px] font-medium text-accent-foreground">
                      Current session
                    </span>
                  )}
                </p>
                <p className="text-xs text-muted-foreground">{session.location}</p>
              </div>
              {!session.current && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    toast.success("Session signed out");
                  }}
                >
                  Sign out
                </Button>
              )}
            </li>
          ))}
        </ul>
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
          >
            Revoke all keys
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
              Signs out every active session except this one.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setOpen("sessions")}
            className="text-destructive"
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
            <p className="text-sm font-medium">Delete developer account</p>
            <p className="text-xs text-muted-foreground">
              Permanently deletes your account, API keys, logs and balance.
            </p>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setOpen("account")}
          >
            Delete account
          </Button>
          <ConfirmDialog
            open={open === "account"}
            onOpenChange={(isOpen) => setOpen(isOpen ? "account" : null)}
            title="Delete your account?"
            description="This action is permanent. Your account, API keys, request logs and any remaining balance will be deleted and cannot be recovered."
            confirmLabel="Delete account"
            variant="destructive"
            onConfirm={handleDelete}
          />
        </div>
      </div>
    </div>
  );
}
