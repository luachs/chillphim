"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <div className="group relative w-full">
      <input
        className={cn(
          // Base styles
          "flex h-11 w-full rounded-xl border border-zinc-200 bg-white/50 px-4 py-2 text-sm transition-all duration-300",
          "placeholder:text-zinc-400 outline-none",
          // Dark mode
          "dark:border-zinc-800 dark:bg-zinc-950/50 dark:text-zinc-50",
          // Hover & Focus effects
          "hover:border-zinc-300 dark:hover:border-zinc-700",
          "focus:border-indigo-500 focus:ring-[4px] focus:ring-indigo-500/10 dark:focus:border-indigo-400 dark:focus:ring-indigo-400/10",
          // Glass effect khi focus
          "focus:bg-white dark:focus:bg-zinc-950",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      />
      {/* Một vệt sáng cực mảnh ở dưới khi focus */}
      <div className="absolute inset-x-4 bottom-0 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 transition-opacity duration-300 group-focus-within:opacity-100" />
    </div>
  );
}
