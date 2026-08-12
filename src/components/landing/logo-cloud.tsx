"use client";

import { motion } from "framer-motion";
import { Terminal, Braces, Blocks, Bot, Boxes, Zap, Workflow, ArrowRight } from "lucide-react";

const tools = [
  { name: "OpenAI SDK", icon: Terminal },
  { name: "Vercel AI SDK", icon: Zap },
  { name: "LangChain", icon: Bot },
  { name: "LiteLLM proxy", icon: Braces },
  { name: "n8n", icon: Workflow },
  { name: "curl", icon: Terminal },
  { name: "Postman", icon: Boxes },
  { name: "LangGraph", icon: Blocks },
];

export function LogoCloud() {
  return (
    <div className="relative z-20 pb-24 pt-8" style={{ backgroundColor: "#09090B" }}>
      <div className="w-full flex justify-center px-6">
        <div className="w-full max-w-4xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-lg text-zinc-300 mb-2"
          >
            Drop-in compatible with your existing stack.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-zinc-500 mb-16"
          >
            Use the OpenAI SDKs and tools you already know. No new clients required.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative group cursor-pointer"
          >
            {/* Tool grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-16 gap-y-10 items-center justify-items-center transition-all duration-300 group-hover:blur-[2.5px] group-hover:opacity-50">
              {tools.map((tool) => (
                <div key={tool.name} className="text-zinc-300 font-medium text-lg flex items-center gap-2">
                  <tool.icon className="w-5 h-5 text-zinc-500" />
                  {tool.name}
                </div>
              ))}
            </div>

            {/* Hover overlay button */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <a
                href="https://api-docs.atlasflux.my"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-zinc-800/80 backdrop-blur-sm border border-zinc-700 rounded-full text-sm text-zinc-300 flex items-center gap-2 pointer-events-auto"
              >
                Read the integration guide
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}