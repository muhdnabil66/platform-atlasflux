"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AuthActionsProps {
  mobile?: boolean;
  onNavigate?: () => void;
}

const PRIMARY_PILL =
  "inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-white px-4 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100";

const NAV_PILL =
  "inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800 px-4 text-sm font-medium text-white transition-colors hover:bg-zinc-700";

const TEXT_LINK =
  "inline-flex h-9 items-center justify-center text-sm font-medium text-zinc-400 transition-colors hover:text-white";

export function LandingAuthActions({ mobile = false, onNavigate }: AuthActionsProps) {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return <div className={mobile ? "h-9 flex-1" : "h-9 w-28"} aria-hidden="true" />;
  }

  if (isSignedIn) {
    return (
      <Link href="/dashboard/overview" onClick={onNavigate} className={cn(NAV_PILL, mobile && "flex-1")}>
        Dashboard
        <ArrowRight className="size-3.5" aria-hidden="true" />
      </Link>
    );
  }

  return (
    <>
      <Link href="/sign-in" onClick={onNavigate} className={cn(TEXT_LINK, mobile && "flex-1 px-3")}>
        Sign in
      </Link>
      <Link href="/sign-in" onClick={onNavigate} className={cn(PRIMARY_PILL, mobile && "flex-1")}>
        Get API key
      </Link>
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