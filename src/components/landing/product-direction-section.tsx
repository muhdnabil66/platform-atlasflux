"use client";

import { motion } from "framer-motion";
import { ChevronRight, Zap, Braces, CheckCheck, LayoutGrid, CircleDollarSign, ShieldCheck } from "lucide-react";

export function ProductDirectionSection() {
  return (
    <section className="relative py-40 px-6 md:px-12 lg:px-24" style={{ backgroundColor: "#09090B" }}>
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
        <div className="flex items-center gap-2 mb-6">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-zinc-400 text-sm">Usage and billing</span>
          <ChevronRight className="w-4 h-4 text-zinc-500" />
        </div>

        {/* Section heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-medium text-white mb-8 max-w-3xl"
          style={{
            letterSpacing: "-0.0325em",
            fontVariationSettings: '"opsz" 28',
            fontWeight: 538,
            lineHeight: 1.1,
          }}
        >
          Scale usage with transparent pricing
        </motion.h2>

        {/* Description */}
        <p className="text-zinc-400 text-lg max-w-md mb-16">
          <span className="text-white font-medium">One prepaid balance, no monthly commitment.</span> Billed per
          token and per search with request-level visibility into every cost.
        </p>

        {/* 3D Timeline Visualization */}
        <div className="relative w-full mb-16" style={{ perspective: "1200px" }}>
          <div
            className="relative"
            style={{
              transform: "rotateX(50deg) rotateZ(-35deg)",
              transformStyle: "preserve-3d",
              transformOrigin: "center center",
            }}
          >
            {/* Timeline ruler with tick marks */}
            <div className="relative h-[400px]">
              {/* Diagonal dashed line */}
              <div
                className="absolute w-[1px]"
                style={{
                  height: "600px",
                  left: "55%",
                  top: "-100px",
                  transform: "rotate(0deg)",
                  backgroundImage:
                    "repeating-linear-gradient(to bottom, transparent, transparent 4px, rgba(113, 113, 122, 0.5) 4px, rgba(113, 113, 122, 0.5) 8px)",
                }}
              />

              {/* Timeline header with dates and tick marks */}
              <div className="absolute top-0 left-0 right-0 flex items-end">
                {/* Tick marks row */}
                <div className="flex items-end gap-[3px] absolute bottom-0 left-[5%] right-0">
                  {Array.from({ length: 60 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-zinc-600/60"
                      style={{
                        width: "1px",
                        height: i % 7 === 0 ? "16px" : "8px",
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Date labels */}
              <div className="absolute text-zinc-500 text-sm" style={{ left: "8%", top: "80px" }}>
                RM
              </div>
              <div className="absolute text-zinc-500 text-sm" style={{ left: "18%", top: "55px" }}>
                SEARCH
              </div>
              <div className="absolute text-zinc-500 text-sm" style={{ left: "32%", top: "35px" }}>
                TOKENS
              </div>
              <div className="absolute text-zinc-500 text-sm" style={{ left: "48%", top: "15px" }}>
                REASON
              </div>
              <div className="absolute px-3 py-1 rounded-md bg-zinc-700/80 text-zinc-300 text-sm font-medium" style={{ left: "58%", top: "-10px" }}>
                INPUT RM1.50
              </div>
              <div className="absolute text-zinc-500 text-sm" style={{ left: "74%", top: "-5px" }}>
                OUTPUT
              </div>
              <div className="absolute text-zinc-500/50 text-sm" style={{ left: "88%", top: "-25px" }}>
                PER 1M
              </div>

              {/* Pricing bars */}
              <div
                className="absolute rounded-lg bg-zinc-800/90 border border-zinc-700/50 px-4 py-3 flex items-center gap-3"
                style={{ left: "5%", top: "100px", width: "45%", height: "48px" }}
              >
                <Zap className="w-4 h-4 text-zinc-500" />
                <span className="text-zinc-300 text-sm font-medium">Input tokens</span>
                <div className="absolute w-5 h-5 rotate-45 border-2 border-green-500 bg-transparent" style={{ right: "15%", top: "50%", transform: "translateY(-50%) rotate(45deg)" }} />
              </div>

              {/* Output bar */}
              <div
                className="absolute rounded-lg bg-zinc-800/70 border border-zinc-700/40 px-4 py-3 flex items-center gap-3"
                style={{ left: "15%", top: "155px", width: "25%", height: "44px" }}
              >
                <Braces className="w-3 h-3 text-zinc-600" />
                <span className="text-zinc-500 text-sm">RM4.50 / 1M</span>
              </div>

              {/* Web search bar */}
              <div
                className="absolute rounded-lg bg-zinc-800/90 border border-zinc-700/50 px-4 py-3 flex items-center justify-between"
                style={{ left: "45%", top: "155px", width: "45%", height: "48px" }}
              >
                <span className="text-zinc-400 text-sm">Web search</span>
                <div className="flex gap-0.5">
                  <div className="w-2.5 h-2.5 rotate-45 bg-zinc-500/60" />
                  <div className="w-2.5 h-2.5 rotate-45 bg-zinc-500/60" />
                  <div className="w-2.5 h-2.5 rotate-45 bg-zinc-500/60" />
                </div>
              </div>

              {/* Reasoning bar */}
              <div
                className="absolute rounded-lg bg-zinc-800/70 border border-zinc-700/40 px-4 py-3 flex items-center justify-between"
                style={{ left: "35%", top: "240px", width: "28%", height: "48px" }}
              >
                <span className="text-zinc-400 text-sm">Reasoning</span>
                <div className="flex gap-0.5">
                  <div className="w-2.5 h-2.5 rotate-45 bg-zinc-500/60" />
                  <div className="w-2.5 h-2.5 rotate-45 bg-zinc-500/60" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom two-column section */}
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left column - Request-level visibility */}
          <div className="border-t border-r border-b border-zinc-800 pt-10 pr-10 pb-16">
            <h3 className="text-xl font-medium text-zinc-200 mb-3">Request-level visibility</h3>
            <p className="text-zinc-500 text-base leading-relaxed mb-8">
              See every token, search, cost and latency figure down to the individual request.
            </p>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
              <h4 className="text-lg font-medium text-zinc-200 mb-5">Usage breakdown</h4>

              {/* Properties row */}
              <div className="flex items-center gap-4 mb-4">
                <span className="text-zinc-500 text-sm w-20">Balance</span>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1.5 px-2 py-1 rounded bg-zinc-800 text-zinc-300 text-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    RM124.80
                  </span>
                  <span className="flex items-center gap-1.5 px-2 py-1 rounded bg-zinc-800 text-zinc-300 text-xs">
                    <CircleDollarSign className="w-3 h-3 text-emerald-400" />
                    Only prepaid
                  </span>
                  <div className="flex -space-x-1.5">
                    <div className="w-5 h-5 rounded-full bg-zinc-600 border border-zinc-900" />
                    <div className="w-5 h-5 rounded-full bg-zinc-500 border border-zinc-900" />
                    <div className="w-5 h-5 rounded-full bg-zinc-700 border border-zinc-900" />
                  </div>
                </div>
              </div>

              {/* Tokens row */}
              <div className="flex items-center gap-4 mb-4">
                <span className="text-zinc-500 text-sm w-20">Tokens</span>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1.5 px-2 py-1 rounded bg-zinc-800 text-zinc-300 text-xs">
                    <span className="text-purple-400">1.2M</span>
                    Input
                  </span>
                  <span className="flex items-center gap-1.5 px-2 py-1 rounded bg-zinc-800 text-zinc-400 text-xs">
                    <span className="text-yellow-500">340K</span>
                    Output
                  </span>
                  <span className="flex items-center gap-1.5 px-2 py-1 rounded bg-zinc-800 text-zinc-400 text-xs">
                    <span className="text-blue-400">612</span>
                    Searches
                  </span>
                </div>
              </div>

              {/* Milestones row */}
              <div className="flex items-start gap-4">
                <span className="text-zinc-500 text-sm w-20 pt-1">Metrics</span>
                <div className="flex flex-col gap-2">
                  <span className="flex items-center gap-2 text-zinc-300 text-sm">
                    <span className="w-2.5 h-2.5 rotate-45 bg-purple-500" />
                    Avg latency <span className="text-zinc-500">2.1s</span>
                  </span>
                  <span className="flex items-center gap-2 text-zinc-300 text-sm">
                    <span className="w-2.5 h-2.5 rotate-45 bg-purple-500" />
                    Success rate <span className="text-zinc-500">99.2%</span>
                  </span>
                  <span className="flex items-center gap-2 text-zinc-400 text-sm">
                    <span className="w-2.5 h-2.5 rotate-45 border border-zinc-500 bg-transparent" />
                    Spend this month <span className="text-zinc-500">RM75.20</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right column - Spend controls */}
          <div className="border-t border-b border-zinc-800 pt-10 pl-10 pb-16">
            <h3 className="text-xl font-medium text-zinc-200 mb-3">Spend controls</h3>
            <p className="text-zinc-500 text-base leading-relaxed mb-8">
              Top up when you need to, and set per-key limits so nothing surprises you.
            </p>

            <div className="relative h-48">
              {/* Auto reload card (back) */}
              <div className="absolute rounded-lg bg-zinc-800/40 border border-zinc-700/30 px-4 py-2" style={{ top: 0, left: "10%", width: "80%" }}>
                <span className="flex items-center gap-2 text-zinc-500 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
                  Auto reload at RM10
                </span>
              </div>

              {/* Spend limit card (middle) */}
              <div className="absolute rounded-lg bg-zinc-800/60 border border-zinc-700/40 px-4 py-2" style={{ top: "30px", left: "5%", width: "85%" }}>
                <span className="flex items-center gap-2 text-zinc-400 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                  Spend limit: RM25 / day per key
                </span>
              </div>

              {/* Top up card (front) */}
              <div className="absolute rounded-xl bg-zinc-800/90 border border-zinc-700/50 px-5 py-4" style={{ top: "60px", left: 0, width: "95%" }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                    <CheckCheck className="w-3 h-3 text-green-500" />
                  </span>
                  <span className="text-green-500 font-medium text-sm">Top-up successful</span>
                  <span className="ml-auto text-zinc-500 text-xs">RM100 added</span>
                </div>
                <p className="text-zinc-300 text-sm mb-3">Available balance: RM124.80 · no expiring credits</p>
                <div className="flex items-center gap-2">
                  {[10, 25, 50, 100].map((amount) => (
                    <span
                      key={amount}
                      className={`px-2.5 py-1 rounded-md text-xs font-mono ${
                        amount === 100 ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30" : "bg-zinc-700/40 text-zinc-400 border border-zinc-700/40"
                      }`}
                    >
                      RM{amount}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 border-b border-zinc-800">
          {/* Left column - Feature list */}
          <div className="border-r border-zinc-800 pt-16 pr-10 pb-16 flex flex-col justify-center">
            <h3 className="text-2xl font-medium text-zinc-200 mb-8 leading-tight">
              Everything the model
              <br />
              should handle, built in
            </h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-1 h-5 rounded-full bg-green-500" />
                <span className="text-zinc-200 font-medium">Streaming responses</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-1 h-5 rounded-full bg-green-500/50" />
                <span className="text-zinc-400">Tool calling</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-1 h-5 rounded-full bg-green-500/30" />
                <span className="text-zinc-500">Structured output</span>
              </div>
            </div>
          </div>

          {/* Right column - Document mockup */}
          <div className="pt-10 pl-10 pb-16">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
              {/* Header */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800 text-zinc-400 text-sm">
                <LayoutGrid className="w-4 h-4" />
                <span>Playground</span>
                <span className="text-zinc-600">/</span>
                <span>Streaming preview</span>
                <span className="ml-auto text-zinc-600 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Live
                </span>
              </div>

              {/* Content */}
              <div className="p-5">
                {/* Icon */}
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center mb-4">
                  <ShieldCheck className="w-5 h-5 text-green-500" />
                </div>

                {/* Title */}
                <div className="mb-3">
                  <span className="text-zinc-200 text-lg font-medium">Streaming with the same </span>
                  <span className="text-zinc-200 text-lg font-medium bg-green-500/20 px-0.5">cost accounting</span>
                  <span className="text-zinc-200 text-lg font-medium"> as batch calls.</span>
                </div>

                {/* Description */}
                <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                  Token-by-token responses that feel instant —{" "}
                  <span className="bg-purple-500/20 px-0.5">without hidden</span> per-minute charges.
                </p>

                {/* Placeholder text lines */}
                <div className="flex flex-col gap-2 mt-8">
                  <div className="flex gap-2 flex-wrap">
                    <div className="h-2 bg-zinc-700/50 rounded w-16" />
                    <div className="h-2 bg-zinc-700/30 rounded w-24" />
                    <div className="h-2 bg-zinc-700/50 rounded w-12" />
                    <div className="h-2 bg-indigo-500/40 rounded w-20" />
                    <div className="h-2 bg-zinc-700/30 rounded w-16" />
                    <div className="h-2 bg-zinc-700/50 rounded w-28" />
                    <div className="h-2 bg-indigo-500/40 rounded w-8" />
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <div className="h-2 bg-zinc-700/30 rounded w-20" />
                    <div className="h-2 bg-zinc-700/50 rounded w-8" />
                    <div className="h-2 bg-zinc-700/30 rounded w-28" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-16">
          {/* Streaming */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-5 h-5 text-zinc-400" />
              <span className="text-zinc-200 font-medium">Streaming</span>
            </div>
            <p className="text-zinc-500 text-sm leading-relaxed">Token-by-token responses for chat experiences.</p>
          </div>

          {/* Multimodal */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Braces className="w-5 h-5 text-zinc-400" />
              <span className="text-zinc-200 font-medium">Multimodal input</span>
            </div>
            <p className="text-zinc-500 text-sm leading-relaxed">Text, images, audio and documents in one endpoint.</p>
          </div>

          {/* Tool calling */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-4 h-4 rotate-45 bg-zinc-400" />
              <span className="text-zinc-200 font-medium">Tool calling</span>
            </div>
            <p className="text-zinc-500 text-sm leading-relaxed">Function and tool use built into the API.</p>
          </div>

          {/* Context */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <LayoutGrid className="w-5 h-5 text-zinc-400" />
              <span className="text-zinc-200 font-medium">1M context window</span>
            </div>
            <p className="text-zinc-500 text-sm leading-relaxed">Effective context with intelligent routing.</p>
          </div>
        </div>
      </div>
    </section>
  );
}