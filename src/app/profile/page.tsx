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
  const [user, setUser] = React.useState<
    ReturnType<typeof getStoredAuthUser>
  >(null);
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
      <div className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Profile
        </h1>
        <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
          Bạn cần đăng nhập để xem danh sách yêu thích.
        </p>
        <div className="mt-6">
          <Link
            href="/login"
            className="inline-flex h-10 items-center justify-center rounded-md bg-zinc-900 px-4 text-sm font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            {user.username}
          </h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Role: {user.role}
          </p>
        </div>
        <div className="text-sm text-zinc-500 dark:text-zinc-400">
          Favorites: <span className="font-semibold">{favorites.length}</span>
        </div>
      </div>

      <div className="mt-8">
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <MovieCardSkeleton key={i} />
            ))}
          </div>
        ) : favorites.length === 0 ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Chưa có phim yêu thích. Hãy mở một phim bất kỳ và bấm “Thích”.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {favorites.map((f) => (
              <MovieCard
                key={f._id}
                movie={{
                  _id: f.movie._id,
                  title: f.movie.title,
                  thumbnail: f.movie.thumbnail,
                  slug: f.movie.slug,
                  genres: f.movie.genres,
                  duration: f.movie.duration,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

