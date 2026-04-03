"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type TextareaProps =
  React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        "flex min-h-[100px] w-full resize-none rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-500 outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:text-zinc-50",
        className,
      )}
      {...props}
    />
  );
}

