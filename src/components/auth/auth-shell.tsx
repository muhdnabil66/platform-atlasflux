import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/logo";

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="dark relative flex min-h-dvh items-center justify-center overflow-hidden bg-[#09090B] px-4 py-10 font-sans text-zinc-100 antialiased">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[-10rem] size-96 -translate-x-1/2 rounded-full bg-indigo-600/15 blur-[130px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-12rem] left-1/2 size-96 -translate-x-1/2 rounded-full bg-violet-600/10 blur-[140px]"
      />

      <div className="relative flex w-full max-w-sm flex-col items-center">
        <Link
          href="/"
          aria-label="Back to AtlasFlux home"
          className="mb-8 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-zinc-600"
        >
          <Logo subtext="Developer Platform" />
        </Link>

        <div className="w-full rounded-2xl border border-zinc-800/80 bg-zinc-950/80 p-6 shadow-2xl shadow-black/20 sm:p-8">
          {children}
        </div>

        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-1.5 rounded-md text-sm text-zinc-500 transition-colors hover:text-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-600"
        >
          <ArrowLeft className="size-3.5" aria-hidden="true" />
          Back to home
        </Link>
      </div>
    </div>
  );
}
