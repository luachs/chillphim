"use client";
import * as React from "react";
import { useParams } from "next/navigation";

import { apiFetch } from "@/lib/api-client";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { FavoriteButton } from "@/components/movies/FavoriteButton";
import { CommentsSection } from "@/components/comments/CommentsSection";

type Genre = {
  _id: string;
  name: string;
  slug?: string;
};

type Movie = {
  _id: string;
  title: string;
  description: string;
  backdrop: string;
  thumbnail?: string;
  video_url: string;
  genres: Genre[];
  duration: number;
  slug: string;
};

function getEmbedUrl(url: string) {
  try {
    const u = new URL(url);

    // youtube.com/watch?v=...
    if (u.hostname.includes("youtube.com")) {
      const videoId = u.searchParams.get("v");
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }

    // youtu.be/VIDEO_ID
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.replace("/", "");
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
  } catch {
    // ignore
  }

  return url;
}

export default function MovieDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [movie, setMovie] = React.useState<Movie | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!slug) return;
    setLoading(true);

    apiFetch<{ data: Movie }>(`/api/movies/${slug}`)
      .then((res) => setMovie(res.data))
      .catch(() => setMovie(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading || !movie) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <Skeleton className="h-[380px] w-full rounded-2xl" />
        <div className="mt-6 space-y-3">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="aspect-video w-full rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <section className="relative overflow-hidden rounded-2xl border border-zinc-200/60 bg-zinc-900/20">
        <img
          src={movie.backdrop}
          alt={movie.title}
          className="h-[420px] w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />

        <div className="relative p-6 md:p-10">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <div className="flex flex-wrap gap-2">
                {movie.genres?.slice(0, 4).map((g) => (
                  <Badge
                    key={g._id}
                    className="bg-white/10 border-white/10 text-zinc-200">
                    {g.name}
                  </Badge>
                ))}
              </div>

              <h1 className="mt-3 text-3xl font-bold tracking-tight text-white md:text-4xl">
                {movie.title}
              </h1>

              <div className="mt-2 flex flex-wrap items-center gap-3">
                <p className="text-sm text-zinc-200/80">
                  Duration: {movie.duration} phút
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <FavoriteButton movieId={movie._id} />
              <a
                href="#video"
                className="inline-flex items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-white/90">
                Watch
              </a>
            </div>
          </div>

          {movie.description ? (
            <p className="mt-6 max-w-3xl whitespace-pre-line text-sm leading-relaxed text-zinc-200/90">
              {movie.description}
            </p>
          ) : null}
        </div>
      </section>

      <section id="video" className="mt-8">
        <div className="aspect-video w-full overflow-hidden rounded-xl border border-zinc-200/60 bg-black/20">
          <iframe
            className="h-full w-full"
            src={getEmbedUrl(movie.video_url)}
            title={movie.title}
            allowFullScreen
          />
        </div>
      </section>

      <CommentsSection movieId={movie._id} />
    </div>
  );
}
