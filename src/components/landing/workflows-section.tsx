"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, ArrowRight, Terminal, Zap, Bot, Braces, Workflow, Boxes } from "lucide-react";

const carouselCards = [
  {
    id: 1,
    category: "OpenAI SDK",
    title: "Point your existing OpenAI client at AtlasFlux",
    icon: ArrowRight,
    mockup: "openai",
  },
  {
    id: 2,
    category: "Vercel AI SDK",
    title: "Ship AI features in your Next.js apps",
    icon: Plus,
    mockup: "vercel",
  },
  {
    id: 3,
    category: "LangChain",
    title: "Build agentic workflows with one model ID",
    icon: ArrowRight,
    mockup: "langchain",
  },
  {
    id: 4,
    category: "LiteLLM proxy",
    title: "Route all your teams through AtlasFlux",
    icon: ArrowRight,
    mockup: "litellm",
  },
  {
    id: 5,
    category: "n8n",
    title: "Automate with Nenas Flash as a node",
    icon: ArrowRight,
    mockup: "n8n",
  },
  {
    id: 6,
    category: "Postman",
    title: "Test and debug requests visually",
    icon: ArrowRight,
    mockup: "postman",
  },
  {
    id: 7,
    category: "cURL",
    title: "One command to your first completion",
    icon: ArrowRight,
    mockup: "curl",
  },
];

function OpenAIMockup() {
  return (
    <div className="flex flex-col gap-3 p-4">
      <div className="flex items-center gap-2 text-xs text-zinc-400">
        <Terminal className="w-3.5 h-3.5" />
        <span>openai.chat.completions</span>
        <span className="text-zinc-600">·</span>
        <span className="text-zinc-500">base_url override</span>
      </div>
      <div className="mt-2 flex items-center gap-2 bg-zinc-800/50 rounded-lg px-3 py-2">
        <span className="text-[10px] font-mono text-amber-300/70">export OPENAI_BASE_URL=</span>
      </div>
      <div className="mt-1 flex items-center gap-2 bg-zinc-800/30 rounded-lg px-3 py-2">
        <span className="text-[10px] font-mono text-emerald-300/70">https://api.atlasflux.my/v1</span>
      </div>
      <div className="mt-1 flex items-center gap-2 px-3 py-2">
        <span className="text-[10px] font-mono text-zinc-500">ATLASFLUX_API_KEY=sk-...</span>
      </div>
    </div>
  );
}

function VercelMockup() {
  return (
    <div className="flex flex-col gap-2 p-4">
      <div className="flex items-center gap-2 text-xs">
        <Zap className="w-3.5 h-3.5 text-zinc-500" />
        <span className="text-zinc-400">useChat({"{"}</span>
        <span className="text-blue-400/70">provider: atlasflux</span>
        <span className="text-zinc-500">{"}"})</span>
      </div>
      <div className="mt-3 space-y-2">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-zinc-600">&gt;</span>
          <span className="text-zinc-500">motion.div</span>
          <span className="text-zinc-600">tokens for</span>
          <span className="text-blue-400/70">useChat</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-zinc-600">&gt;</span>
          <span className="text-zinc-500">streaming</span>
          <span className="text-zinc-600">enabled</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-zinc-600">&gt;</span>
          <span className="text-zinc-500">SSE responses</span>
        </div>
      </div>
    </div>
  );
}

function LangChainMockup() {
  return (
    <div className="flex flex-col gap-2 p-4">
      <div className="flex items-center gap-2 text-xs">
        <Bot className="w-3.5 h-3.5 text-zinc-500" />
        <span className="text-zinc-400">ChatOpenAI(model: </span>
        <span className="text-emerald-400/70">{"\"nenas-flash\""}</span>
        <span className="text-zinc-500">)</span>
      </div>
      <div className="mt-3 space-y-2">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-amber-300/70">agent</span>
          <span className="text-zinc-600">=</span>
          <span className="text-blue-400/70">create_agent</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-zinc-500">tools=[web_search]</span>
        </div>
      </div>
    </div>
  );
}

function LiteLLMMockup() {
  return (
    <div className="flex flex-col gap-2 p-4">
      <div className="flex items-center gap-2 text-xs">
        <Braces className="w-3.5 h-3.5 text-zinc-500" />
        <span className="text-zinc-400">litellm --model </span>
      </div>
      <div className="mt-3 bg-zinc-800/40 rounded-lg px-3 py-2 text-xs font-mono">
        <span className="text-zinc-500">proxy:</span>
        <span className="text-emerald-400/70">atlasflux/nenas-flash</span>
      </div>
      <div className="mt-2 bg-zinc-800/30 rounded-lg px-3 py-2 text-xs text-zinc-500">
        openai-compatible proxy endpoint
      </div>
    </div>
  );
}

function N8nMockup() {
  return (
    <div className="flex flex-col gap-2 p-4">
      <div className="flex items-center gap-2 text-xs">
        <Workflow className="w-3.5 h-3.5 text-zinc-500" />
        <span className="text-zinc-400">Nenas Flash · node</span>
      </div>
      <div className="mt-3 space-y-1.5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-zinc-600" />
            <div className="h-6 bg-zinc-800/50 rounded flex-1" />
          </div>
        ))}
      </div>
    </div>
  );
}

function PostmanMockup() {
  return (
    <div className="flex flex-col gap-2 p-4">
      <div className="flex items-center gap-2 text-xs">
        <Boxes className="w-3.5 h-3.5 text-orange-400/70" />
        <span className="text-zinc-400">POST /v1/responses</span>
        <span className="text-zinc-600">· 200 OK</span>
      </div>
      <div className="mt-3 flex items-center gap-2 text-xs">
        <span className="text-zinc-600">Headers</span>
        <span className="bg-zinc-800/40 rounded px-2 py-1 text-zinc-500">Authorization: Bearer</span>
      </div>
      <div className="mt-1 bg-zinc-800/30 rounded-lg px-3 py-3 text-[10px] font-mono text-zinc-500">
        {"{ \"model\": \"atlasflux/nenas-flash\" }"}
      </div>
    </div>
  );
}

function CurlMockup() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="bg-zinc-800/50 rounded-lg px-4 py-2 border border-zinc-700/50">
        <span className="text-xs font-mono text-zinc-400">curl https://api.atlasflux.my/v1/responses</span>
      </div>
    </div>
  );
}

function CardMockup({ type }: { type: string }) {
  switch (type) {
    case "openai":
      return <OpenAIMockup />;
    case "vercel":
      return <VercelMockup />;
    case "langchain":
      return <LangChainMockup />;
    case "litellm":
      return <LiteLLMMockup />;
    case "n8n":
      return <N8nMockup />;
    case "postman":
      return <PostmanMockup />;
    case "curl":
      return <CurlMockup />;
    default:
      return null;
  }
}

export function WorkflowsSection() {
  const [scrollPosition, setScrollPosition] = useState(0);

  const scrollLeft = () => {
    setScrollPosition(Math.max(0, scrollPosition - 1));
  };

  const scrollRight = () => {
    setScrollPosition(Math.min(carouselCards.length - 4, scrollPosition + 1));
  };

  return (
    <section className="relative py-24" style={{ backgroundColor: "#09090B" }}>
      {/* Top gradient */}
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{
          height: "20%",
          background: "linear-gradient(to bottom, rgba(255,255,255,0.05), transparent)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 mb-16">
          <div className="lg:max-w-xl">
            {/* Orange indicator */}
            <div className="flex items-center gap-2 mb-6">
              <div className="w-2 h-2 rounded-full bg-orange-500" />
              <span className="text-sm text-zinc-400">Workflows and integrations</span>
              <ChevronRight className="w-4 h-4 text-zinc-600" />
            </div>

            {/* Heading */}
            <h2 className="text-4xl md:text-5xl font-medium text-white leading-[1.1]">
              Compatible across
              <br />
              the AI ecosystem
            </h2>
          </div>

          {/* Description */}
          <p className="text-zinc-400 lg:max-w-sm lg:pt-12">
            Work with the OpenAI-compatible SDKs, frameworks and no-code tools your team already knows. The same
            endpoint works everywhere.
          </p>
        </div>

        {/* Carousel */}
        <div className="relative overflow-hidden">
          <div
            className="flex gap-4 transition-transform duration-300 ease-out"
            style={{ transform: `translateX(-${scrollPosition * (100 / 4)}%)` }}
          >
            {carouselCards.map((card) => (
              <div key={card.id} className="flex-shrink-0 w-[calc(25%-12px)] min-w-[280px]">
                <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl overflow-hidden h-[340px] flex flex-col">
                  {/* Mockup area */}
                  <div className="flex-1 relative overflow-hidden">
                    <CardMockup type={card.mockup} />
                    {/* Fade overlay */}
                    <div
                      className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
                      style={{
                        background: "linear-gradient(to top, rgba(9,9,11,0.9), transparent)",
                      }}
                    />
                  </div>

                  {/* Card footer */}
                  <div className="p-4 border-t border-zinc-800/30">
                    <div className="flex items-center justify-between gap-3">
                      {/* Text content */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-zinc-500 mb-1">{card.category}</p>
                        <p className="text-sm text-zinc-200 leading-snug">{card.title}</p>
                      </div>
                      {/* Icon button */}
                      <button className="flex-shrink-0 w-8 h-8 rounded-full border border-zinc-700 flex items-center justify-center text-zinc-500 hover:text-zinc-300 hover:border-zinc-600 transition-colors">
                        <card.icon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation arrows */}
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={scrollLeft}
            className="w-10 h-10 rounded-full border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            disabled={scrollPosition === 0}
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={scrollRight}
            className="w-10 h-10 rounded-full border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            disabled={scrollPosition >= carouselCards.length - 4}
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}