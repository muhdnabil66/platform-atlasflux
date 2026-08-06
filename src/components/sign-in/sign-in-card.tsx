"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSignIn, useUser } from "@clerk/nextjs";
import { Loader2, Lock, Mail } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export function SignInCard() {
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn } = useSignIn();
  const { isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) {
      router.push("/dashboard/overview");
    }
  }, [isSignedIn, router]);

  const handleEmailPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signIn) return;
    if (!email.trim() || !password.trim()) {
      toast.error("Enter your email and password");
      return;
    }

    setLoading(true);
    try {
      // Step 1: Create sign-in with identifier
      const createResult = await signIn.create({
        identifier: email,
      });
      if (createResult.error) {
        toast.error(createResult.error.message || "Sign in failed");
        return;
      }

      // Step 2: Submit password
      const passwordResult = await signIn.password({ password });
      if (passwordResult.error) {
        toast.error(passwordResult.error.message || "Invalid password");
        return;
      }

      // Step 3: Finalize - set the session as active
      const finalizeResult = await signIn.finalize();
      if (finalizeResult.error) {
        toast.error(finalizeResult.error.message || "Failed to complete sign in");
        return;
      }

      toast.success("Signed in successfully");
      router.push("/dashboard/overview");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Sign in failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    if (!signIn) return;
    setGoogleLoading(true);
    try {
      await signIn.sso({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectCallbackUrl: "/dashboard/overview",
      });
    } catch {
      toast.error("Google sign-in failed");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-xl font-semibold tracking-tight">
          Sign in to your developer account
        </h1>
        <p className="text-sm text-muted-foreground">
          Use your existing AtlasFlux account to continue.
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="w-full"
          disabled={googleLoading || !signIn}
          onClick={handleGoogle}
        >
          {googleLoading ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <GoogleIcon />
          )}
          Continue with Google
        </Button>

        <div className="my-1 flex items-center gap-3" role="separator" aria-label="or">
          <Separator className="flex-1" />
          <span className="text-xs uppercase tracking-wide text-muted-foreground">or</span>
          <Separator className="flex-1" />
        </div>

        <form onSubmit={handleEmailPassword} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email address</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9"
                required
              />
            </div>
          </div>

          <Button type="submit" size="lg" disabled={loading || !signIn} className="w-full">
            {loading ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <Lock className="size-4" aria-hidden="true" />
            )}
            Sign in
          </Button>
        </form>
      </div>

      <div className="mt-5 rounded-lg border bg-muted/40 p-3.5 text-xs leading-relaxed text-muted-foreground">
        Authentication is shared with AtlasFlux AI. Your developer API balance
        is separate and managed from this platform.
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.5 12.27c0-.85-.08-1.66-.22-2.45H12v4.64h6.46a5.53 5.53 0 0 1-2.4 3.62v3h3.88c2.27-2.1 3.56-5.17 3.56-8.81z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.88-3c-1.08.72-2.45 1.15-4.06 1.15-3.13 0-5.78-2.11-6.72-4.95H1.27v3.09A12 12 0 0 0 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.3a7.2 7.2 0 0 1 0-4.6V6.6H1.27a12 12 0 0 0 0 10.78l4.01-3.08z"
      />
      <path
        fill="#EA4335"
        d="M12 4.76c1.76 0 3.35.6 4.6 1.8l3.43-3.43A11.96 11.96 0 0 0 12 0 12 12 0 0 0 1.27 6.6l4.01 3.1C6.22 6.87 8.87 4.76 12 4.76z"
      />
    </svg>
  );
}
