"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  Play,
  Clock,
  Star,
  Share2,
  Info,
  Ticket,
  Sparkles,
  Monitor,
  ChevronDown,
  Calendar,
  Languages,
  AlertCircle,
} from "lucide-react";

import { apiFetch } from "@/lib/api-client";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { FavoriteButton } from "@/components/movies/FavoriteButton";
import { CommentsSection } from "@/components/comments/CommentsSection";

interface Movie {
  _id: string;
  title: string;
  backdrop: string;
  video_url: string;
  duration: number;
  genres: Array<{ _id: string; name: string }>;
  description: string;
}

function getEmbedUrl(url: string): string {
  if (!url || url.trim() === "" || url === "null") {
    return "";
  }
  // Handle YouTube URLs
  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    const videoId = url.includes("youtu.be")
      ? url.split("youtu.be/")[1]?.split("?")[0]
      : url.split("v=")[1]?.split("&")[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }
  // Return URL as-is for other sources
  return url;
}

export default function MovieDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [movie, setMovie] = React.useState<Movie | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [showPlayer, setShowPlayer] = React.useState(false);
  const [urlError, setUrlError] = React.useState(false); // State kiểm tra URL hỏng

  const { scrollY } = useScroll();
  const titleY = useTransform(scrollY, [0, 400], [0, -40]);

  React.useEffect(() => {
    if (!slug) return;
    setLoading(true);
    apiFetch<{ data: Movie }>(`/api/movies/${slug}`)
      .then((res) => setMovie(res.data))
      .catch(() => setMovie(null))
      .finally(() => setLoading(false));
  }, [slug]);

  // HÀM XỬ LÝ PLAY VIDEO (Nâng cấp check URL)
  const handlePlayClick = () => {
    if (
      !movie?.video_url ||
      movie.video_url.trim() === "" ||
      movie.video_url === "null"
    ) {
      setUrlError(true);
      setTimeout(() => setUrlError(false), 4000); // Tự tắt thông báo sau 4s
      return;
    }
    setShowPlayer(true);
    document
      .getElementById("video-player")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  if (loading || !movie) {
    return <MovieDetailSkeleton />;
  }

  // Tự động điều chỉnh kích thước font để không bao giờ bị tràn/che
  const responsiveTitleSize = (title: string) => {
    if (title.length > 30) return "text-3xl md:text-5xl lg:text-6xl";
    if (title.length > 15) return "text-4xl md:text-7xl lg:text-8xl";
    return "text-6xl md:text-8xl lg:text-[9rem]";
  };

  return (
    <div className="relative min-h-screen bg-white dark:bg-[#050505] text-zinc-900 dark:text-zinc-100 transition-colors duration-500 selection:bg-indigo-500/30">
      {/* 1. HERO SECTION - CHIỀU SÂU VÔ TẬN */}
      <section className="relative h-screen w-full overflow-hidden">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2 }}
          className="absolute inset-0">
          <img
            src={movie.backdrop}
            alt=""
            className="h-full w-full object-cover"
          />
          {/* Lớp phủ đa tầng: Bảo vệ tiêu đề khỏi bị chìm vào backdrop */}
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent dark:from-[#050505] dark:via-[#050505]/60" />
          <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-transparent to-transparent dark:from-black/40" />
        </motion.div>

        {/* Content Overlay */}
        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-28">
          <motion.div style={{ y: titleY }}>
            <div className="flex flex-wrap gap-2 mb-6">
              {movie.genres?.map((g) => (
                <Badge
                  key={g._id}
                  className="bg-indigo-600/10 text-indigo-600 dark:bg-white/10 dark:text-white border-indigo-500/20 backdrop-blur-xl px-4 py-1.5 text-[10px] uppercase font-black tracking-widest">
                  {g.name}
                </Badge>
              ))}
            </div>

            {/* TIÊU ĐỀ: Đã fix triệt để việc bị che */}
            <h1
              className={`font-[1000] tracking-[-0.04em] leading-[0.85] uppercase mb-8 ${responsiveTitleSize(movie.title)}`}>
              <span className="block drop-shadow-[0_10px_20px_rgba(0,0,0,0.1)] dark:drop-shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
                {movie.title}
              </span>
            </h1>

            {/* Metadata Badges */}
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-3 bg-zinc-900/5 dark:bg-white/5 p-1 rounded-2xl border border-zinc-900/10 dark:border-white/10 backdrop-blur-md">
                <div className="bg-white dark:bg-zinc-800 px-4 py-2 rounded-xl shadow-sm flex items-center gap-2">
                  <Star size={16} className="text-amber-500 fill-amber-500" />
                  <span className="text-sm font-black">8.9</span>
                </div>
                <div className="pr-4 flex items-center gap-2 text-[11px] font-bold opacity-60 uppercase tracking-tighter">
                  <Clock size={14} /> {movie.duration} MIN
                </div>
              </div>
              <div className="hidden md:flex items-center gap-2 text-[10px] font-black tracking-[0.2em] opacity-40 uppercase">
                <Monitor size={14} /> 4K Ultra HD • Surround 7.1
              </div>
            </div>

            {/* Button Actions + Error Message */}
            <div className="mt-12 relative">
              <div className="flex flex-wrap gap-5">
                <motion.button
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePlayClick}
                  className="group flex items-center gap-4 rounded-[2rem] bg-indigo-600 px-12 py-5 font-black text-white shadow-2xl shadow-indigo-600/30 hover:bg-indigo-500 transition-all">
                  <div className="bg-white/20 p-2 rounded-full group-hover:scale-110 transition-transform">
                    <Play className="fill-current" size={20} />
                  </div>
                  START WATCHING
                </motion.button>

                <div className="flex gap-4">
                  <FavoriteButton movieId={movie._id} />
                  <button className="flex h-16 w-16 items-center justify-center rounded-full border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-white/5 backdrop-blur-xl hover:bg-white dark:hover:bg-zinc-800 transition-all shadow-xl">
                    <Share2 size={20} />
                  </button>
                </div>
              </div>

              {/* THÔNG BÁO URL HỎNG (Xịn sò) */}
              <AnimatePresence>
                {urlError && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="absolute -top-16 left-0 flex items-center gap-3 bg-red-500 text-white px-6 py-3 rounded-2xl font-bold shadow-2xl shadow-red-500/40 border border-red-400">
                    <AlertCircle size={20} />
                    Link video hiện đang bảo trì hoặc bị hỏng!
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. THEATER MODE PLAYER - Giao diện nổi */}
      <section
        id="video-player"
        className="relative z-20 mx-auto -mt-24 max-w-7xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="group relative overflow-hidden rounded-[3.5rem] p-1 bg-gradient-to-b from-white/20 to-transparent dark:from-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]">
          <div className="relative aspect-video w-full overflow-hidden rounded-[3.4rem] bg-[#0a0a0c]">
            {!showPlayer ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <img
                  src={movie.backdrop}
                  className="absolute inset-0 h-full w-full object-cover blur-2xl opacity-20 scale-110"
                  alt=""
                />
                <button
                  onClick={handlePlayClick}
                  className="relative group/play flex h-28 w-28 items-center justify-center rounded-full bg-white text-black transition-all hover:scale-110 shadow-2xl">
                  <div className="absolute inset-0 animate-ping rounded-full bg-white opacity-20" />
                  <Play
                    size={40}
                    className="fill-current ml-2 group-hover/play:text-indigo-600"
                  />
                </button>
                <p className="mt-8 text-[10px] font-black uppercase tracking-[0.5em] text-white/50">
                  Cinematic Experience
                </p>
              </div>
            ) : (
              <iframe
                className="h-full w-full"
                src={getEmbedUrl(movie.video_url)}
                allowFullScreen
              />
            )}
          </div>
        </motion.div>
      </section>

      {/* 3. DETAILS & CONTENT - UI Tạp chí điện ảnh */}
      <section className="mx-auto mt-32 max-w-7xl px-6 pb-20">
        <div className="grid grid-cols-1 gap-20 lg:grid-cols-12">
          {/* Main Content */}
          <div className="lg:col-span-8">
            <div className="space-y-12">
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <div className="h-2 w-8 rounded-full bg-indigo-600" />
                  <h3 className="text-xl font-black uppercase tracking-[0.2em] opacity-50">
                    The Narrative
                  </h3>
                </div>
                <p className="text-2xl font-medium leading-[1.6] text-zinc-600 dark:text-zinc-400 first-letter:text-7xl first-letter:font-black first-letter:text-indigo-600 first-letter:mr-4 first-letter:float-left">
                  {movie.description}
                </p>
              </div>

              <div className="pt-12 border-t border-zinc-100 dark:border-white/5">
                <div className="flex items-center gap-3 mb-10">
                  <Sparkles size={24} className="text-amber-500" />
                  <h3 className="text-2xl font-black uppercase tracking-tighter">
                    User Experience
                  </h3>
                </div>
                <CommentsSection movieId={movie._id} />
              </div>
            </div>
          </div>

          {/* Sidebar - Glass Card */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-8">
              <div className="rounded-[3rem] border border-zinc-200 dark:border-white/5 bg-zinc-50/50 dark:bg-zinc-900/40 p-10 backdrop-blur-3xl shadow-2xl shadow-zinc-200/50 dark:shadow-none">
                <h4 className="flex items-center gap-3 font-black text-xl uppercase tracking-tighter mb-10">
                  <Info size={20} className="text-indigo-600" /> Data Sheet
                </h4>

                <div className="space-y-8">
                  <DetailItem label="Official Title" value={movie.title} />
                  <DetailItem
                    label="Status"
                    value="Streaming in 4K"
                    isSuccess
                  />
                  <DetailItem label="Audio" value="Dolby Atmos / Stereo" />
                </div>

                <button className="mt-12 w-full flex items-center justify-center gap-3 rounded-[2rem] bg-zinc-900 dark:bg-white py-5 font-black text-white dark:text-black hover:bg-indigo-600 hover:text-white transition-all shadow-xl">
                  <Ticket size={20} /> GET TICKETS
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Sub-components để sạch code
function DetailItem({
  label,
  value,
  isSuccess,
}: {
  label: string;
  value: string;
  isSuccess?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
        {label}
      </span>
      <span
        className={`text-sm font-bold ${isSuccess ? "text-emerald-500" : ""}`}>
        {value}
      </span>
    </div>
  );
}

function MovieDetailSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 space-y-8 bg-white dark:bg-[#050505]">
      <Skeleton className="h-[80vh] w-full rounded-[4rem]" />
      <div className="flex gap-10">
        <div className="flex-1 space-y-4">
          <Skeleton className="h-20 w-3/4 rounded-3xl" />
          <Skeleton className="h-40 w-full rounded-3xl" />
        </div>
      </div>
    </div>
  );
}
