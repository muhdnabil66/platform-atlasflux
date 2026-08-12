import Link from "next/link";
import Image from "next/image";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Models", href: "/models" },
      { label: "Pricing", href: "/pricing" },
      { label: "Documentation", href: "https://api-docs.atlasflux.my/" },
      { label: "Help Center", href: "https://support.atlasflux.my/" },
      { label: "API status", href: "https://status.atlasflux.my/" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "AtlasFlux AI", href: "https://ai.atlasflux.my/" },
      { label: "Rainspeed Labs", href: "https://rainspeedlabs.com/" },
      { label: "Legal & policies", href: "https://ai.atlasflux.my/legal" },
    ],
  },
];

const RESOURCES = [
  { label: "Sign in", href: "/sign-in" },
  { label: "Get an API key", href: "/sign-in" },
  { label: "Playground", href: "/dashboard/playground" },
  { label: "API reference", href: "https://api-docs.atlasflux.my/api-reference/overview" },
  { label: "Status page", href: "https://status.atlasflux.my/" },
  { label: "Contact us", href: "https://support.atlasflux.my/dashboard/tickets/new" },
];

export function Footer() {
  return (
    <footer className="border-t border-zinc-800 py-16 px-6" style={{ backgroundColor: "#09090B" }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Logo */}
          <div className="md:col-span-1">
            <Link href="/" aria-label="AtlasFlux home" className="flex items-center gap-2">
              <Image src="/atlas.png" alt="AtlasFlux" width={20} height={20} className="size-5 rounded-md object-cover" />
              <span className="text-white font-semibold text-sm">AtlasFlux</span>
            </Link>
            <p className="mt-3 text-xs text-zinc-500 leading-relaxed">
              One API for reasoning, multimodal understanding, web search and automatic model routing. Built by
              Rainspeed Labs.
            </p>
          </div>

          {/* Links */}
          {COLUMNS.map((column) => (
            <div key={column.title}>
              <h3 className="text-white font-medium text-sm mb-4">{column.title}</h3>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith("http") ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-zinc-500 hover:text-zinc-300 transition-colors text-sm"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link href={link.href} className="text-zinc-500 hover:text-zinc-300 transition-colors text-sm">
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Resources */}
          <div>
            <h3 className="text-white font-medium text-sm mb-4">Resources</h3>
            <ul className="space-y-3">
              {RESOURCES.map((link) => (
                <li key={link.label}>
                  {link.href.startsWith("http") ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-zinc-500 transition-colors hover:text-zinc-300"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-sm text-zinc-500 transition-colors hover:text-zinc-300"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
