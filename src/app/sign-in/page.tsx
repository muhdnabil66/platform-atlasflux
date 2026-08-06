import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Check, ShieldCheck, Wallet, Zap } from "lucide-react";
import { Logo } from "@/components/logo";
import { SignInCard } from "@/components/sign-in/sign-in-card";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your AtlasFlux developer account.",
};

const BENEFITS = [
  {
    icon: Zap,
    title: "One API key",
    body: "A single key unlocks reasoning, web search and multimodal input.",
  },
  {
    icon: Wallet,
    title: "Prepaid balance in MYR",
    body: "Top up when you need to, with no plans or monthly commitment.",
  },
  {
    icon: ShieldCheck,
    title: "Spend controls",
    body: "Per-key limits, usage analytics and request logs keep you in control.",
  },
];

export default function SignInPage() {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="hidden flex-col justify-between border-r p-10 lg:flex">
        <Link href="/" aria-label="Back to AtlasFlux home" className="w-fit rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <Logo subtext="Developer Platform" />
        </Link>

        <div className="max-w-md">
          <h1 className="text-3xl font-semibold tracking-tight">
            Build with AtlasFlux
          </h1>
          <p className="mt-3 text-muted-foreground">
            Ship against a single OpenAI-compatible API with intelligent model
            routing, adjustable reasoning and built-in web search.
          </p>
          <ul className="mt-8 flex flex-col gap-5">
            {BENEFITS.map((benefit) => (
              <li key={benefit.title} className="flex gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <benefit.icon className="size-4 text-muted-foreground" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-medium">{benefit.title}</p>
                  <p className="text-sm text-muted-foreground">{benefit.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-muted-foreground">
          platform.atlasflux.my · api.atlasflux.my
        </p>
      </div>

      <div className="flex min-h-dvh flex-col items-center justify-center px-4 py-10">
        <div className="mb-8 lg:hidden">
          <Link href="/" aria-label="Back to AtlasFlux home" className="block w-fit rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <Logo subtext="Developer Platform" />
          </Link>
        </div>

        <div className="w-full max-w-sm">
          <SignInCard />

          <div className="mt-6 flex items-center justify-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-md text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ArrowLeft className="size-3.5" aria-hidden="true" />
              Back to home
            </Link>
          </div>
        </div>

        <p className="mt-8 flex items-center gap-1.5 text-xs text-muted-foreground lg:hidden">
          <Check className="size-3.5 text-success" aria-hidden="true" />
          Authentication shared with AtlasFlux AI
        </p>
      </div>
    </div>
  );
}
