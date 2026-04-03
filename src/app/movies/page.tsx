"use client";
import * as React from "react";

import { apiFetch } from "@/lib/api-client";
import { MovieCard } from "@/components/movies/MovieCard";
import { MovieCardSkeleton } from "@/components/skeleton/MovieCardSkeleton";

type Genre = { _id: string; name: string };

type Movie = {
  _id: string;
  title: string;
  thumbnail: string;
  slug: string;
  genres: Genre[];
  duration?: number;
  rating?: number;
};

export default function MovieListPage() {
  const [movies, setMovies] = React.useState<Movie[]>([]);
  const [genres, setGenres] = React.useState<Genre[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedGenreId, setSelectedGenreId] = React.useState<
    string | "all"
  >("all");

  React.useEffect(() => {
    Promise.all([
      apiFetch<{ data: Movie[] }>("/api/movies"),
      apiFetch<{ data: Genre[] }>("/api/genres"),
    ])
      .then(([moviesRes, genresRes]) => {
        setMovies(moviesRes.data);
        setGenres(genresRes.data);
      })
      .catch(() => {
        setMovies([]);
        setGenres([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    selectedGenreId === "all"
      ? movies
      : movies.filter((m) =>
          m.genres.some((g) => g._id === selectedGenreId),
        );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Movies
        </h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Hover để hiện nút Play, click để mở trang chi tiết.
        </p>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedGenreId("all")}
          className={
            selectedGenreId === "all"
              ? "rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white dark:bg-zinc-50 dark:text-zinc-900"
              : "rounded-full border border-zinc-200 bg-white/30 px-4 py-2 text-sm text-zinc-700 hover:bg-white/60 dark:border-zinc-800 dark:bg-zinc-950/30 dark:text-zinc-200 dark:hover:bg-zinc-950/60"
          }>
          All
        </button>

        {genres.map((g) => (
          <button
            key={g._id}
            onClick={() => setSelectedGenreId(g._id)}
            className={
              selectedGenreId === g._id
                ? "rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white dark:bg-zinc-50 dark:text-zinc-900"
                : "rounded-full border border-zinc-200 bg-white/30 px-4 py-2 text-sm text-zinc-700 hover:bg-white/60 dark:border-zinc-800 dark:bg-zinc-950/30 dark:text-zinc-200 dark:hover:bg-zinc-950/60"
            }>
            {g.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 16 }).map((_, i) => (
            <MovieCardSkeleton key={i} />
          ))}
        </div>
      ) : null}

      {!loading ? (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((movie) => (
            <MovieCard
              key={movie._id}
              movie={{
                _id: movie._id,
                title: movie.title,
                thumbnail: movie.thumbnail,
                slug: movie.slug,
                genres: movie.genres,
                duration: movie.duration,
                rating: movie.rating,
              }}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
