"use client";

import * as React from "react";
import Link from "next/link";

import { apiFetch } from "@/lib/api-client";
import { MovieCard } from "@/components/movies/MovieCard";
import { MovieCardSkeleton } from "@/components/skeleton/MovieCardSkeleton";

type Movie = {
  _id: string;
  title: string;
  thumbnail: string;
  backdrop?: string;
  slug: string;
  duration?: number;
  description?: string;
  video_url?: string;
  genres?: Array<{ _id: string; name: string } | string>;
};

type Collection = {
  _id: string;
  name: string;
  slug: string;
  movies: Movie[];
  is_active: boolean;
};

export default function Home() {
  const [collections, setCollections] = React.useState<Collection[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    apiFetch<{ data: Collection[] }>("/api/collections")
      .then((res) => setCollections(res.data))
      .catch(() => setCollections([]))
      .finally(() => setLoading(false));
  }, []);

  const active = collections.filter((c) => c.is_active);
  const heroMovie = active[0]?.movies?.[0];

  return (
    <div className="relative">
      {heroMovie?.backdrop ? (
        <section className="relative">
          <img
            src={heroMovie.backdrop}
            alt={heroMovie.title}
            className="h-[420px] w-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent" />

          <div className="relative mx-auto max-w-6xl px-4 pb-10 pt-12">
            <p className="text-sm text-zinc-200/80">
              {active[0]?.name ?? "Featured"}
            </p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              {heroMovie.title}
            </h1>
            {heroMovie.description ? (
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-200/80">
                {heroMovie.description}
              </p>
            ) : null}

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={`/movies/${heroMovie.slug}`}
                className="inline-flex h-10 items-center justify-center rounded-md bg-white px-4 text-sm font-medium text-black transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400">
                Play
              </Link>
              <Link
                href="/movies"
                className="inline-flex h-10 items-center justify-center rounded-md border border-white/20 bg-white/5 px-4 text-sm font-medium text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20">
                Browse movies
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      <div className="mx-auto max-w-6xl px-4 pb-12 pt-10">
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <MovieCardSkeleton key={i} />
            ))}
          </div>
        ) : null}

        {!loading &&
          active.map((collection) => (
            <section key={collection._id} className="mt-10">
              <div className="mb-4 flex items-end justify-between gap-3">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                  {collection.name}
                </h2>
                <Link
                  href="/movies"
                  className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
                  View all
                </Link>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {collection.movies.slice(0, 12).map((movie) => (
                  <MovieCard
                    key={movie._id}
                    movie={{
                      _id: movie._id,
                      title: movie.title,
                      thumbnail: movie.thumbnail,
                      slug: movie.slug,
                      duration: movie.duration,
                      genres: movie.genres,
                    }}
                  />
                ))}
              </div>
            </section>
          ))}
      </div>
    </div>
  );
}

