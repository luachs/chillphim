"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Film,
  User,
  Settings,
  LogOut,
  ChevronRight,
  Sparkles,
} from "lucide-react";

import { apiFetch } from "@/lib/api-client";
import { MovieCard } from "@/components/movies/MovieCard";
import { MovieCardSkeleton } from "@/components/skeleton/MovieCardSkeleton";
import { getStoredAuthUser } from "@/lib/auth-client";

type FavoriteItem = {
  _id: string;
  user: string;
  movie: {
    _id: string;
    title: string;
    thumbnail: string;
    slug: string;
    genres?: Array<{ _id: string; name: string } | string>;
    duration?: number;
  };
};

export default function ProfilePage() {
  const [user, setUser] =
    React.useState<ReturnType<typeof getStoredAuthUser>>(null);
  const [loading, setLoading] = React.useState(true);
  const [favorites, setFavorites] = React.useState<FavoriteItem[]>([]);

  React.useEffect(() => {
    const u = getStoredAuthUser();
    setUser(u);
  }, []);

  React.useEffect(() => {
    if (!user?._id) return;
    setLoading(true);
    apiFetch<{ data: FavoriteItem[] }>(
      `/api/favorites?userId=${encodeURIComponent(user._id)}`,
    )
      .then((res) => setFavorites(res.data))
      .catch(() => setFavorites([]))
      .finally(() => setLoading(false));
  }, [user?._id]);

  if (!user) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-3xl bg-zinc-100 p-10 text-center dark:bg-zinc-900 shadow-2xl border border-zinc-200 dark:border-zinc-800">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 rounded-full bg-red-500 p-4 shadow-xl shadow-red-500/20">
            <Heart className="h-8 w-8 text-white" />
          </div>
          <h1 className="mt-4 text-4xl font-black tracking-tight">
            Dừng lại một chút!
          </h1>
          <p className="mt-4 text-zinc-500 dark:text-zinc-400 max-w-sm">
            Bạn cần đăng nhập để khám phá kho phim yêu thích cá nhân và trải
            nghiệm đầy đủ tính năng.
          </p>
          <Link
            href="/login"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-indigo-600 px-8 py-4 font-bold text-white transition-all hover:bg-indigo-700 hover:scale-105 active:scale-95 shadow-lg shadow-indigo-500/25">
            Đăng nhập ngay <ChevronRight size={18} />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-white dark:bg-[#09090b] px-4 pb-20 pt-10">
      {/* Background Decor (Blurry blobs) */}
      <div className="pointer-events-none absolute -left-20 top-0 h-96 w-96 rounded-full bg-indigo-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute -right-20 top-40 h-96 w-96 rounded-full bg-purple-500/10 blur-[120px]" />

      <div className="relative mx-auto max-w-6xl">
        {/* --- PROFILE HEADER --- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative overflow-hidden rounded-[2.5rem] bg-zinc-900 p-1 dark:bg-zinc-800">
          <div className="relative flex flex-col gap-8 rounded-[2.3rem] bg-gradient-to-br from-zinc-900 via-zinc-900 to-black p-8 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-6">
              {/* Avatar with Glow */}
              <div className="group relative">
                <div className="absolute -inset-1 animate-pulse rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 opacity-70 blur-md group-hover:opacity-100" />
                <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-white text-3xl font-black text-black ring-4 ring-black">
                  {user.username?.charAt(0).toUpperCase()}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-black text-white">
                    {user.username}
                  </h1>
                  <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-indigo-400 border border-indigo-500/30">
                    {user.role}
                  </span>
                </div>
                <p className="mt-1 flex items-center gap-2 text-zinc-400">
                  <Sparkles size={14} className="text-yellow-500" />
                  Thành viên Vip của MyMovie
                </p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="flex gap-4">
              <div className="rounded-2xl bg-white/5 border border-white/10 p-4 backdrop-blur-xl min-w-[120px]">
                <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">
                  Favorites
                </p>
                <p className="text-3xl font-black text-white">
                  {favorites.length}
                </p>
              </div>
              <div className="rounded-2xl bg-white/5 border border-white/10 p-4 backdrop-blur-xl">
                <button className="p-2 text-zinc-400 hover:text-white transition-colors">
                  <Settings size={20} />
                </button>
                <button className="p-2 text-red-400 hover:text-red-300 transition-colors">
                  <LogOut size={20} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* --- FAVORITES SECTION --- */}
        <div className="mt-16">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="flex items-center gap-3 text-3xl font-black tracking-tight text-zinc-900 dark:text-white">
                <Film className="text-indigo-500" />
                Bộ sưu tập cá nhân
              </h2>
              <p className="mt-2 text-zinc-500">
                Những thước phim bạn đã lưu lại
              </p>
            </div>
          </div>

          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <MovieCardSkeleton key={i} />
              ))}
            </div>
          ) : favorites.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="group flex flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-zinc-200 py-20 transition-colors hover:border-indigo-500/50 dark:border-zinc-800">
              <div className="rounded-full bg-zinc-100 p-6 dark:bg-zinc-900 group-hover:scale-110 transition-transform">
                <Film
                  size={48}
                  className="text-zinc-400 group-hover:text-indigo-500"
                />
              </div>
              <p className="mt-6 text-xl font-bold text-zinc-800 dark:text-zinc-200">
                Kệ phim đang trống
              </p>
              <p className="mt-2 text-zinc-500">
                Bắt đầu hành trình điện ảnh của bạn ngay hôm nay
              </p>

              <Link
                href="/"
                className="mt-8 rounded-2xl bg-zinc-900 px-8 py-3 font-bold text-white transition-all hover:bg-black dark:bg-white dark:text-black hover:shadow-xl active:scale-95">
                Khám phá ngay
              </Link>
            </motion.div>
          ) : (
            <motion.div
              layout
              className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              <AnimatePresence mode="popLayout">
                {favorites.map((f, index) => (
                  <motion.div
                    key={f._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ delay: index * 0.05 }}
                    className="group relative">
                    <div className="absolute -inset-2 rounded-[2rem] bg-gradient-to-b from-indigo-500 to-purple-600 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-20" />
                    <MovieCard
                      movie={{
                        _id: f.movie._id,
                        title: f.movie.title,
                        thumbnail: f.movie.thumbnail,
                        slug: f.movie.slug,
                        genres: f.movie.genres,
                        duration: f.movie.duration,
                      }}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
