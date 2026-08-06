"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface AppIconProps {
  name: string;
  domain: string;
  className?: string;
}

export function AppIcon({ name, domain, className }: AppIconProps) {
  const [failed, setFailed] = useState(false);
  const size = className ?? "size-5";

  return failed ? (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-md bg-muted text-[11px] font-semibold text-muted-foreground",
        size
      )}
      aria-hidden="true"
    >
      {name.charAt(0).toUpperCase()}
    </span>
  ) : (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://www.google.com/s2/favicons?domain=${domain}&sz=32`}
      alt=""
      width={20}
      height={20}
      loading="lazy"
      className={cn("shrink-0 rounded-sm", size)}
      onError={() => setFailed(true)}
    />
  );
}
