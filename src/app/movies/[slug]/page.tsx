"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Genre {
  _id: string;
  name: string;
}

interface Movie {
  title: string;
  description: string;
  backdrop: string;
  video_url: string;
  genres: Genre[];
  duration: number;
}

export default function MovieDetailPage() {
  const { slug } = useParams();
  const [movie, setMovie] = useState<Movie | null>(null);

  useEffect(() => {
    if (!slug) return;

    fetch(`http://localhost:3000/api/movies/${slug}`)
      .then((res) => res.json())
      .then((data) => setMovie(data.data));
  }, [slug]);

  if (!movie) return <p>Loading...</p>;

  // 🔥 Convert YouTube URL → Embed URL
  const getEmbedUrl = (url: string) => {
    try {
      const videoId = new URL(url).searchParams.get("v");
      return `https://www.youtube.com/embed/${videoId}`;
    } catch {
      return url;
    }
  };

  return (
    <div className="p-6">
      {/* BACKDROP */}
      <img
        src={movie.backdrop}
        alt={movie.title}
        className="w-full h-[400px] object-cover rounded-xl mb-6"
      />

      {/* TITLE */}
      <h1 className="text-2xl font-bold mb-2">{movie.title}</h1>

      {/* GENRES */}
      <p className="text-sm text-gray-500 mb-4">
        {movie.genres.map((g) => g.name).join(", ")}
      </p>

      {/* DESCRIPTION */}
      <p className="mb-6 whitespace-pre-line">{movie.description}</p>

      {/* YOUTUBE VIDEO */}
      <div className="aspect-video w-full">
        <iframe
          className="w-full h-full rounded-xl"
          src={getEmbedUrl(movie.video_url)}
          title="YouTube video"
          allowFullScreen></iframe>
      </div>

      {/* EXTRA */}
      <p className="mt-4 text-sm">Duration: {movie.duration} phút</p>
    </div>
  );
}
