"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { topLevelItems } from "@/config/navigation";

const labels: Record<string, string> = {
  overview: "Overview",
  "api-keys": "API Keys",
  playground: "Playground",
  usage: "Usage",
  logs: "Logs",
  models: "Models",
  "web-search": "Web Search",
  billing: "Billing",
  settings: "Settings",
  docs: "Documentation",
};

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const items = segments.map((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join("/")}`;
    const title = labels[segment] ?? segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    const isLast = index === segments.length - 1;
    const active = topLevelItems.find((item) => item.href === href);
    return { href, title, isLast, active: active?.title };
  });

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm">
      <ol className="flex items-center gap-1">
        <li>
          <Link
            href="/dashboard/overview"
            className="rounded px-1 py-0.5 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Dashboard
          </Link>
        </li>
        {items.map((item) => (
          <li key={item.href} className="flex items-center gap-1">
            <ChevronRight className="size-3.5 text-muted-foreground/50" aria-hidden="true" />
            {item.isLast ? (
              <span aria-current="page" className="rounded px-1 py-0.5 font-medium text-foreground">
                {item.title}
              </span>
            ) : (
              <Link
                href={item.href}
                className="rounded px-1 py-0.5 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {item.title}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
