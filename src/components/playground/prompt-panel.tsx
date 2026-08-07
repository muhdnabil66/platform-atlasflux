"use client";

import { Loader2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface PromptPanelProps {
  value: string;
  onChange: (value: string) => void;
  onRun: () => void;
  running: boolean;
  hasCredit: boolean;
}

export function PromptPanel({ value, onChange, onRun, running, hasCredit }: PromptPanelProps) {
  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex items-center justify-between">
        <label htmlFor="prompt" className="text-sm font-semibold">
          Input message
        </label>
        <span className="text-xs tabular-nums text-muted-foreground">
          {value.length.toLocaleString()} characters
        </span>
      </div>

      <Textarea
        id="prompt"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Describe what you want to build or ask..."
        className="min-h-48 flex-1 resize-none font-mono text-[13px] leading-relaxed"
      />

      <Button size="lg" onClick={onRun} disabled={running || !hasCredit} className="w-full">
        {running ? (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          <Play className="size-4" aria-hidden="true" />
        )}
        {!hasCredit ? "Insufficient credit" : running ? "Running request..." : "Run request"}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
              Responses are powered by the AtlasFlux API.
      </p>
    </div>
  );
}
