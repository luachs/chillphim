"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ className, ...props }: TextareaProps) {
  return (
    <div className="group relative w-full">
      <textarea
        className={cn(
          // Base styles
          "flex min-h-[120px] w-full resize-none rounded-2xl border border-zinc-200 bg-white/50 px-4 py-3 text-sm transition-all duration-300",
          "placeholder:text-zinc-400 outline-none",
          // Dark mode
          "dark:border-zinc-800 dark:bg-zinc-950/50 dark:text-zinc-50",
          // Hover & Focus effects
          "hover:border-zinc-300 dark:hover:border-zinc-700",
          "focus:border-indigo-500 focus:ring-[4px] focus:ring-indigo-500/10 dark:focus:border-indigo-400 dark:focus:ring-indigo-400/10",
          "focus:bg-white dark:focus:bg-zinc-950",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      />
      {/* Glow effect nhẹ nhàng ở góc để tăng chiều sâu */}
      <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-indigo-500/20 blur-sm opacity-0 group-focus-within:opacity-100 transition-opacity" />
    </div>
  );
}
