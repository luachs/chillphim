"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-xl border border-zinc-200 bg-white/60 text-zinc-900 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/60 dark:text-zinc-50",
        className,
      )}
      {...props}
    />
  );
}

