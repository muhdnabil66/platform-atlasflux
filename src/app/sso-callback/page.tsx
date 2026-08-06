"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useClerk, useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

export default function SSOCallbackPage() {
  const clerk = useClerk();
  const { isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!clerk.loaded) return;

    async function handleCallback() {
      try {
        await clerk.handleRedirectCallback({
          signInFallbackRedirectUrl: "/dashboard/overview",
          signUpFallbackRedirectUrl: "/dashboard/overview",
        });
      } catch {
        setTimeout(() => {
          router.push("/sign-in?error=sso_callback_failed");
        }, 2000);
      }
    }

    void handleCallback();
  }, [clerk.loaded, clerk, router]);

  useEffect(() => {
    if (isSignedIn) {
      router.push("/dashboard/overview");
    }
  }, [isSignedIn, router]);

  return (
    <div className="flex min-h-dvh items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Completing sign-in...</p>
      </div>
    </div>
  );
}
