import {
  Activity,
  BookOpen,
  Bot,
  CircleDollarSign,
  FileText,
  KeyRound,
  LayoutDashboard,
  LifeBuoy,
  ScrollText,
  Settings,
  TerminalSquare,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
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
      { title: "Documentation", href: "/docs", icon: BookOpen },
      { title: "Settings", href: "/dashboard/settings", icon: Settings },
      { title: "AtlasFlux AI", href: "https://ai.atlasflux.my", icon: FileText },
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
  { title: "Support", href: "#", icon: LifeBuoy },
];
