"use client";

import { motion } from "framer-motion";
import {
  ChevronRight,
  Check,
  Paperclip,
  Globe,
  Lightbulb,
  Brain,
  Route,
  Zap,
} from "lucide-react";

const modelOptions = [
  {
    name: "atlasflux/nenas-flash",
    isFleet: true,
    selected: true,
    tag: "Primary",
  },
  { name: "GPT-5.6 Sol", isFleet: false, selected: false, tag: "Upstream" },
  { name: "Claude 4.8 Opus", isFleet: false, selected: false, tag: "Upstream" },
  { name: "Gemini 3.1 Pro", isFleet: false, selected: false, tag: "Upstream" },
  { name: "DeepSeek V4 Pro", isFleet: false, selected: false, tag: "Upstream" },
  { name: "Grok 4.5", isFleet: false, selected: false, tag: "Upstream" },
];

export function AISection() {
  return (
    <div className="relative z-20 py-40" style={{ backgroundColor: "#09090B" }}>
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{
          height: "20%",
          background:
            "linear-gradient(to bottom, rgba(255,255,255,0.05) 0%, transparent 100%)",
        }}
      />
      <div className="w-full flex justify-center px-6">
        <div className="w-full max-w-5xl">
          {/* Section label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2 mb-6"
          >
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-zinc-400 text-sm">
              Artificial intelligence
            </span>
            <ChevronRight className="w-4 h-4 text-zinc-500" />
          </motion.div>

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] text-white max-w-3xl mb-8"
            style={{
              letterSpacing: "-0.0325em",
              fontVariationSettings: '"opsz" 28',
              fontWeight: 538,
              lineHeight: 1.1,
            }}
          >
            One model ID for everything
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-zinc-400 max-w-md mb-8"
          >
            <span className="text-white font-medium">
              AtlasFlux Nenas Flash.
            </span>{" "}
            Requests are routed to the best upstream model for the task, so the
            public model ID never changes.
          </motion.p>

          {/* Learn more button */}
          <motion.a
            href="/models"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="inline-flex px-5 py-2.5 bg-zinc-800 text-zinc-300 rounded-lg border border-zinc-700 hover:bg-zinc-700 transition-colors text-sm items-center gap-2 mb-16"
          >
            Learn more
            <ChevronRight className="w-4 h-4" />
          </motion.a>

          {/* Model dropdown mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex justify-center mb-24"
          >
            <div
              style={{
                perspective: "900px",
                userSelect: "none",
                WebkitUserSelect: "none",
                width: "100%",
                maxWidth: "720px",
                position: "relative",
              }}
            >
              <div
                style={{
                  transformOrigin: "top",
                  willChange: "transform",
                  transform: "translateY(0%) rotateX(30deg) scale(1.15)",
                  position: "relative",
                }}
              >
                {/* Glass overlay effect */}
                <div
                  style={{
                    border: "1px solid rgba(66, 66, 66, 0.5)",
                    background:
                      "linear-gradient(rgba(255, 255, 255, 0.1) 40%, rgba(8, 9, 10, 0.1) 100%)",
                    borderRadius: "8px",
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    boxShadow:
                      "inset 0 1.503px 5.261px rgba(255, 255, 255, 0.04), inset 0 -0.752px 0.752px rgba(255, 255, 255, 0.1)",
                    pointerEvents: "none",
                    zIndex: 10,
                  }}
                />

                <div
                  style={{
                    background:
                      "linear-gradient(180deg, transparent 0%, #09090B 100%)",
                    height: "80%",
                    position: "absolute",
                    bottom: "-2px",
                    left: "-180px",
                    right: "-180px",
                    pointerEvents: "none",
                    zIndex: 11,
                  }}
                />

                {/* Input field */}
                <div className="bg-zinc-800/50 border border-zinc-700 rounded-t-xl px-5 py-4">
                  <span className="text-zinc-500 italic">Model...</span>
                </div>

                {/* Dropdown options */}
                <div className="bg-zinc-900/80 border border-t-0 border-zinc-700 rounded-b-xl py-1">
                  {modelOptions.map((option, index) => (
                    <div
                      key={option.name}
                      style={
                        option.selected
                          ? {
                              transform: "scale(1.04) rotateX(17deg)",
                              background:
                                "linear-gradient(#343434 0%, #2d2d2d 100%)",
                              borderRadius: "6px",
                              height: "48px",
                              position: "relative",
                              boxShadow:
                                "inset 0 -2.75px 4.75px rgba(255, 255, 255, 0.14), inset 0 -0.752px 0.752px rgba(255, 255, 255, 0.1), 0 54px 73px 3px rgba(0, 0, 0, 0.5)",
                              zIndex: 20,
                              marginLeft: "-12px",
                              marginRight: "-12px",
                            }
                          : {
                              opacity: 1 - index * 0.15,
                              height: "42px",
                            }
                      }
                    >
                      <div
                        className="flex items-center justify-between h-full"
                        style={{
                          paddingLeft: "24px",
                          paddingRight: "24px",
                          gap: "12px",
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <Brain className="w-4 h-4 text-zinc-400" />
                          <span
                            className={
                              option.selected
                                ? "text-white font-medium font-mono text-sm"
                                : "text-zinc-300 font-mono text-sm"
                            }
                          >
                            {option.name}
                          </span>
                          {option.isFleet && (
                            <span className="text-xs bg-zinc-700 text-zinc-400 px-2 py-0.5 rounded">
                              Stable ID
                            </span>
                          )}
                          {option.tag && !option.isFleet && (
                            <span className="text-xs bg-zinc-800 text-zinc-500 px-2 py-0.5 rounded">
                              {option.tag}
                            </span>
                          )}
                        </div>
                        {option.selected && (
                          <Check className="w-4 h-4 text-zinc-400" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Bottom divider with two columns */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-16"
          >
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Left column */}
              <div className="border-t border-r border-b border-zinc-800/60 pt-12 pr-12 pb-16">
                <h3 className="text-zinc-200 font-medium text-xl mb-3">
                  Self-optimising routing
                </h3>
                <p className="text-zinc-500 text-base mb-8">
                  Each request is routed to the best upstream model for the
                  task, adapting to availability and quality underneath a stable
                  model ID.
                </p>

                {/* Routing Intelligence Card */}
                <div className="bg-zinc-900/30 border border-zinc-800/60 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-5">
                    <Route className="w-4 h-4 text-zinc-500" />
                    <span className="text-zinc-500 text-sm">
                      Routing{" "}
                      <span className="text-zinc-300">Intelligence</span>
                    </span>
                  </div>

                  {/* Suggestions Row */}
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-zinc-600 text-sm w-24">
                      Rationale
                    </span>
                    <div className="flex items-center gap-2">
                      <span
                        className="flex items-center gap-1.5 rounded-md px-2 py-1 text-sm"
                        style={{ background: "#7170ff" }}
                      >
                        <Brain className="w-4 h-4 text-white/80" />
                        <span className="text-white">Reasoning task</span>
                      </span>
                      <span className="flex items-center gap-1.5 bg-zinc-800/30 rounded-md px-2 py-1 text-sm text-zinc-600">
                        <Zap className="w-3 h-3" />
                        Fast path
                      </span>
                    </div>
                  </div>

                  {/* Route Row */}
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-zinc-600 text-sm w-24">Route</span>
                    <span className="text-sm text-zinc-500 font-mono">
                      atlasflux/nenas-flash
                    </span>
                    <span className="text-zinc-600 text-sm">→</span>
                    <span className="text-sm text-zinc-400 font-mono">
                      upstream-01
                    </span>
                  </div>

                  {/* Expanded Suggestion Card */}
                  <div className="bg-zinc-800/40 rounded-lg p-4 ml-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Route className="w-4 h-4 text-zinc-500" />
                      <span className="text-zinc-300 text-sm font-medium">
                        Why this route was chosen
                      </span>
                    </div>

                    <p className="text-zinc-500 text-xs mb-2">
                      Decision factors
                    </p>
                    <p className="text-zinc-500 text-sm mb-4">
                      Reasoning effort is medium, input is multimodal and web
                      search is requested. These match the current
                      best-performing upstream model for this profile.
                    </p>

                    <p className="text-zinc-500 text-xs mb-2">Alternatives</p>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="flex items-center gap-1.5 bg-zinc-700/50 rounded-md px-2 py-1 text-sm">
                        <Brain className="w-3.5 h-3.5 text-zinc-500" />
                        <span className="text-zinc-400">upstream-02</span>
                      </span>
                      <span className="flex items-center gap-1.5 bg-zinc-700/50 rounded-md px-2 py-1 text-sm">
                        <Zap className="w-3.5 h-3.5 text-zinc-500" />
                        <span className="text-zinc-400">upstream-03</span>
                      </span>
                    </div>

                    <button className="w-full flex items-center justify-center gap-2 bg-zinc-700/50 hover:bg-zinc-600/50 text-zinc-300 text-sm py-2.5 rounded-md transition-colors">
                      <Check className="w-4 h-4" />
                      Pin this route
                    </button>
                  </div>
                </div>
              </div>

              {/* Right column */}
              <div className="border-t border-b border-zinc-800/60 pt-12 pl-12 pb-16">
                <h3 className="text-zinc-200 font-medium text-xl mb-3">
                  OpenAI-compatible API
                </h3>
                <p className="text-zinc-500 text-base mb-8">
                  Send requests with the OpenAI SDKs you already use — point the
                  base URL at AtlasFlux and go.
                </p>

                {/* Code Snippet */}
                <div className="bg-zinc-900/30 border border-zinc-800/60 rounded-xl p-5 font-mono text-sm">
                  <p className="text-zinc-700 mb-3">
                    {"//api.atlasflux.my/v1"}
                  </p>
                  <div className="space-y-1 mb-6">
                    <p>
                      <span className="text-orange-400/70">const</span>
                      <span className="text-zinc-400"> client = </span>
                      <span className="text-blue-400/70">new</span>
                      <span className="text-zinc-400"> OpenAI({"{"}</span>
                    </p>
                    <p className="pl-4">
                      <span className="text-orange-400/70">baseURL</span>
                      <span className="text-zinc-500">: </span>
                      <span className="text-green-400/70">
                        {'"https://api.atlasflux.my/v1"'}
                      </span>
                      <span className="text-zinc-400">,</span>
                    </p>
                    <p className="pl-4">
                      <span className="text-orange-400/70">apiKey</span>
                      <span className="text-zinc-500">: process.env.</span>
                      <span className="text-amber-300/70">
                        ATLASFLUX_API_KEY
                      </span>
                      <span className="text-zinc-400">,</span>
                    </p>
                    <p className="text-zinc-500">{"}"})</p>
                  </div>

                  {/* Ask Anything Input */}
                  <div className="bg-zinc-800/40 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="w-0.5 h-5 bg-zinc-600" />
                      <span className="text-zinc-600">
                        Ask Nenas Flash anything
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button className="flex items-center gap-1.5 border border-zinc-700/60 text-zinc-500 text-sm px-3 py-1.5 rounded-full hover:bg-zinc-700/30 transition-colors">
                        <Paperclip className="w-3.5 h-3.5" />
                        Multimodal
                      </button>
                      <button className="flex items-center gap-1.5 border border-zinc-700/60 text-zinc-500 text-sm px-3 py-1.5 rounded-full hover:bg-zinc-700/30 transition-colors">
                        <Globe className="w-3.5 h-3.5" />
                        Web search
                      </button>
                      <button className="flex items-center gap-1.5 border border-zinc-700/60 text-zinc-500 text-sm px-3 py-1.5 rounded-full hover:bg-zinc-700/30 transition-colors">
                        <Lightbulb className="w-3.5 h-3.5" />
                        Reasoning
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
