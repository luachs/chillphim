import Link from "next/link";
import { Play, Star, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

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

export function MovieCard({
  movie,
  className,
}: {
  movie: MovieCardData;
  className?: string;
}) {
  const genreNames = getGenreNames(movie.genres);

  return (
    <motion.div
      whileHover={{ y: -10 }} // Thẻ nổi lên khi hover
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn("group relative", className)}>
      <Link
        href={`/movies/${movie.slug}`}
        className="block relative overflow-hidden rounded-2xl bg-zinc-900 shadow-2xl transition-all duration-500 hover:shadow-indigo-500/20">
        {/* Aspect Ratio Container (Tỷ lệ 2:3 chuẩn poster phim) */}
        <div className="relative aspect-[2/3] w-full overflow-hidden">
          {/* Main Image */}
          <img
            src={movie.thumbnail}
            alt={movie.title}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 group-hover:rotate-1"
          />

          {/* Hiệu ứng Shine (Vệt sáng quét qua) khi hover */}
          <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent z-10" />

          {/* Cinematic Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Top Info (Rating Badge) */}
          {movie.rating && (
            <div className="absolute top-3 right-3 z-20">
              <div className="flex items-center gap-1 rounded-lg bg-black/60 px-2 py-1 backdrop-blur-md border border-white/10">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-[11px] font-black text-white">
                  {movie.rating.toFixed(1)}
                </span>
              </div>
            </div>
          )}

          {/* Play Button Overlay (Nổi bật ở giữa) */}
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="flex h-14 w-14 scale-75 items-center justify-center rounded-full bg-indigo-600 text-white opacity-0 shadow-[0_0_30px_rgba(79,70,229,0.6)] transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
              <Play className="h-7 w-7 fill-current ml-1" />
            </div>
          </div>

          {/* Bottom Content Info */}
          <div className="absolute bottom-0 left-0 right-0 p-5 z-20 transform translate-y-4 transition-transform duration-500 group-hover:translate-y-0">
            {/* Genres */}
            <div className="flex flex-wrap gap-1.5 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
              {genreNames.slice(0, 2).map((g) => (
                <Badge key={g}>{g}</Badge>
              ))}
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold leading-tight text-white line-clamp-2 drop-shadow-lg uppercase tracking-tight">
              {movie.title}
            </h3>

            {/* Metadata (Duration) */}
            <div className="mt-3 flex items-center gap-3 text-zinc-400 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
              {movie.duration && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{movie.duration} phút</span>
                </div>
              )}
              <span className="h-1 w-1 rounded-full bg-indigo-500" />
              <span className="text-indigo-400 font-bold uppercase tracking-tighter">
                Xem ngay
              </span>
            </div>
          </div>
        </div>
      </Link>

      {/* Hiệu ứng bóng đổ ảo phía dưới */}
      <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-10" />
    </motion.div>
  );
}
