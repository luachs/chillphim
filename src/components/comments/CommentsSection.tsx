"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, User as UserIcon, Calendar } from "lucide-react";

import { apiFetch } from "@/lib/api-client";
import { getStoredAuthUser } from "@/lib/auth-client";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";

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
    if (!userId) return;

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
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-16 max-w-3xl mx-auto px-4">
      {/* Header với Icon */}
      <div className="flex items-center gap-3 mb-8 border-l-4 border-indigo-600 pl-4">
        <div className="bg-indigo-600/10 p-2 rounded-lg">
          <MessageSquare className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <h2 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
            Cộng đồng
          </h2>
          <p className="text-xs text-zinc-500 font-medium uppercase tracking-widest">
            {comments.length} Bình luận
          </p>
        </div>
      </div>

      {/* Form Nhập liệu */}
      <form onSubmit={submit} className="relative group mb-12">
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-10 group-focus-within:opacity-25 transition duration-500" />
        <div className="relative space-y-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 shadow-sm">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={
              userId
                ? "Chia sẻ cảm xúc của bạn về bộ phim..."
                : "Đăng nhập để tham gia thảo luận"
            }
            disabled={submitting || !userId}
            className="border-none bg-transparent focus:ring-0 min-h-[100px] text-base p-0"
          />
          <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-900">
            <div className="flex items-center gap-2">
              {userId && (
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              )}
              <p className="text-xs font-medium text-zinc-500">
                {userId ? "Bạn đang tham gia thảo luận" : "Hãy đăng nhập trước"}
              </p>
            </div>
            <Button
              type="submit"
              disabled={submitting || !content.trim()}
              className="rounded-full px-6 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20">
              {submitting ? (
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <div className="flex items-center gap-2 uppercase text-[11px] font-bold tracking-widest">
                  Gửi <Send className="w-3 h-3" />
                </div>
              )}
            </Button>
          </div>
        </div>
      </form>

      {/* Danh sách bình luận */}
      <div className="space-y-6">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="h-10 w-10 rounded-full shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-16 w-full rounded-xl" />
              </div>
            </div>
          ))
        ) : comments.length === 0 ? (
          <div className="text-center py-12 bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800">
            <MessageSquare className="w-10 h-10 text-zinc-300 mx-auto mb-3" />
            <p className="text-sm text-zinc-500 italic">
              Hãy là người đầu tiên để lại ý kiến!
            </p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {comments.map((c, index) => (
              <motion.div
                key={c._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex gap-4 group">
                {/* Avatar mờ ảo */}
                <div className="relative shrink-0 h-10 w-10">
                  <div className="absolute inset-0 bg-indigo-500 rounded-full blur-md opacity-20 group-hover:opacity-40 transition-opacity" />
                  <div className="relative h-full w-full rounded-full bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center border border-zinc-200 dark:border-zinc-800">
                    <UserIcon className="w-5 h-5 text-zinc-400" />
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-baseline justify-between mb-1">
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 hover:text-indigo-500 transition-colors cursor-pointer">
                      {c.user?.username ?? "Ẩn danh"}
                    </h4>
                    <div className="flex items-center gap-1 text-[10px] text-zinc-400 font-medium">
                      <Calendar className="w-3 h-3" />
                      {new Date(c.createdAt).toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "short",
                      })}
                    </div>
                  </div>

                  {/* Bong bóng bình luận Glassmorphism */}
                  <div className="relative rounded-2xl rounded-tl-none border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-sm group-hover:border-indigo-500/30 transition-colors">
                    <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 whitespace-pre-line">
                      {c.content}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
