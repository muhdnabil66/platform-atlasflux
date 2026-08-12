"use client";

import { useEffect, useState } from "react";
import { useSignIn, useSignUp } from "@clerk/nextjs/legacy";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { LoaderCircle, TriangleAlert } from "lucide-react";
import { SocialAuthButtons } from "@/components/auth/social-auth-buttons";

type AuthMode = "sign-in" | "sign-up";

export function OAuthOnlyForm({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const { isLoaded: isLoadedUser, isSignedIn } = useUser();
  const {
    isLoaded: isLoadedSignIn,
    signIn,
  } = useSignIn();
  const {
    isLoaded: isLoadedSignUp,
    signUp,
  } = useSignUp();
  const [error, setError] = useState<string | null>(null);

  const isLoaded = mode === "sign-in" ? isLoadedSignIn : isLoadedSignUp;
  const authResource = mode === "sign-in" ? signIn : signUp;

  useEffect(() => {
    if (isSignedIn) {
      router.push("/dashboard/overview");
    }
  }, [isSignedIn, router]);

  if (!isLoaded || !isLoadedUser || !authResource) {
    return (
      <div className="flex h-40 items-center justify-center">
        <LoaderCircle className="size-6 animate-spin text-zinc-600" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h1 className="text-xl font-semibold tracking-tight">
          {mode === "sign-in" ? "Sign in to AtlasFlux" : "Create your AtlasFlux account"}
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          Continue with your Google or GitHub account.
        </p>
      </div>

      {error ? (
        <div className="flex items-start gap-2.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-2.5">
          <TriangleAlert className="mt-0.5 size-4 shrink-0 text-red-400" aria-hidden="true" />
          <p className="text-sm text-red-300">{error}</p>
        </div>
      ) : null}

      <SocialAuthButtons
        isLoaded={isLoaded}
        onError={setError}
        onAuthenticate={async (strategy) => {
          if (mode === "sign-in") {
            if (!signIn) throw new Error("Sign-in is still loading.");
            await signIn.authenticateWithRedirect({
              strategy,
              redirectUrl: "/sso-callback",
              redirectUrlComplete: "/dashboard/overview",
            });
            return;
          }

          if (!signUp) throw new Error("Sign-up is still loading.");
          await signUp.authenticateWithRedirect({
            strategy,
            redirectUrl: "/sso-callback",
            redirectUrlComplete: "/dashboard/overview",
          });
        }}
      />
    </div>
  );
}
