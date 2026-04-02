"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Genre {
  _id: string;
  name: string;
}

interface Movie {
  _id: string;
  title: string;
  thumbnail: string;
  slug: string;
  genres: Genre[];
}

export default function MovieListPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/api/movies")
      .then((res) => res.json())
      .then((data) => {
        setMovies(data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
      {movies.map((movie) => (
        <Link key={movie._id} href={`/movies/${movie.slug}`}>
          <div className="border rounded-xl overflow-hidden shadow hover:scale-105 transition">
            <img
              src={movie.thumbnail}
              alt={movie.title}
              className="w-full h-60 object-cover"
            />
            <div className="p-3">
              <h2 className="font-bold text-sm">{movie.title}</h2>
              <p className="text-xs text-gray-500">
                {movie.genres.map((g) => g.name).join(", ")}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
