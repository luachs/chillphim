"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md border border-white/20 bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md dark:border-zinc-800/50 dark:bg-zinc-900/50",
        className,
      )}
      {...props}
    />
  );
}
