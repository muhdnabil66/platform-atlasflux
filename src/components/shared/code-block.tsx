"use client";

import { Fragment, type ReactNode } from "react";
import { CopyButton } from "@/components/shared/copy-button";
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
      <div className="flex items-center justify-between border-b bg-muted/60 px-3 py-1.5">
        <span className="font-mono text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          {language ?? "code"}
        </span>
        <CopyButton
          value={code}
          label="Copy"
          ariaLabel={`Copy ${language ?? "code"} example`}
          className="h-7 px-2 text-[11px]"
        />
      </div>
      <pre className="overflow-x-auto px-3 py-2.5 leading-relaxed">
        <code className="font-mono text-foreground/90">{highlightCode(code, language)}</code>
      </pre>
    </div>
  );
}

const TOKEN_PATTERN = /(\/\*[\s\S]*?\*\/|\/\/[^\n]*|#[^\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\$[A-Za-z_][\w]*|--?[A-Za-z][\w-]*|\b\d+(?:\.\d+)?\b|\b(?:true|false|null|undefined)\b|\b(?:const|let|var|import|from|export|return|async|await|function|if|else|for|in|def|class|try|catch|new|throw|with|as|print)\b|[{}[\]():,])/g;

function highlightCode(code: string, language?: string): ReactNode {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;

  for (const match of code.matchAll(TOKEN_PATTERN)) {
    const value = match[0];
    const index = match.index ?? 0;
    if (index > lastIndex) nodes.push(code.slice(lastIndex, index));

    const after = code.slice(index + value.length);
    const isJsonKey = language === "json" && /^\s*:/.test(after);
    nodes.push(
      <span key={`${index}-${value}`} className={tokenClass(value, language, isJsonKey)}>
        {value}
      </span>
    );
    lastIndex = index + value.length;
  }

  if (lastIndex < code.length) nodes.push(code.slice(lastIndex));
  return nodes.map((node, index) => <Fragment key={index}>{node}</Fragment>);
}

function tokenClass(value: string, language?: string, isJsonKey = false): string {
  if (value.startsWith("//") || value.startsWith("#") || value.startsWith("/*")) {
    return "text-muted-foreground italic";
  }
  if (isJsonKey) return "text-sky-700 dark:text-sky-300";
  if (value.startsWith("\"") || value.startsWith("'") || value.startsWith("`")) {
    return "text-emerald-700 dark:text-emerald-300";
  }
  if (value.startsWith("$")) return "text-cyan-700 dark:text-cyan-300";
  if (value.startsWith("-")) return "text-amber-700 dark:text-amber-300";
  if (/^\d/.test(value)) return "text-violet-700 dark:text-violet-300";
  if (/^(true|false|null|undefined)$/.test(value)) return "text-orange-700 dark:text-orange-300";
  if (/^(const|let|var|import|from|export|return|async|await|function|if|else|for|in|def|class|try|catch|new|throw|with|as|print)$/.test(value)) {
    return "text-fuchsia-700 dark:text-fuchsia-300";
  }
  if (language === "bash" && value === "curl") return "font-semibold text-blue-700 dark:text-blue-300";
  if (/^[{}[\]():,]$/.test(value)) return "text-muted-foreground";
  return "text-foreground/90";
}
