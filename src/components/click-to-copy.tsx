"use client";

import { useState, type ReactNode } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type ClickToCopyProps = {
  text: string;
  children: ReactNode;
  className?: string;
};

const ClickToCopy = ({ text, children, className }: ClickToCopyProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Clicpboard API not available")
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        "group relative inline-flex items-center gap-1.5 cursor-pointer text-left",
        className,
      )}
    >
      {children}
      <span className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        {copied ? (
          <Check className="size-3.5 text-green-500" />
        ) : (
          <Copy className="size-3.5 text-muted-foreground" />
        )}
      </span>
    </button>
  );
};

export { ClickToCopy };
