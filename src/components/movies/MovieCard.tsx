import Link from "next/link";
import { Play } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

type MovieGenre =
  | {
      _id: string;
      name: string;
      slug?: string;
    }
  | string;

export type MovieCardData = {
  _id: string;
  title: string;
  thumbnail: string;
  slug: string;
  genres?: MovieGenre[];
  duration?: number;
  rating?: number;
};

function getGenreNames(genres: MovieGenre[] | undefined) {
  if (!genres) return [];
  return genres
    .map((g) => (typeof g === "string" ? null : g.name))
    .filter(Boolean) as string[];
}

export function MovieCard({ movie, className }: { movie: MovieCardData; className?: string }) {
  const genreNames = getGenreNames(movie.genres);

  return (
    <Link
      href={`/movies/${movie.slug}`}
      className={cn(
        "group relative overflow-hidden rounded-xl border border-zinc-200/60 bg-white/5 shadow-sm",
        "dark:border-zinc-800/60",
        className,
      )}>
      <div className="relative">
        <img
          src={movie.thumbnail}
          alt={movie.title}
          className="h-56 w-full object-cover transition-transform duration-300 group-hover:scale-[1.06]"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-black shadow-lg ring-1 ring-white/60">
            <Play className="h-5 w-5 fill-black/0" />
          </div>
        </div>
      </div>

      <div className="space-y-1 p-3">
        <div className="truncate font-semibold text-zinc-900 dark:text-zinc-50">
          {movie.title}
        </div>

        {genreNames.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {genreNames.slice(0, 2).map((g) => (
              <Badge key={g} className="bg-white/20 border-zinc-200/40">
                {g}
              </Badge>
            ))}
          </div>
        ) : (
          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            {movie.duration ? `${movie.duration} phút` : " "}
          </div>
        )}
      </div>
    </Link>
  );
}

