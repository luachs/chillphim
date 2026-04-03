"use client";

import * as React from "react";
import { Heart } from "lucide-react";

import { apiFetch } from "@/lib/api-client";
import { getStoredAuthUser } from "@/lib/auth-client";
import { Button } from "@/components/ui/Button";

type FavoriteMovie = { _id: string; slug?: string; title?: string };

type FavoriteItem = {
  _id: string;
  user: string;
  movie: FavoriteMovie;
};

export function FavoriteButton({ movieId }: { movieId: string }) {
  const [userId, setUserId] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [isFavorite, setIsFavorite] = React.useState(false);

  React.useEffect(() => {
    const user = getStoredAuthUser();
    setUserId(user?._id ?? null);
  }, []);

  React.useEffect(() => {
    if (!userId) return;

    apiFetch<{ data: FavoriteItem[] }>(
      `/api/favorites?userId=${encodeURIComponent(userId)}`,
    )
      .then((res) => {
        setIsFavorite(res.data.some((f) => f.movie?._id === movieId));
      })
      .catch(() => setIsFavorite(false));
  }, [movieId, userId]);

  const toggle = async () => {
    if (!userId) {
      alert("Bạn cần đăng nhập để thêm vào yêu thích.");
      return;
    }

    setLoading(true);
    try {
      const res = await apiFetch<{ action: "added" | "removed" }>(
        "/api/favorites",
        {
          method: "POST",
          jsonBody: { userId, movieId },
        },
      );

      setIsFavorite(res.action === "added");
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Có lỗi xảy ra";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant={isFavorite ? "danger" : "outline"}
      className="gap-2"
      onClick={toggle}
      disabled={loading}>
      <Heart
        className="h-4 w-4"
        fill={isFavorite ? "currentColor" : "transparent"}
      />
      {isFavorite ? "Đã thích" : "Thích"}
    </Button>
  );
}

