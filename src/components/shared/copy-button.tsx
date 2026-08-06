"use client";

import { Check, Copy } from "lucide-react";
import { useState, type MouseEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
  value: string;
  label?: string;
  ariaLabel?: string;
  className?: string;
  variant?: "ghost" | "outline";
  onClick?: (e: MouseEvent) => void;
}

export function CopyButton({
  value,
  label = "Copy",
  ariaLabel,
  className,
  variant = "ghost",
  onClick,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = value;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <Button
      type="button"
      variant={variant}
      size="sm"
      onClick={(e) => {
        onClick?.(e);
        handleCopy();
      }}
      className={cn("gap-1.5", className)}
      aria-label={ariaLabel ?? `${label}: ${value}`}
    >
      {copied ? (
        <Check className="size-3.5 text-success" aria-hidden="true" />
      ) : (
        <Copy className="size-3.5" aria-hidden="true" />
      )}
      <span>{copied ? "Copied" : label}</span>
    </Button>
  );
}
