"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useClerk, useUser } from "@clerk/nextjs";
import { LoaderCircle } from "lucide-react";

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
    <div className="dark flex min-h-dvh items-center justify-center bg-[#09090B]">
      <div className="flex flex-col items-center gap-4">
        <LoaderCircle className="size-8 animate-spin text-zinc-500" />
        <p className="text-sm text-zinc-500">Completing sign-in...</p>
      </div>
    </div>
  );
}