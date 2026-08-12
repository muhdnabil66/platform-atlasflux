import Link from "next/link";
import { BookOpen } from "lucide-react";
import { LandingPrimaryCta } from "@/components/landing/auth-actions";

export function CTASection() {
  return (
    <section className="py-24 px-6" style={{ backgroundColor: "#09090B" }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <h2 className="text-3xl md:text-4xl lg:text-[42px] font-medium text-white tracking-tight">
            Start building with AtlasFlux today
          </h2>
          <div className="flex items-center gap-3">
            <Link
              href="https://api-docs.atlasflux.my"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 border border-zinc-700 text-white font-medium rounded-lg hover:bg-zinc-800 transition-colors text-sm flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              Read the docs
            </Link>
            <div className="rounded-lg overflow-hidden [&>a]:h-[42px] [&>a]:px-5 [&>a]:text-sm [&>a]:bg-white [&>a]:text-zinc-900 [&>a]:hover:bg-zinc-100 [&>a]:rounded-lg">
              <LandingPrimaryCta />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}