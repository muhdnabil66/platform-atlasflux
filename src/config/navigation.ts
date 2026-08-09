import {
  Activity,
  BookOpen,
  Bot,
  CircleDollarSign,
  KeyRound,
  LayoutDashboard,
  LifeBuoy,
  ScrollText,
  Settings,
  TerminalSquare,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import { createElement, type ComponentType, type ReactNode } from "react";

function AtlasIcon({ className }: { className?: string }): ReactNode {
  return createElement(Image, { src: "/atlas.png", alt: "", width: 16, height: 16, className, "aria-hidden": true });
}

type NavigationIcon = LucideIcon | ComponentType<{ className?: string; "aria-hidden"?: boolean | string }>;

export interface NavItem {
  title: string;
  href: string;
  icon: NavigationIcon;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const dashboardNavigation: NavSection[] = [
  {
    title: "Main",
    items: [
      { title: "Overview", href: "/dashboard/overview", icon: LayoutDashboard },
      { title: "API Keys", href: "/dashboard/api-keys", icon: KeyRound },
      { title: "Playground", href: "/dashboard/playground", icon: TerminalSquare },
      { title: "Usage", href: "/dashboard/usage", icon: Activity },
      { title: "Logs", href: "/dashboard/logs", icon: ScrollText },
    ],
  },
  {
    title: "Platform",
    items: [
      { title: "Models", href: "/dashboard/models", icon: Bot },
      { title: "Web Search", href: "/dashboard/web-search", icon: Wrench },
      { title: "Billing", href: "/dashboard/billing", icon: CircleDollarSign },
    ],
  },
  {
    title: "Resources",
    items: [
      { title: "Documentation", href: "https://api-docs.atlasflux.my", icon: BookOpen },
      { title: "Status", href: "https://status.atlasflux.my", icon: Activity },
      { title: "Settings", href: "/dashboard/settings", icon: Settings },
      { title: "AtlasFlux AI", href: "https://ai.atlasflux.my", icon: AtlasIcon },
    ],
  },
];

export const topLevelItems: NavItem[] = [
  { title: "Overview", href: "/dashboard/overview", icon: LayoutDashboard },
  { title: "API Keys", href: "/dashboard/api-keys", icon: KeyRound },
  { title: "Playground", href: "/dashboard/playground", icon: TerminalSquare },
  { title: "Usage", href: "/dashboard/usage", icon: Activity },
  { title: "Logs", href: "/dashboard/logs", icon: ScrollText },
  { title: "Models", href: "/dashboard/models", icon: Bot },
  { title: "Web Search", href: "/dashboard/web-search", icon: Wrench },
  { title: "Billing", href: "/dashboard/billing", icon: CircleDollarSign },
  { title: "Settings", href: "/dashboard/settings", icon: Settings },
  { title: "Support", href: "mailto:support@atlasflux.my", icon: LifeBuoy },
];
