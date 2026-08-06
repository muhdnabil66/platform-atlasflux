import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
  compact?: boolean;
}

export function CodeBlock({ code, language, className, compact }: CodeBlockProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg border bg-muted/40 text-left",
        compact ? "text-[12px]" : "text-[13px]",
        className
      )}
    >
      {language && (
        <div className="flex items-center justify-between border-b bg-muted/60 px-3 py-1.5">
          <span className="font-mono text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            {language}
          </span>
        </div>
      )}
      <pre className="overflow-x-auto px-3 py-2.5 leading-relaxed">
        <code className="font-mono text-foreground/90">{code}</code>
      </pre>
    </div>
  );
}
