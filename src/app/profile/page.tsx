"use client";

import * as React from "react";
import Link from "next/link";

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

  // 👉 UI khi chưa login
  if (!user) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="mt-3 text-zinc-500">
          Bạn cần đăng nhập để xem danh sách yêu thích.
        </p>

        <Link
          href="/login"
          className="mt-6 rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white transition hover:scale-105 hover:bg-zinc-800 dark:bg-white dark:text-black">
          Đăng nhập ngay
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* HEADER */}
      <div className="flex flex-col gap-6 rounded-2xl bg-gradient-to-r from-zinc-900 to-zinc-700 p-6 text-white shadow-lg dark:from-zinc-800 dark:to-zinc-900 md:flex-row md:items-center md:justify-between">
        {/* Left */}
        <div className="flex items-center gap-4">
          {/* Avatar fake */}
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-xl font-bold text-black">
            {user.username?.charAt(0).toUpperCase()}
          </div>

          <div>
            <h1 className="text-2xl font-bold">{user.username}</h1>
            <p className="text-sm text-zinc-300">Role: {user.role}</p>
          </div>
        </div>

        {/* Right */}
        <div className="rounded-xl bg-white/10 px-5 py-3 text-sm backdrop-blur">
          <p className="text-zinc-200">Favorites</p>
          <p className="text-xl font-bold">{favorites.length}</p>
        </div>
      </div>

      {/* FAVORITES */}
      <div className="mt-10">
        <h2 className="mb-6 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          🎬 Danh sách yêu thích
        </h2>

        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <MovieCardSkeleton key={i} />
            ))}
          </div>
        ) : favorites.length === 0 ? (
          // 👉 Empty state đẹp hơn
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 py-16 text-center dark:border-zinc-700">
            <p className="text-lg font-medium text-zinc-600 dark:text-zinc-300">
              Chưa có phim yêu thích 😢
            </p>
            <p className="mt-2 text-sm text-zinc-500">
              Hãy khám phá và thêm phim bạn thích vào danh sách
            </p>

            <Link
              href="/"
              className="mt-6 rounded-xl bg-black px-5 py-2 text-sm text-white hover:bg-zinc-800 dark:bg-white dark:text-black">
              Khám phá phim
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {favorites.map((f) => (
              <div key={f._id} className="transition hover:scale-[1.03]">
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
