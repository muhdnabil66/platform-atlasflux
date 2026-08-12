"use client";

import type React from "react";
import { motion } from "framer-motion";
import {
  Gauge,
  KeyRound,
  Terminal,
  ListFilter,
  Layers,
  CircleDollarSign,
  Settings,
  Search,
  Plus,
  Ellipsis,
  Sparkles,
  Globe,
  Brain,
  Zap,
  Wallet,
  CircleQuestionMark,
  ChevronDown,
} from "lucide-react";
import Image from "next/image";

export function DashboardMockup() {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.5,
      },
    },
  };

  const panelVariants = {
    hidden: {
      opacity: 0,
      x: 100,
      y: -80,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 1.2,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  return (
    <motion.div
      className="w-full h-full bg-zinc-950 flex overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Sidebar */}
      <motion.div className="w-[220px] h-full bg-zinc-900/80 border-r border-zinc-800/50 flex flex-col shrink-0" variants={panelVariants}>
        {/* Logo */}
        <div className="p-3 border-b border-zinc-800/50">
          <div className="flex items-center gap-2 px-2 py-1.5">
            <Image src="/atlas.png" alt="AtlasFlux" width={20} height={20} className="size-5 rounded-md object-cover" />
            <span className="text-white font-semibold text-sm">AtlasFlux</span>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-500 ml-auto" />
          </div>
        </div>

        {/* Search */}
        <div className="p-3">
          <div className="flex items-center gap-2 px-2.5 py-1.5 bg-zinc-800/50 rounded-md text-zinc-500 text-xs">
            <Search className="w-3.5 h-3.5" />
            <span>Search...</span>
            <span className="ml-auto text-[10px] bg-zinc-700/50 px-1.5 py-0.5 rounded border border-zinc-700/50 font-mono">CTRL K</span>
          </div>
        </div>

        {/* Main nav */}
        <div className="px-3 space-y-0.5">
          <NavItem icon={Gauge} label="Overview" active />
          <NavItem icon={KeyRound} label="API Keys" badge={2} />
          <NavItem icon={Terminal} label="Playground" />
          <NavItem icon={ListFilter} label="Requests" />
        </div>

        {/* Usage section */}
        <div className="mt-5 px-3">
          <div className="px-2 py-1 text-[10px] text-zinc-500 font-medium uppercase tracking-wider flex items-center gap-1">
            Usage
          </div>
          <div className="space-y-0.5 mt-1">
            <NavItem icon={Layers} label="Models" hasSubmenu />
            <NavItem icon={Brain} label="Reasoning" hasSubmenu />
            <NavItem icon={Globe} label="Web Search" hasSubmenu />
          </div>
        </div>

        {/* Billing section */}
        <div className="mt-5 px-3 flex-1">
          <div className="px-2 py-1 text-[10px] text-zinc-500 font-medium uppercase tracking-wider flex items-center gap-1">
            Billing
          </div>
          <div className="space-y-0.5 mt-1">
            <NavItem icon={CircleDollarSign} label="Balance" color="text-emerald-400" />
            <NavItem icon={Wallet} label="Transactions" />
          </div>
        </div>

        {/* Bottom */}
        <div className="p-3 border-t border-zinc-800/50 space-y-0.5">
          <NavItem icon={Settings} label="Settings" />
          <NavItem icon={CircleQuestionMark} label="Help & Support" />
        </div>
      </motion.div>

      {/* Requests List */}
      <motion.div className="w-[320px] h-full bg-zinc-900/40 border-r border-zinc-800/50 flex flex-col shrink-0" variants={panelVariants}>
        <div className="px-4 py-3 border-b border-zinc-800/50 flex items-center justify-between">
          <h3 className="text-white font-semibold text-sm">Requests</h3>
          <button className="text-zinc-500 hover:text-white transition-colors">
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-auto scrollbar-hide">
          <RequestItem
            method="POST"
            path="/v1/responses"
            model="atlasflux/nenas-flash"
            cost="RM0.04"
            tokens="2.9K"
            latency="1.8s"
            status="success"
            active
          />
          <RequestItem
            method="POST"
            path="/v1/responses"
            model="atlasflux/nenas-flash"
            cost="RM0.07"
            tokens="5.1K"
            latency="3.4s"
            status="success"
          />
          <RequestItem
            method="GET"
            path="/v1/models"
            model="—"
            cost="RM0.00"
            tokens="—"
            latency="42ms"
            status="success"
          />
          <RequestItem
            method="POST"
            path="/v1/responses"
            model="atlasflux/nenas-flash"
            cost="RM0.05"
            tokens="3.3K"
            latency="2.1s"
            status="search"
          />
          <RequestItem
            method="POST"
            path="/v1/embeddings"
            model="atlasflux/nenas-flash"
            cost="RM0.01"
            tokens="1.2K"
            latency="310ms"
            status="success"
          />
          <RequestItem
            method="POST"
            path="/v1/responses"
            model="atlasflux/nenas-flash"
            cost="RM0.12"
            tokens="8.7K"
            latency="6.2s"
            status="error"
          />
          <RequestItem
            method="POST"
            path="/v1/responses"
            model="atlasflux/nenas-flash"
            cost="RM0.03"
            tokens="2.0K"
            latency="1.1s"
            status="success"
          />
          <RequestItem
            method="GET"
            path="/v1/history"
            model="—"
            cost="RM0.00"
            tokens="—"
            latency="38ms"
            status="success"
          />
        </div>
      </motion.div>

      {/* Detail Panel */}
      <motion.div className="flex-1 h-full bg-zinc-950 flex flex-col overflow-hidden" variants={panelVariants}>
        {/* Header breadcrumb */}
        <div className="px-5 py-3 border-b border-zinc-800/50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-zinc-500">Requests</span>
            <span className="text-zinc-600">/</span>
            <span className="text-zinc-300">req_8f2k3m9x</span>
          </div>
          <Ellipsis className="w-4 h-4 text-zinc-500" />
        </div>

        {/* Content */}
        <div className="flex-1 p-5 overflow-auto scrollbar-hide">
          <div className="flex items-center gap-2 mb-5">
            <span className="text-emerald-400 font-mono text-xs bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded">200 OK · 1.8s</span>
            <span className="text-zinc-500 text-xs font-mono">req_8f2k3m9x</span>
            <Sparkles className="w-3.5 h-3.5 text-zinc-600 ml-auto" />
          </div>

          <h2 className="text-white text-xl font-semibold mb-5 flex items-center gap-2">
            <span className="text-cyan-400">POST</span>
            /v1/responses
          </h2>

          {/* Request block */}
          <div className="bg-zinc-900/80 rounded-lg p-4 text-[11px] font-mono mb-5 border border-zinc-800/50">
            <div className="text-zinc-500 mb-2">Request</div>
            <div className="space-y-2">
              <div>
                <span className="text-zinc-400">{"\"model\": "}</span>
                <span className="text-amber-300">{"\"atlasflux/nenas-flash\""}</span>
                <span className="text-zinc-400">,</span>
              </div>
              <div>
                <span className="text-zinc-400">{"\"input\": "}</span>
                <span className="text-emerald-300">{"\"Explain this architecture\""}</span>
                <span className="text-zinc-400">,</span>
              </div>
              <div>
                <span className="text-zinc-400">{"\"reasoning\": { \"effort\": "}</span>
                <span className="text-orange-300">{"\"medium\""}</span>
                <span className="text-zinc-400">{" },"}</span>
              </div>
              <div>
                <span className="text-zinc-400">{"\"tools\": [{ \"type\": "}</span>
                <span className="text-orange-300">{"\"web_search\""}</span>
                <span className="text-zinc-400">{", \"depth\": "}</span>
                <span className="text-orange-300">{"\"balanced\""}</span>
                <span className="text-zinc-400">{" }]}"}</span>
              </div>
            </div>
          </div>

          {/* Response block */}
          <div className="bg-zinc-900/80 rounded-lg p-4 text-[11px] font-mono mb-5 border border-zinc-800/50">
            <div className="text-zinc-500 mb-2">Response</div>
            <div className="space-y-2">
              <div>
                <span className="text-zinc-400">{"\"status\": "}</span>
                <span className="text-emerald-300">{"\"completed\""}</span>
                <span className="text-zinc-400">,</span>
              </div>
              <div>
                <span className="text-zinc-400">{"\"output_text\": "}</span>
                <span className="text-zinc-300">{"\"This architecture uses a single API gateway...\""}</span>
              </div>
              <div className="mt-2 text-zinc-500">usage:</div>
              <div>
                <span className="text-zinc-400">{"\"input_tokens\": 1842, \"output_tokens\": 512"}</span>
              </div>
              <div>
                <span className="text-zinc-400">{"\"searches\": 3, \"cached_tokens\": 640"}</span>
              </div>
            </div>
          </div>

          {/* Usage stats */}
          <div className="space-y-2 text-sm mb-5">
            <div className="flex items-center gap-2 text-zinc-500 hover:text-zinc-300 cursor-pointer transition-colors">
              <Zap className="w-4 h-4" />
              <span>View latency breakdown</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-500 hover:text-zinc-300 cursor-pointer transition-colors">
              <Globe className="w-4 h-4" />
              <span>Search sources used</span>
            </div>
          </div>

          {/* Cost */}
          <div className="pt-4 border-t border-zinc-800/50">
            <div className="text-xs text-zinc-500 font-medium mb-3 uppercase tracking-wider">Cost</div>
            <div className="flex items-center justify-between rounded-lg bg-zinc-900/60 border border-zinc-800/50 px-4 py-3">
              <span className="text-zinc-400 text-sm">
                Total tokens <span className="text-white">2,994</span>
              </span>
              <span className="text-white text-sm font-mono font-medium">RM0.04</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function NavItem({
  icon: Icon,
  label,
  badge,
  active,
  hasSubmenu,
  color,
}: {
  icon: React.ElementType;
  label: string;
  badge?: number;
  active?: boolean;
  hasSubmenu?: boolean;
  color?: string;
}) {
  return (
    <div
      className={`flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors ${
        active ? "bg-zinc-800 text-white" : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-300"
      }`}
    >
      <Icon className={`w-4 h-4 ${color || ""}`} />
      <span className="flex-1 text-xs">{label}</span>
      {badge && (
        <span className="bg-indigo-500/80 text-white text-[10px] min-w-[18px] h-[18px] flex items-center justify-center rounded-full font-medium px-1">
          {badge}
        </span>
      )}
      {hasSubmenu && <ChevronDown className="w-3 h-3 text-zinc-600" />}
    </div>
  );
}

function RequestItem({
  method,
  path,
  model,
  cost,
  tokens,
  latency,
  status,
  active,
}: {
  method: string;
  path: string;
  model: string;
  cost: string;
  tokens: string;
  latency: string;
  status: "success" | "error" | "search";
  active?: boolean;
}) {
  const statusColors: Record<string, string> = {
    success: "bg-emerald-500",
    error: "bg-red-500",
    search: "bg-blue-500",
  };

  return (
    <div
      className={`px-4 py-3 border-b border-zinc-800/30 cursor-pointer transition-colors ${
        active ? "bg-zinc-800/50" : "hover:bg-zinc-800/30"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${method === "GET" ? "text-blue-400 bg-blue-400/10" : "text-amber-400 bg-amber-400/10"}`}>
              {method}
            </span>
            <div className={`w-2 h-2 rounded-full ${statusColors[status] || "bg-zinc-500"}`} />
          </div>
          <p className="text-white text-xs truncate font-mono leading-tight">{path}</p>
          <p className="text-zinc-500 text-[10px] mt-0.5 truncate">{model}</p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-zinc-300 text-[10px] font-mono">{cost}</p>
          <p className="text-zinc-600 text-[10px] mt-0.5">
            {tokens} · {latency}
          </p>
        </div>
      </div>
    </div>
  );
}
