"use client";

import * as React from "react";
import { Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { apiFetch } from "@/lib/api-client";
import { getStoredAuthUser } from "@/lib/auth-client";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function FavoriteButton({ movieId }: { movieId: string }) {
  const [userId, setUserId] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [isFavorite, setIsFavorite] = React.useState(false);

  React.useEffect(() => {
    const user = getStoredAuthUser();
    setUserId(user?._id ?? null);
  }, []);

  React.useEffect(() => {
    if (!userId) return;
    apiFetch<{ data: any[] }>(
      `/api/favorites?userId=${encodeURIComponent(userId)}`,
    )
      .then((res) => {
        setIsFavorite(res.data.some((f) => f.movie?._id === movieId));
      })
      .catch(() => setIsFavorite(false));
  }, [movieId, userId]);

  const toggle = async () => {
    if (!userId) {
      alert("Bạn cần đăng nhập để thêm vào yêu thích.");
      return;
    }

    setLoading(true);
    try {
      const res = await apiFetch<{ action: "added" | "removed" }>(
        "/api/favorites",
        {
          method: "POST",
          jsonBody: { userId, movieId },
        },
      );
      setIsFavorite(res.action === "added");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="default"
      onClick={toggle}
      disabled={loading}
      className={cn(
        "relative group overflow-hidden transition-all duration-500 rounded-xl",
        isFavorite
          ? "border-red-200 bg-red-50 text-red-600 dark:bg-red-500/10 dark:border-red-500/20 shadow-sm shadow-red-500/10"
          : "hover:border-zinc-300 dark:hover:border-zinc-700 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm",
      )}>
      <div className="relative flex items-center gap-2 z-10">
        <motion.div
          // Sử dụng key để trigger animation mỗi khi isFavorite thay đổi
          key={isFavorite ? "active" : "inactive"}
          animate={{
            scale: isFavorite ? [1, 1.4, 1] : [1, 0.9, 1],
          }}
          transition={{
            duration: 0.4,
            times: [0, 0.5, 1],
            ease: "easeInOut",
          }}>
          <Heart
            className={cn(
              "h-5 w-5 transition-colors duration-300",
              isFavorite
                ? "fill-red-500 text-red-500"
                : "text-zinc-400 group-hover:text-zinc-600",
            )}
          />
        </motion.div>

        <span className="font-bold tracking-tight">
          {isFavorite ? "Đã lưu vào danh sách" : "Thêm vào yêu thích"}
        </span>
      </div>

      {/* Hiệu ứng tia sáng bung tỏa khi nhấn thích */}
      <AnimatePresence>
        {isFavorite && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 2, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute inset-0 z-0 bg-red-500/20 rounded-full pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Lớp overlay khi loading */}
      {loading && (
        <div className="absolute inset-0 bg-white/40 dark:bg-black/40 flex items-center justify-center z-20">
          <div className="h-4 w-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </Button>
  );
}
