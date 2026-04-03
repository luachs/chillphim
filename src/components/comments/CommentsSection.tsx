"use client";

import * as React from "react";
import { apiFetch } from "@/lib/api-client";
import { getStoredAuthUser } from "@/lib/auth-client";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { Skeleton } from "@/components/ui/Skeleton";

type CommentItem = {
  _id: string;
  user: { _id: string; username: string };
  movie: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

export function CommentsSection({ movieId }: { movieId: string }) {
  const [userId, setUserId] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [content, setContent] = React.useState("");
  const [comments, setComments] = React.useState<CommentItem[]>([]);

  React.useEffect(() => {
    const user = getStoredAuthUser();
    setUserId(user?._id ?? null);
  }, []);

  const load = React.useCallback(() => {
    setLoading(true);
    apiFetch<{ data: CommentItem[] }>(`/api/comments/${movieId}`)
      .then((res) => setComments(res.data))
      .catch(() => setComments([]))
      .finally(() => setLoading(false));
  }, [movieId]);

  React.useEffect(() => {
    load();
  }, [load]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      alert("Bạn cần đăng nhập để bình luận.");
      return;
    }

    const next = content.trim();
    if (!next) return;

    setSubmitting(true);
    try {
      await apiFetch("/api/comments", {
        method: "POST",
        jsonBody: { userId, movieId, content: next },
      });
      setContent("");
      await load();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Có lỗi xảy ra";
      alert(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-10">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
          Comments
        </h2>
      </div>

      <form onSubmit={submit} className="mt-4">
        <div className="space-y-3">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={userId ? "Viết bình luận..." : "Đăng nhập để bình luận"}
            disabled={submitting}
            className="min-h-[90px]"
          />
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {userId ? "Nhấn gửi để đăng bình luận." : "Bạn chưa đăng nhập."}
            </p>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Đang gửi..." : "Gửi bình luận"}
            </Button>
          </div>
        </div>
      </form>

      <div className="mt-6 space-y-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-16 w-full" />
            </div>
          ))
        ) : comments.length === 0 ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Chưa có bình luận nào.
          </p>
        ) : (
          comments.map((c) => (
            <div
              key={c._id}
              className="rounded-lg border border-zinc-200/60 bg-white/30 p-4 dark:border-zinc-800/60 dark:bg-zinc-950/30">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                  {c.user?.username ?? "User"}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {new Date(c.createdAt).toLocaleDateString()}
                </p>
              </div>
              <p className="mt-2 whitespace-pre-line text-sm text-zinc-700 dark:text-zinc-200">
                {c.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

