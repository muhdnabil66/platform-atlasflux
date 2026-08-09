import Link from "next/link";
import { Logo } from "@/components/logo";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Models", href: "/models" },
      { label: "Pricing", href: "/pricing" },
      { label: "Documentation", href: "https://api-docs.atlasflux.my" },
      { label: "API status", href: "https://status.atlasflux.my" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "AtlasFlux AI", href: "https://ai.atlasflux.my" },
      { label: "Rainspeed Labs", href: "https://www.rainspeedlabs.com/" },
      { label: "Legal & policies", href: "https://ai.atlasflux.my/legal" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Logo subtext="Developer Platform" />
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              One API for reasoning, multimodal understanding, web search and
              automatic model routing. Built by Rainspeed Labs.
            </p>
          </div>
          {COLUMNS.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h3 className="text-sm font-semibold">{column.title}</h3>
              <ul className="mt-3 flex flex-col gap-2">
                {column.links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith("http") ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-start justify-between gap-2 border-t pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} AtlasFlux. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            platform.atlasflux.my · api.atlasflux.my
          </p>
        </div>
      </div>
    </footer>
  );
}
