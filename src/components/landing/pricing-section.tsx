"use client";

import { useRef } from "react";
import type React from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
} from "framer-motion";
import { Check, ChevronRight, Sparkles } from "lucide-react";
import { LandingPrimaryCta } from "@/components/landing/auth-actions";

const PRICING_ROWS = [
  {
    label: "Input",
    price: "RM5",
    unit: "per 1M tokens",
    hint: "Prompt and system tokens",
  },
  {
    label: "Output",
    price: "RM25",
    unit: "per 1M tokens",
    hint: "Generated tokens",
  },
  {
    label: "Web search",
    price: "RM0.05",
    unit: "per search",
    hint: "From, depending on depth",
  },
  {
    label: "Reasoning",
    price: "Output rate",
    unit: "per 1M tokens",
    hint: "Reasoning tokens billed at the output rate",
  },
];

const TOP_UPS = [10, 25, 50, 100, 250, 500];

function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [9, -9]), {
    stiffness: 150,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-9, 9]), {
    stiffness: 150,
    damping: 20,
  });

  const glareX = useTransform(x, [-0.5, 0.5], [20, 80]);
  const glareY = useTransform(y, [-0.5, 0.5], [20, 80]);
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.07) 0%, transparent 55%)`;

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div style={{ perspective: 1200 }} onMouseMove={handleMouseMove} onMouseLeave={reset} className={className}>
      <motion.div
        ref={ref}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative overflow-hidden rounded-[24px] border border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 transition-colors h-full"
      >
        {/* Glow accent */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: "-120px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "320px",
            height: "240px",
            background: "radial-gradient(ellipse at center, rgba(99, 102, 241, 0.12) 0%, transparent 70%)",
          }}
        />
        {/* Mouse glare */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-10"
          style={{ background: glare }}
        />
        <div className="relative p-8 h-full flex flex-col" style={{ transform: "translateZ(30px)" }}>
          {children}
        </div>
      </motion.div>
    </div>
  );
}

export function PricingSection() {
  return (
    <section id="pricing" className="relative py-40 px-6" style={{ backgroundColor: "#09090B" }}>
      {/* Gradient overlay at top */}
      <div
        className="absolute inset-x-0 top-0 pointer-events-none"
        style={{
          height: "20%",
          background: "linear-gradient(to bottom, rgba(255,255,255,0.05), transparent 100%)",
        }}
      />

      <div className="max-w-6xl mx-auto">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-2 mb-6"
        >
          <div className="w-2 h-2 rounded-full bg-indigo-500" />
          <span className="text-zinc-400 text-sm">Pricing</span>
          <ChevronRight className="w-4 h-4 text-zinc-500" />
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-medium text-white max-w-3xl mb-8"
          style={{
            letterSpacing: "-0.0325em",
            fontVariationSettings: '"opsz" 28',
            fontWeight: 538,
            lineHeight: 1.1,
          }}
        >
          Simple, prepaid pricing in MYR
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-zinc-400 max-w-md mb-16"
        >
          All usage is deducted from a single prepaid API balance. Top up when you need to, with no monthly
          commitment and no minimum spend.
        </motion.p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* Rate card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="h-full"
          >
            <TiltCard>
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-zinc-300 font-medium text-lg">Rate card</h3>
                <span className="text-xs text-zinc-600 font-mono">atlasflux/nenas-flash</span>
              </div>

              <ul className="divide-y divide-zinc-800/60">
                {PRICING_ROWS.map((row) => (
                  <li key={row.label} className="flex items-center justify-between gap-4 py-4">
                    <div>
                      <p className="text-sm font-medium text-zinc-200">{row.label}</p>
                      <p className="text-xs text-zinc-500 mt-0.5">{row.hint}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-sm font-semibold text-white tabular-nums">{row.price}</p>
                      <p className="text-xs text-zinc-600 mt-0.5">{row.unit}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-6">
                <div className="flex items-start gap-2.5 rounded-lg bg-zinc-800/40 border border-zinc-800/60 p-4 text-sm text-zinc-500">
                  <Check className="mt-0.5 size-4 shrink-0 text-emerald-400" aria-hidden="true" />
                  <p className="text-xs leading-relaxed">
                    Reasoning tokens are billed at the output rate. Search results above 10 and extracted content
                    pages are billed as additional usage.
                  </p>
                </div>
              </div>
            </TiltCard>
          </motion.div>

          {/* Top-up card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="h-full"
          >
            <TiltCard>
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-zinc-300 font-medium text-lg">Top-up options</h3>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 px-3 py-1 text-xs font-medium text-indigo-300">
                  <Sparkles className="size-3" aria-hidden="true" />
                  Popular: RM100
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {TOP_UPS.map((amount) => (
                  <div
                    key={amount}
                    className={`flex flex-col items-center justify-center rounded-xl border px-3 py-5 transition-colors ${
                      amount === 100
                        ? "bg-indigo-500/10 border-indigo-500/40 ring-1 ring-indigo-500/30"
                        : "bg-zinc-800/40 border-zinc-800 hover:border-zinc-700"
                    }`}
                  >
                    <span className="font-mono text-lg font-semibold tabular-nums text-white">RM{amount}</span>
                    <span className={`text-xs mt-1 ${amount === 100 ? "text-indigo-300" : "text-zinc-600"}`}>
                      {amount === 100 ? "Most popular" : "Credit"}
                    </span>
                  </div>
                ))}
              </div>

              <p className="mt-5 text-sm leading-relaxed text-zinc-500">
                Topping up adds prepaid credit to your API balance. There are no plans to buy and no expiring credits.
              </p>

              <div className="mt-auto pt-8">
                <div className="[&>a]:w-full [&>a]:justify-center [&>a]:h-[42px] [&>a]:bg-white [&>a]:text-zinc-900 [&>a]:hover:bg-zinc-100 [&>a]:rounded-xl">
                  <LandingPrimaryCta />
                </div>
              </div>
            </TiltCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}