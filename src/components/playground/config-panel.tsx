"use client";

import {
  Bot,
  Coins,
  Globe2,
  Settings2,
  SlidersHorizontal,
} from "lucide-react";
import type {
  PlaygroundConfig,
  ReasoningEffort,
  SearchDepth,
  SearchMode,
} from "@/types/api";
import { nenasFlash, searchDepthOptions } from "@/config/models";
import { estimatePlaygroundCost } from "@/lib/cost-estimation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { formatRM } from "@/lib/format";

const REASONING_OPTIONS: { value: ReasoningEffort; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

const SEARCH_MODES: { value: SearchMode; label: string }[] = [
  { value: "off", label: "Off" },
  { value: "auto", label: "Auto" },
  { value: "on", label: "On" },
];

interface ConfigPanelProps {
  config: PlaygroundConfig;
  onChange: (patch: Partial<PlaygroundConfig>) => void;
}

function SectionHeader({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Settings2;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
      {children}
    </div>
  );
}

export function ConfigPanel({ config, onChange }: ConfigPanelProps) {
  const estimate = estimatePlaygroundCost(config);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <Label>Model</Label>
        <div className="flex h-9 items-center gap-2 rounded-lg border bg-background px-3">
          <Bot className="size-4 text-muted-foreground" aria-hidden="true" />
          <code className="font-mono text-sm">{nenasFlash.id}</code>
        </div>
        <p className="text-xs text-muted-foreground">
          Routing is handled automatically for this model.
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Reasoning effort</Label>
        <div className="grid grid-cols-3 gap-1 rounded-lg border bg-muted/40 p-1">
          {REASONING_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => onChange({ reasoning: option.value })}
              aria-pressed={config.reasoning === option.value}
              className={cn(
                "h-7 rounded-md text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                config.reasoning === option.value
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Reasoning tokens are billed at the output rate.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="temperature">Temperature</Label>
          <span className="font-mono text-xs tabular-nums text-muted-foreground">
            {config.temperature.toFixed(1)}
          </span>
        </div>
        <Slider
          id="temperature"
          min={0}
          max={1}
          step={0.1}
          value={[config.temperature]}
          onValueChange={(v) => onChange({ temperature: v[0] })}
          aria-label="Temperature"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="max-output">Max output tokens</Label>
          <Input
            id="max-output"
            type="number"
            min={1}
            max={32000}
            value={config.maxOutputTokens}
            onChange={(e) => onChange({ maxOutputTokens: Number(e.target.value) || 1 })}
          />
        </div>
        <div className="flex flex-col justify-end gap-1.5">
          <Label htmlFor="stream">Stream response</Label>
          <div className="flex h-9 items-center gap-2">
            <Switch
              id="stream"
              checked={config.stream}
              onCheckedChange={(v) => onChange({ stream: v })}
            />
            <span className="text-sm text-muted-foreground">
              {config.stream ? "Enabled" : "Disabled"}
            </span>
          </div>
        </div>
      </div>

      <div className="h-px bg-border" role="separator" />

      <div className="flex flex-col gap-1.5">
        <SectionHeader icon={Globe2} title="Web search" />
        <div className="mt-2 grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="search-mode">Mode</Label>
            <Select
              value={config.searchMode}
              onValueChange={(v) => onChange({ searchMode: v as SearchMode })}
            >
              <SelectTrigger id="search-mode" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SEARCH_MODES.map((mode) => (
                  <SelectItem key={mode.value} value={mode.value}>
                    {mode.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="search-depth">Search depth</Label>
            <Select
              value={config.searchDepth}
              onValueChange={(v) => onChange({ searchDepth: v as SearchDepth })}
              disabled={config.searchMode === "off"}
            >
              <SelectTrigger id="search-depth" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {searchDepthOptions.map((depth) => (
                  <SelectItem key={depth} value={depth} className="capitalize">
                    {depth}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="max-results">Max results</Label>
          <Input
            id="max-results"
            type="number"
            min={1}
            max={25}
            value={config.maxResults}
            disabled={config.searchMode === "off"}
            onChange={(e) => onChange({ maxResults: clamp(Number(e.target.value), 1, 25) })}
          />
          <p className="text-xs text-muted-foreground">1 to 25</p>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="max-searches">Max searches</Label>
          <Input
            id="max-searches"
            type="number"
            min={1}
            max={5}
            value={config.maxSearches}
            disabled={config.searchMode === "off"}
            onChange={(e) => onChange({ maxSearches: clamp(Number(e.target.value), 1, 5) })}
          />
          <p className="text-xs text-muted-foreground">1 to 5</p>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="content-extraction">Content extraction</Label>
          <Switch
            id="content-extraction"
            checked={config.contentExtraction}
            disabled={config.searchMode === "off"}
            onCheckedChange={(v) => onChange({ contentExtraction: v })}
          />
        </div>
        {config.contentExtraction && config.searchMode !== "off" && (
          <div className="mt-2 flex flex-col gap-1.5">
            <Label htmlFor="max-pages">Max pages</Label>
            <Input
              id="max-pages"
              type="number"
              min={1}
              max={10}
              value={config.maxContentPages}
              onChange={(e) => onChange({ maxContentPages: clamp(Number(e.target.value), 1, 10) })}
            />
            <p className="text-xs text-muted-foreground">
              Billed at {formatRM(0.01)} per extracted page.
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="max-cost">
          Maximum total cost <span className="font-normal text-muted-foreground">(RM, 0 = unlimited)</span>
        </Label>
        <Input
          id="max-cost"
          type="number"
          min={0}
          step={0.01}
          value={config.maxTotalCost}
          onChange={(e) => onChange({ maxTotalCost: Math.max(0, Number(e.target.value) || 0) })}
        />
      </div>

      <div className="rounded-lg border bg-muted/40 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Coins className="size-4 text-muted-foreground" aria-hidden="true" />
            <span className="text-sm font-semibold">Estimated cost</span>
          </div>
          <span className="font-mono text-sm font-semibold tabular-nums">
            {formatRM(estimate.totalCost)}
          </span>
        </div>
        <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">Input tokens</dt>
            <dd className="tabular-nums">{estimate.inputTokens.toLocaleString()}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">Output tokens</dt>
            <dd className="tabular-nums">{estimate.outputTokens.toLocaleString()}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">Reasoning tokens</dt>
            <dd className="tabular-nums">{estimate.reasoningTokens.toLocaleString()}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">Searches</dt>
            <dd className="tabular-nums">{estimate.searches}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">Content pages</dt>
            <dd className="tabular-nums">{estimate.contentPages}</dd>
          </div>
        </dl>
        {estimate.aboveLimit && (
          <p className="mt-3 flex items-center gap-1.5 rounded-md bg-warning/10 px-2.5 py-1.5 text-xs text-warning">
            <SlidersHorizontal className="size-3.5" aria-hidden="true" />
            Estimated cost exceeds the maximum total cost. Lower search usage or raise the limit.
          </p>
        )}
      </div>
    </div>
  );
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
