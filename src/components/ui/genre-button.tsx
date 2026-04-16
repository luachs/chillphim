"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GenreButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active: boolean;
  label: string;
}

// Sử dụng React.forwardRef để Framer Motion có thể can thiệp vào DOM nếu cần
const GenreButton = React.forwardRef<HTMLButtonElement, GenreButtonProps>(
  ({ active, label, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "relative px-5 py-2 text-sm font-medium transition-all duration-300 rounded-full overflow-hidden isolate",
          active
            ? "text-white shadow-lg shadow-indigo-500/30"
            : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800",
          className,
        )}
        {...props}>
        <span className="relative z-10">{label}</span>

        {active && (
          <motion.div
            layoutId="activeTab" // Giữ nguyên layoutId để hiệu ứng trượt hoạt động giữa các nút
            className="absolute inset-0 bg-indigo-600"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
      </button>
    );
  },
);

GenreButton.displayName = "GenreButton";

export { GenreButton };
