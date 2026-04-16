"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Film, Filter, ChevronRight } from "lucide-react";

import { apiFetch } from "@/lib/api-client";
import { MovieCard } from "@/components/movies/MovieCard";
import { MovieCardSkeleton } from "@/components/skeleton/MovieCardSkeleton";
import { cn } from "@/lib/utils"; // Giả định bạn dùng shadcn hoặc tailwind-merge
import { GenreButton } from "@/components/ui/genre-button";

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
  const [selectedGenreId, setSelectedGenreId] = React.useState<string | "all">(
    "all",
  );

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [moviesRes, genresRes] = await Promise.all([
          apiFetch<{ data: Movie[] }>("/api/movies"),
          apiFetch<{ data: Genre[] }>("/api/genres"),
        ]);
        setMovies(moviesRes.data);
        setGenres(genresRes.data);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredMovies = React.useMemo(() => {
    return selectedGenreId === "all"
      ? movies
      : movies.filter((m) => m.genres.some((g) => g._id === selectedGenreId));
  }, [selectedGenreId, movies]);

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#09090b] transition-colors duration-500">
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Header Section */}
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-2 mb-2 text-primary font-medium">
              <Film className="w-5 h-5" />
              <span className="text-sm uppercase tracking-widest">
                Cinema Hub
              </span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter text-zinc-900 dark:text-zinc-50 lg:text-6xl">
              Khám Phá <span className="text-indigo-600">Phim Hay</span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-zinc-500 text-sm font-medium">
            <span>{filteredMovies.length} kết quả</span>
            <ChevronRight className="w-4 h-4" />
          </motion.div>
        </header>

        {/* Categories Bar */}
        <div className="sticky top-4 z-40 mb-10 overflow-hidden">
          <motion.div
            className="flex flex-wrap items-center gap-3 p-2 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}>
            <div className="px-3 flex items-center gap-2 text-zinc-400 border-r border-zinc-200 dark:border-zinc-800 mr-1">
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline text-xs font-bold uppercase">
                Thể loại:
              </span>
            </div>

            <GenreButton
              active={selectedGenreId === "all"}
              onClick={() => setSelectedGenreId("all")}
              label="Tất cả"
            />

            {genres.map((g) => (
              <GenreButton
                key={g._id}
                active={selectedGenreId === g._id}
                onClick={() => setSelectedGenreId(g._id)}
                label={g.name}
              />
            ))}
          </motion.div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <MovieCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <motion.div
            layout
            className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            <AnimatePresence mode="popLayout">
              {filteredMovies.map((movie) => (
                <motion.div
                  key={movie._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{
                    opacity: 0,
                    scale: 0.9,
                    transition: { duration: 0.2 },
                  }}
                  transition={{
                    duration: 0.4,
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                  }}>
                  <MovieCard movie={movie} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && filteredMovies.length === 0 && (
          <div className="text-center py-20">
            <p className="text-zinc-500 text-lg">
              Không tìm thấy bộ phim nào thuộc thể loại này.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
