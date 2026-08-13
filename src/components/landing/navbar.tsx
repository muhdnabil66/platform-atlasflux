"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { LandingAuthActions } from "@/components/landing/auth-actions";

const LINKS = [
  { label: "Product", href: "/#product" },
  { label: "Models", href: "/#models" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Documentation", href: "https://api-docs.atlasflux.my" },
  { label: "Help Center", href: "https://support.atlasflux.my" },
  { label: "Status", href: "https://status.atlasflux.my" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  const handleSectionClick = (e: React.MouseEvent, href: string) => {
    const id = href.split("#")[1];
    if (id && window.location.pathname === "/") {
      e.preventDefault();
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      setOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800 bg-[#09090B]/80 backdrop-blur-md">
      <Link
        href="/#pricing"
        onClick={(e) => handleSectionClick(e, "/#pricing")}
        className="block border-b border-green-500/20 bg-gradient-to-r from-green-500/15 via-emerald-500/10 to-green-500/15 px-6 py-2 text-center transition-colors hover:from-green-500/20 hover:via-emerald-500/15 hover:to-green-500/20"
      >
        <span className="text-xs text-green-300 sm:text-sm">
          <span className="font-semibold">Nenas Flash</span> launch offer —{" "}
          <span className="font-bold">75% OFF</span> token pricing{" "}
          <span className="underline underline-offset-2">See pricing</span>
        </span>
      </Link>
      <div className="w-full flex justify-center px-6 py-3.5">
        <div className="w-full max-w-6xl flex items-center justify-between">
          <Link href="/" aria-label="AtlasFlux home" className="flex items-center gap-2.5">
            <Image
              src="/atlas.png"
              alt="AtlasFlux"
              width={28}
              height={28}
              className="size-7 rounded-lg object-cover"
            />
            <span className="text-white font-semibold text-[15px] tracking-tight">AtlasFlux</span>
          </Link>

          <div className="hidden md:flex items-center gap-7">
            {LINKS.map((link) =>
              link.href.startsWith("http") ? (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleSectionClick(e, link.href)}
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              )
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <LandingAuthActions />
            </div>
            <button
              type="button"
              className="inline-flex size-9 items-center justify-center rounded-md text-zinc-400 transition-colors hover:text-white md:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      <div className={`overflow-hidden border-t transition-all duration-200 md:hidden ${open ? "max-h-96" : "max-h-0 border-t-0"}`}>
        <nav className="flex flex-col gap-1 px-6 py-3 bg-[#09090B]">
          {LINKS.map((link) =>
            link.href.startsWith("http") ? (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-white"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  handleSectionClick(e, link.href);
                  setOpen(false);
                }}
                className="rounded-md px-3 py-2 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-white"
              >
                {link.label}
              </Link>
            )
          )}
          <div className="mt-2 flex items-center gap-3 px-3">
            <LandingAuthActions mobile onNavigate={() => setOpen(false)} />
          </div>
        </nav>
      </div>
    </nav>
  );
}