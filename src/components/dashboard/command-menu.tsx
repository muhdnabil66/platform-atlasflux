"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { topLevelItems } from "@/config/navigation";

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const filtered = topLevelItems.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex h-8 w-44 items-center gap-2 rounded-md border bg-background px-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:w-56"
        aria-label="Open search and command menu"
      >
        <Search className="size-3.5" aria-hidden="true" />
        <span className="flex-1 text-left">Search...</span>
        <kbd className="hidden rounded border bg-muted px-1 font-mono text-[10px] text-muted-foreground sm:inline">
          Ctrl K
        </kbd>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Quick navigation</DialogTitle>
            <DialogDescription>
              Jump to a page in the developer dashboard.
            </DialogDescription>
          </DialogHeader>
          <Input
            autoFocus
            placeholder="Search pages..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search pages"
          />
          <div className="flex max-h-72 flex-col gap-0.5 overflow-y-auto">
            {filtered.map((item) => (
              <button
                key={item.title}
                onClick={() => {
                  if (item.href.startsWith("http") || item.href.startsWith("mailto:")) {
                    window.open(item.href, "_blank", "noopener,noreferrer");
                  } else {
                    router.push(item.href);
                  }
                  setOpen(false);
                  setQuery("");
                }}
                className="flex h-9 items-center gap-2.5 rounded-md px-2 text-sm text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <item.icon className="size-4 text-muted-foreground" aria-hidden="true" />
                <span className="flex-1 text-left">{item.title}</span>
                <ArrowRight className="size-3.5 text-muted-foreground" aria-hidden="true" />
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="px-2 py-6 text-center text-sm text-muted-foreground">
                No pages found for &quot;{query}&quot;
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
