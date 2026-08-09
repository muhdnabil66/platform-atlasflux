"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";

interface AuthActionsProps {
  mobile?: boolean;
  onNavigate?: () => void;
}

export function LandingAuthActions({ mobile = false, onNavigate }: AuthActionsProps) {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return <div className={mobile ? "h-9 flex-1" : "h-9 w-28"} aria-hidden="true" />;
  }

  if (isSignedIn) {
    return (
      <Button asChild size="sm" className={mobile ? "flex-1" : undefined}>
        <Link href="/dashboard/overview" onClick={onNavigate}>
          Dashboard
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </Link>
      </Button>
    );
  }

  return (
    <>
      <Button asChild variant="ghost" size="sm" className={mobile ? "flex-1" : "hidden sm:inline-flex"}>
        <Link href="/sign-in" onClick={onNavigate}>Sign in</Link>
      </Button>
      <Button asChild size="sm" className={mobile ? "flex-1" : undefined}>
        <Link href="/sign-in" onClick={onNavigate}>Get API key</Link>
      </Button>
    </>
  );
}

export function LandingPrimaryCta() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return (
      <Button size="lg" disabled>
        Get API key
        <ArrowRight className="size-4" aria-hidden="true" />
      </Button>
    );
  }

  const label = isSignedIn ? "Dashboard" : "Get API key";

  return (
    <Button asChild size="lg">
      <Link href={isSignedIn ? "/dashboard/overview" : "/sign-in"}>
        {label}
        <ArrowRight className="size-4" aria-hidden="true" />
      </Link>
    </Button>
  );
}
