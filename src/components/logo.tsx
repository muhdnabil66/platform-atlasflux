import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showWordmark?: boolean;
  subtext?: string;
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <Image
      src="/atlas.png"
      alt="AtlasFlux"
      width={32}
      height={32}
      className={cn(
        "size-7 shrink-0 rounded-lg object-cover",
        className
      )}
    />
  );
}

export function Logo({ className, showWordmark = true, subtext }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark />
      {showWordmark && (
        <span className="flex flex-col leading-tight">
          <span className="text-[15px] font-semibold tracking-tight text-foreground">
            AtlasFlux
          </span>
          {subtext && (
            <span className="text-[11px] font-medium text-muted-foreground">
              {subtext}
            </span>
          )}
        </span>
      )}
    </span>
  );
}
