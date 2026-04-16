"use client";

import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { Play, Info, ChevronRight, Star, Clock3, Sparkles } from "lucide-react";
import React from "react";

// Swiper for Carousel
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// --- Variants (Giữ nguyên logic của bạn) ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 100, damping: 15 },
  },
};

export default function HomeClient({ collections }: { collections: any[] }) {
  const active = collections.filter((c) => c?.is_active);
  const heroMovie = active?.[0]?.movies?.[0] ?? null;

  // Parallax Effect
  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 500], [0, 150]);
  const opacityHero = useTransform(scrollY, [0, 400], [1, 0.3]);

  return (
    <div className="min-h-screen transition-colors duration-500 bg-white dark:bg-[#050505] text-zinc-900 dark:text-zinc-100 selection:bg-red-500/30">
      {/* 1. HERO SECTION - CỰC PHẨM THỊ GIÁC */}
      {heroMovie?.backdrop && (
        <section className="relative h-[90vh] w-full overflow-hidden">
          {/* Background with Adaptive Opacity */}
          <motion.img
            style={{ y: yParallax, opacity: opacityHero }}
            src={heroMovie.backdrop}
            alt={heroMovie.title}
            className="absolute inset-0 h-[115%] w-full object-cover"
          />

          {/* Cinematic Adaptive Gradients: Tự đổi màu theo theme */}
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent dark:from-[#050505] dark:via-black/30 dark:to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/40 to-transparent dark:from-black dark:via-black/20 dark:to-transparent" />

          {/* Hero Content */}
          <motion.div
            className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-28"
            initial="hidden"
            animate="visible"
            variants={containerVariants}>
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-3 mb-6">
              <span className="h-1 w-12 rounded-full bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.5)]" />
              <p className="text-[10px] font-black text-red-600 dark:text-red-500 uppercase tracking-[0.5em]">
                {active[0]?.name ?? "Featured Content"}
              </p>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-6xl font-[1000] leading-[0.9] sm:text-8xl xl:text-9xl tracking-tighter text-zinc-900 dark:text-white drop-shadow-sm">
              {heroMovie.title.toUpperCase()}
            </motion.h1>

            <motion.div
              variants={itemVariants}
              className="flex items-center gap-6 mt-8 font-black text-[11px] tracking-widest text-zinc-600 dark:text-zinc-400">
              <div className="flex items-center gap-2 bg-zinc-900/5 dark:bg-white/10 px-3 py-1.5 rounded-lg border border-zinc-900/10 dark:border-white/10">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>8.9 CRITICS</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock3 className="w-3.5 h-3.5" />
                <span>{heroMovie.duration || 120} MIN</span>
              </div>
              <span className="px-2 py-0.5 border border-zinc-400 dark:border-zinc-700 rounded text-[9px]">
                4K HDR
              </span>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="mt-8 max-w-xl text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium line-clamp-2 md:line-clamp-none">
              {heroMovie.description}
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="mt-10 flex flex-wrap gap-5">
              <Link
                href={`/movies/${heroMovie.slug}`}
                className="group relative overflow-hidden rounded-2xl bg-zinc-900 dark:bg-white px-10 py-5 text-sm font-black text-white dark:text-black transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-zinc-900/20 dark:shadow-white/10 flex items-center gap-3">
                <Play className="w-5 h-5 fill-current" />
                WATCH NOW
              </Link>

              <Link
                href={`/movies/${heroMovie.slug}`}
                className="group rounded-2xl border-2 border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-white/5 px-10 py-5 text-sm font-black transition-all hover:bg-zinc-100 dark:hover:bg-white/10 backdrop-blur-xl flex items-center gap-3">
                <Info className="w-5 h-5" />
                DETAILS
              </Link>
            </motion.div>
          </motion.div>
        </section>
      )}

      {/* 2. MAIN CONTENT AREA - GRID VÀ CAROUSEL */}
      <div className="relative z-20 mx-auto max-w-[1440px] px-6 py-20">
        {active.map((collection, index) => (
          <motion.section
            key={collection._id}
            className="mb-24 last:mb-0"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}>
            <div className="mb-10 flex items-end justify-between px-2">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-red-600 dark:text-red-500 font-black text-[10px] tracking-widest uppercase">
                  <Sparkles size={12} /> Special Collection
                </div>
                <h2 className="text-4xl font-[1000] tracking-tighter uppercase dark:text-white">
                  {collection.name}
                </h2>
              </div>
              <Link
                href={`/collections/${collection.slug}`}
                className="group flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-red-600 transition-colors">
                Explore More
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5" />
              </Link>
            </div>

            {/* Movie Carousel */}
            <div className="group/swiper relative">
              <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={24}
                slidesPerView={2}
                speed={800}
                breakpoints={{
                  640: { slidesPerView: 3 },
                  768: { slidesPerView: 4 },
                  1024: { slidesPerView: 5 },
                  1440: { slidesPerView: 6.5 },
                }}
                navigation={{
                  nextEl: `.next-${index}`,
                  prevEl: `.prev-${index}`,
                }}
                className="!overflow-visible">
                {collection.movies.map((movie: any) => (
                  <SwiperSlide key={movie._id} className="py-6">
                    <MovieCardCustom movie={movie} />
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Navigation Buttons - Tàng hình ở Light, Hiện rõ ở Dark */}
              <button
                className={`prev-${index} absolute -left-4 top-1/2 -translate-y-1/2 z-40 w-12 h-12 bg-white dark:bg-zinc-900 shadow-2xl rounded-full flex items-center justify-center border border-zinc-200 dark:border-white/10 opacity-0 group-hover/swiper:opacity-100 transition-all hover:scale-110 active:scale-90`}>
                <ChevronRight className="w-6 h-6 rotate-180" />
              </button>
              <button
                className={`next-${index} absolute -right-4 top-1/2 -translate-y-1/2 z-40 w-12 h-12 bg-white dark:bg-zinc-900 shadow-2xl rounded-full flex items-center justify-center border border-zinc-200 dark:border-white/10 opacity-0 group-hover/swiper:opacity-100 transition-all hover:scale-110 active:scale-90`}>
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </motion.section>
        ))}
      </div>
    </div>
  );
}

// 3. MOVIE CARD CUSTOM - "THE NESTED SCALE EFFECT"
function MovieCardCustom({ movie }: { movie: any }) {
  return (
    <motion.div
      className="group relative rounded-3xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 shadow-sm transition-all duration-500"
      whileHover={{
        scale: 1.1,
        y: -10,
        zIndex: 50,
        transition: { type: "spring", stiffness: 400, damping: 25 },
      }}>
      <div className="aspect-[2/3] w-full relative">
        <img
          src={movie.thumbnail}
          alt={movie.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Overlay phủ khi hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
      </div>

      {/* Info hiện ra khi Hover (Phong cách Modern Glass) */}
      <div className="absolute inset-x-0 bottom-0 p-5 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
        <h3 className="text-sm font-[1000] text-white leading-tight uppercase tracking-tighter line-clamp-2">
          {movie.title}
        </h3>

        <div className="flex items-center gap-3 mt-3">
          <div className="flex items-center gap-1 text-[10px] font-black text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-md">
            <Star size={10} className="fill-current" />
            <span>8.5</span>
          </div>
          <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">
            124 MIN
          </span>
        </div>

        <Link
          href={`/movies/${movie.slug}`}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-white py-2.5 text-[10px] font-black text-black transition-all hover:bg-red-600 hover:text-white">
          <Play size={12} className="fill-current" />
          PLAY MOVIE
        </Link>
      </div>

      <Link href={`/movies/${movie.slug}`} className="absolute inset-0 z-0" />
    </motion.div>
  );
}
