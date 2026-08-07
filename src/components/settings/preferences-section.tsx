"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { ReasoningEffort, SearchDepth, SearchMode } from "@/types/api";
import { searchDepthOptions } from "@/config/models";
import { getSettings, updateSettings } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const REASONING: { value: ReasoningEffort; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

const SEARCH_MODES: { value: SearchMode; label: string }[] = [
  { value: "off", label: "Off" },
  { value: "auto", label: "Auto" },
  { value: "on", label: "On" },
];

export function PreferencesSection() {
  const [reasoning, setReasoning] = useState<ReasoningEffort>("medium");
  const [searchMode, setSearchMode] = useState<SearchMode>("auto");
  const [depth, setDepth] = useState<SearchDepth>("balanced");
  const [maxResults, setMaxResults] = useState(10);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getSettings().then((res) => {
      const prefs = (res.settings?.metadata as Record<string, unknown>)?.preferences as Record<string, unknown> | undefined;
      if (prefs) {
        if (prefs.reasoning_effort) setReasoning(prefs.reasoning_effort as ReasoningEffort);
        if (prefs.search_mode) setSearchMode(prefs.search_mode as SearchMode);
        if (prefs.search_depth) setDepth(prefs.search_depth as SearchDepth);
        if (prefs.max_results) setMaxResults(prefs.max_results as number);
      }
    }).catch(() => {});
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSettings({
        preferences: {
          reasoning_effort: reasoning,
          search_mode: searchMode,
          search_depth: depth,
          max_results: maxResults,
        },
      });
      toast.success("Developer preferences saved");
    } catch {
      toast.error("Failed to save preferences");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="pref-reasoning">Default reasoning effort</Label>
          <Select value={reasoning} onValueChange={(v) => setReasoning(v as ReasoningEffort)}>
            <SelectTrigger id="pref-reasoning" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {REASONING.map((r) => (
                <SelectItem key={r.value} value={r.value}>
                  {r.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="pref-search-mode">Default search mode</Label>
          <Select value={searchMode} onValueChange={(v) => setSearchMode(v as SearchMode)}>
            <SelectTrigger id="pref-search-mode" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SEARCH_MODES.map((m) => (
                <SelectItem key={m.value} value={m.value}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="pref-depth">Default search depth</Label>
          <Select value={depth} onValueChange={(v) => setDepth(v as SearchDepth)}>
            <SelectTrigger id="pref-depth" className="w-full capitalize">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {searchDepthOptions.map((d) => (
                <SelectItem key={d} value={d} className="capitalize">
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="pref-max-results">Default max results</Label>
          <Select
            value={String(maxResults)}
            onValueChange={(v) => setMaxResults(Number(v))}
          >
            <SelectTrigger id="pref-max-results" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[3, 5, 8, 10, 15, 20, 25].map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save preferences"}
        </Button>
      </div>
    </div>
  );
}
