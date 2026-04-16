"use client";

import Link from "next/link";

type Movie = {
  _id: string;
  title: string;
  thumbnail: string;
  backdrop?: string;
  slug: string;
  duration?: number;
  description?: string;
};

type Collection = {
  _id: string;
  name: string;
  slug: string;
  movies: Movie[];
  is_active: boolean;
};

export default function HomeClient({
  collections,
}: {
  collections: Collection[];
}) {
  const active = collections.filter((c) => c?.is_active);
  const heroMovie = active?.[0]?.movies?.[0] ?? null;

  return (
    <div className="bg-black text-white">
      {/* HERO */}
      {heroMovie?.backdrop && (
        <section className="relative h-[75vh] w-full overflow-hidden">
          <img
            src={heroMovie.backdrop}
            alt={heroMovie.title}
            className="absolute inset-0 h-full w-full object-cover scale-110 blur-sm opacity-40"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

          <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-end px-6 pb-12">
            <p className="text-sm text-red-400 uppercase tracking-widest">
              {active[0]?.name ?? "Featured"}
            </p>

            <h1 className="mt-2 text-4xl font-extrabold leading-tight sm:text-6xl">
              {heroMovie.title}
            </h1>

            {heroMovie.description && (
              <p className="mt-4 max-w-xl text-zinc-300 line-clamp-3">
                {heroMovie.description}
              </p>
            )}

            <div className="mt-6 flex gap-4">
              <Link
                href={`/movies/${heroMovie.slug}`}
                className="rounded-lg bg-red-600 px-6 py-3 text-sm font-semibold hover:bg-red-500 transition shadow-lg">
                ▶ Play Now
              </Link>

              <Link
                href="/movies"
                className="rounded-lg border border-white/30 px-6 py-3 text-sm hover:bg-white/10 transition">
                Browse
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CONTENT */}
      <div className="mx-auto max-w-6xl px-6 py-10">
        {active.map((collection) => (
          <section key={collection._id} className="mb-12">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-2xl font-bold">{collection.name}</h2>
              <Link
                href="/movies"
                className="text-sm text-zinc-400 hover:text-white">
                View all →
              </Link>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {collection.movies.slice(0, 12).map((movie) => (
                <div
                  key={movie._id}
                  className="group relative overflow-hidden rounded-xl transition-transform hover:scale-105">
                  <img
                    src={movie.thumbnail}
                    alt={movie.title}
                    className="h-[260px] w-full object-cover"
                  />

                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition flex flex-col justify-end p-4">
                    <h3 className="text-sm font-semibold line-clamp-2">
                      {movie.title}
                    </h3>

                    <Link
                      href={`/movies/${movie.slug}`}
                      className="mt-2 text-xs text-red-400">
                      ▶ Watch now
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
