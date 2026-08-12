"use client";

import { useSearchParams } from "next/navigation";
import { TriangleAlert } from "lucide-react";

export function SsoErrorNotice() {
  const searchParams = useSearchParams();
  if (searchParams?.get("error") !== "sso_callback_failed") {
    return null;
  }

  return (
    <div className="flex items-start gap-2.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-2.5">
      <TriangleAlert className="mt-0.5 size-4 shrink-0 text-red-400" aria-hidden="true" />
      <p className="text-sm text-red-300">
        Sign-in with your provider didn&apos;t complete. Please try again.
      </p>
    </div>
  );
}