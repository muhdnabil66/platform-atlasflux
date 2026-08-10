"use client";

import Link from "next/link";
import { Logo } from "@/components/logo";
import { SidebarNav } from "./sidebar-nav";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";

interface MobileNavProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileNav({ open, onOpenChange }: MobileNavProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-72 p-0">
        <SheetTitle className="sr-only">Navigation</SheetTitle>
        <div className="flex h-14 items-center border-b px-4">
          <Link href="/dashboard/overview" onClick={() => onOpenChange(false)}>
            <Logo subtext="Developer Platform" />
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto py-3">
          <SidebarNav onNavigate={() => onOpenChange(false)} />
        </div>
        <div className="flex gap-2 border-t p-3">
          <Button asChild variant="outline" className="min-w-0 flex-1" size="sm">
            <Link href="https://api-docs.atlasflux.my">Docs</Link>
          </Button>
          <Button asChild variant="outline" className="min-w-0 flex-1" size="sm">
            <a href="https://support.atlasflux.my" target="_blank" rel="noopener noreferrer">
              Help Center
            </a>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
