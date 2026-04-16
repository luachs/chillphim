"use client";

import * as React from "react";
import { Moon, Sun, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";

export function ThemeToggle() {
  const [theme, setTheme] = React.useState<"dark" | "light">("dark");
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    const stored = window.localStorage.getItem("theme") as "dark" | "light";
    const next = stored || "dark";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    window.localStorage.setItem("theme", next);
  };

  if (!mounted) return <div className="h-10 w-10" />;

  return (
    <div className="relative">
      {/* Hiệu ứng tia sáng tỏa ra phía sau khi hover */}
      <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 blur-lg transition-opacity duration-500 hover:opacity-30 dark:hover:opacity-20" />

      <Button
        variant="ghost"
        size="icon"
        className="group relative h-12 w-12 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950/50 dark:backdrop-blur-md"
        onClick={toggle}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={theme}
            initial={{ y: 30, opacity: 0, scale: 0.5, rotate: -180 }}
            animate={{ y: 0, opacity: 1, scale: 1, rotate: 0 }}
            exit={{ y: -30, opacity: 0, scale: 0.5, rotate: 180 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
            className="relative flex items-center justify-center">
            {theme === "dark" ? (
              <>
                <Sun className="h-5 w-5 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]" />
                {/* Các hạt highlight nhỏ bay quanh Mặt trời */}
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute -top-1 -right-1">
                  <Sparkles size={10} className="text-yellow-200" />
                </motion.div>
              </>
            ) : (
              <>
                <Moon className="h-5 w-5 text-indigo-600 drop-shadow-[0_0_8px_rgba(79,70,229,0.4)]" />
                {/* Hiệu ứng bóng đêm mờ ảo */}
                <motion.div
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                  className="absolute inset-0 h-full w-full rounded-full bg-indigo-500/10 blur-sm"
                />
              </>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Hiệu ứng viền chạy quanh khi hover (Border beam effect) */}
        <div className="absolute inset-0 border-2 border-transparent transition-all group-hover:border-indigo-500/30 rounded-2xl" />
      </Button>

      {/* Text nhãn nhỏ ẩn hiện (tùy chọn) */}
      <span className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 scale-0 text-[10px] font-black uppercase tracking-tighter text-zinc-400 transition-transform group-hover:scale-100">
        {theme}
      </span>
    </div>
  );
}
