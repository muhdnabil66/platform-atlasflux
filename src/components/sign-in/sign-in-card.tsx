"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock, Mail } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/components/providers/auth-provider";

/**
 * Clerk-compatible sign-in card.
 *
 * When NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY are configured,
 * replace this card with the Clerk <SignIn /> component. Today it uses the
 * mock auth layer so the flow can be tested without a backend.
 */
export function SignInCard() {
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [email, setEmail] = useState("");
  const { signIn, isClerkConfigured } = useAuth();
  const router = useRouter();

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Enter your email to continue");
      return;
    }
    setLoading(true);
    await signIn();
    setLoading(false);
    toast.success("Signed in. Redirecting to your dashboard");
    router.push("/dashboard");
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    await signIn();
    setGoogleLoading(false);
    toast.success("Signed in with Google (mock)");
    router.push("/dashboard");
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

      {isClerkConfigured && (
        <p className="mt-3 rounded-lg bg-muted/60 p-3 text-xs text-muted-foreground">
          Clerk is configured. The embedded <code className="font-mono">&lt;SignIn /&gt;</code>{" "}
          component will render here.
        </p>
      )}

      <div className="mt-6 flex flex-col gap-3">
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="w-full"
          disabled={googleLoading}
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

        <form onSubmit={handleContinue} className="flex flex-col gap-3">
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
          <Button type="submit" size="lg" disabled={loading} className="w-full">
            {loading ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <Lock className="size-4" aria-hidden="true" />
            )}
            Continue with email
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
