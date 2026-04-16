"use client";
import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  UploadCloud,
  Film,
  Image as ImageIcon,
  Clapperboard,
  Calendar,
  Clock,
  Link as LinkIcon,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

// --- Interfaces (Giữ nguyên) ---
interface MovieForm {
  title: string;
  description: string;
  thumbnail: string;
  backdrop: string;
  video_url: string;
  genres: string[];
  duration: string | number;
  publish_date: string;
  is_published: boolean;
}
interface Genre {
  _id: string;
  name: string;
}

export default function CreateMovie() {
  const [form, setForm] = useState<MovieForm>({
    title: "",
    description: "",
    thumbnail: "",
    backdrop: "",
    video_url: "",
    genres: [],
    duration: "",
    publish_date: "",
    is_published: true,
  });
  const [genreList, setGenreList] = useState<Genre[]>([]);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [backdropFile, setBackdropFile] = useState<File | null>(null);
  const [loadingUpload, setLoadingUpload] = useState(false);

  // Logic fetch & handlers (Giữ nguyên hoàn toàn logic của bạn)
  useEffect(() => {
    fetch("/api/genres")
      .then((res) => res.json())
      .then((json) => {
        if (json && Array.isArray(json.data)) setGenreList(json.data);
      })
      .catch(() => setGenreList([]));
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    return data.url as string;
  };

  const handleUploadImages = async () => {
    if (!thumbnailFile || !backdropFile) return alert("Vui lòng chọn đủ ảnh");
    try {
      setLoadingUpload(true);
      const [thumbUrl, backUrl] = await Promise.all([
        uploadImage(thumbnailFile),
        uploadImage(backdropFile),
      ]);
      setForm((prev) => ({ ...prev, thumbnail: thumbUrl, backdrop: backUrl }));
      alert("Upload thành công!");
    } catch {
      alert("Upload lỗi");
    } finally {
      setLoadingUpload(false);
    }
  };

  const handleGenreSelect = (id: string) => {
    setForm((prev) => ({
      ...prev,
      genres: prev.genres.includes(id)
        ? prev.genres.filter((gid) => gid !== id)
        : [...prev.genres, id],
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.thumbnail || !form.backdrop)
      return alert("Bạn cần upload ảnh trước");
    try {
      const res = await fetch("/api/movies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, duration: Number(form.duration) }),
      });
      if (res.ok) alert("Movie created!");
    } catch {
      alert("Failed");
    }
  };

  return (
    <div className="min-h-screen transition-colors duration-500 bg-white dark:bg-[#050505] text-zinc-900 dark:text-zinc-200 py-12 px-4 selection:bg-indigo-500/30">
      {/* Background Glows - Phản ứng theo theme */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 dark:bg-indigo-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 dark:bg-purple-600/10 blur-[120px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative mx-auto max-w-6xl">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-12 px-2">
          <div className="flex items-center gap-5">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center shadow-2xl shadow-indigo-500/40 rotate-3 hover:rotate-0 transition-transform duration-300">
              <Clapperboard className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tight dark:text-white flex items-center gap-2">
                STUDIO{" "}
                <span className="text-indigo-600 dark:text-indigo-400">
                  CORE
                </span>
              </h1>
              <p className="text-zinc-500 font-medium tracking-wide flex items-center gap-1">
                <Sparkles size={14} className="text-amber-500" /> Professional
                Movie Deployment
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* CỘT TRÁI: CONTENT & MEDIA */}
          <div className="lg:col-span-8 space-y-8">
            {/* General Info Card */}
            <div className="rounded-[2.5rem] bg-zinc-50/50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-white/5 p-10 backdrop-blur-2xl shadow-sm dark:shadow-none">
              <div className="space-y-8">
                <div className="relative group">
                  <input
                    name="title"
                    value={form.title}
                    placeholder="Title Movie"
                    onChange={handleChange}
                    className="w-full bg-transparent border-b-2 border-zinc-200 dark:border-zinc-800 py-4 text-4xl font-black text-zinc-900 dark:text-white transition-all focus:border-indigo-500 focus:outline-none placeholder:text-zinc-300 dark:placeholder:text-zinc-800"
                  />
                  <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-indigo-500 transition-all duration-500 group-focus-within:w-full" />
                </div>

                <textarea
                  name="description"
                  value={form.description}
                  placeholder="Write the legendary story of the film..."
                  onChange={handleChange}
                  rows={4}
                  className="w-full rounded-3xl bg-white dark:bg-black/20 border border-zinc-200 dark:border-white/5 p-6 text-zinc-700 dark:text-zinc-300 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all text-lg"
                />
              </div>
            </div>

            {/* Media Asset Card */}
            <div className="rounded-[2.5rem] bg-zinc-50/50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-white/5 p-10 backdrop-blur-2xl">
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
                  Visual Identity
                </h3>
                <button
                  type="button"
                  onClick={handleUploadImages}
                  disabled={loadingUpload}
                  className="group flex items-center gap-2 rounded-2xl bg-zinc-900 dark:bg-white px-8 py-3 text-sm font-black text-white dark:text-black transition-all hover:scale-105 active:scale-95 disabled:opacity-50 shadow-xl shadow-indigo-500/10">
                  {loadingUpload ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  ) : (
                    <UploadCloud size={18} />
                  )}
                  UPLOAD ASSETS
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Poster */}
                <div className="relative aspect-[2/3] overflow-hidden rounded-[2rem] border-2 border-dashed border-zinc-200 dark:border-zinc-800 flex items-center justify-center group hover:border-indigo-500/50 transition-colors bg-white dark:bg-zinc-950/50">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setThumbnailFile(e.target.files?.[0] || null)
                    }
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  />
                  {form.thumbnail ? (
                    <img
                      src={form.thumbnail}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="text-center p-6">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-900 text-zinc-400 group-hover:text-indigo-500 transition-colors">
                        <Plus size={32} />
                      </div>
                      <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                        Vertical Poster
                      </p>
                    </div>
                  )}
                </div>

                {/* Backdrop */}
                <div className="relative aspect-video overflow-hidden rounded-[2rem] border-2 border-dashed border-zinc-200 dark:border-zinc-800 flex items-center justify-center group hover:border-indigo-500/50 transition-colors bg-white dark:bg-zinc-950/50">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setBackdropFile(e.target.files?.[0] || null)
                    }
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  />
                  {form.backdrop ? (
                    <img
                      src={form.backdrop}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="text-center p-6">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-900 text-zinc-400 group-hover:text-indigo-500 transition-colors">
                        <Plus size={32} />
                      </div>
                      <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                        Hero Backdrop
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: CONFIGURATION */}
          <div className="lg:col-span-4 space-y-8">
            <div className="sticky top-8 space-y-8">
              <div className="rounded-[2.5rem] bg-zinc-50/50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-white/5 p-8 backdrop-blur-2xl">
                <div className="space-y-8">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 block mb-4">
                      Streaming Source
                    </label>
                    <div className="relative">
                      <LinkIcon
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                        size={16}
                      />
                      <input
                        name="video_url"
                        value={form.video_url}
                        placeholder="https://youtube.com/..."
                        onChange={handleChange}
                        className="w-full rounded-2xl bg-white dark:bg-black/30 border border-zinc-200 dark:border-zinc-800 pl-11 pr-4 py-3.5 text-sm focus:border-indigo-500 focus:outline-none transition-all shadow-inner"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 block mb-4">
                        Runtime (m)
                      </label>
                      <input
                        name="duration"
                        type="number"
                        value={form.duration}
                        placeholder="120"
                        onChange={handleChange}
                        className="w-full rounded-2xl bg-white dark:bg-black/30 border border-zinc-200 dark:border-zinc-800 px-4 py-3.5 text-sm focus:border-indigo-500 focus:outline-none transition-all shadow-inner"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 block mb-4">
                        Release
                      </label>
                      <input
                        name="publish_date"
                        type="date"
                        value={form.publish_date}
                        onChange={handleChange}
                        className="w-full rounded-2xl bg-white dark:bg-black/30 border border-zinc-200 dark:border-zinc-800 px-4 py-3.5 text-sm focus:border-indigo-500 focus:outline-none transition-all shadow-inner dark:[color-scheme:dark]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 block mb-4">
                      Genre Selection
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {genreList.map((g) => (
                        <button
                          key={g._id}
                          type="button"
                          onClick={() => handleGenreSelect(g._id)}
                          className={`rounded-xl px-4 py-2 text-[10px] font-black transition-all duration-300 ${
                            form.genres.includes(g._id)
                              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 scale-105"
                              : "bg-white dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                          }`}>
                          {g.name.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800">
                  <motion.button
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    className="w-full rounded-3xl bg-indigo-600 py-5 font-black text-white shadow-2xl shadow-indigo-600/40 hover:bg-indigo-500 transition-all text-sm tracking-[0.2em]">
                    🚀 PUBLISH NOW
                  </motion.button>
                </div>
              </div>

              {/* Tips Card */}
              <div className="rounded-[2rem] bg-amber-500/5 dark:bg-indigo-500/5 border border-amber-500/10 dark:border-indigo-500/10 p-6 flex gap-4">
                <div className="h-10 w-10 shrink-0 rounded-full bg-amber-500/10 dark:bg-indigo-500/10 flex items-center justify-center text-amber-600 dark:text-indigo-400">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold dark:text-white">
                    Kiểm tra kỹ lưỡng
                  </h4>
                  <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">
                    Phim sẽ được công khai ngay lập tức sau khi nhấn Publish.
                    Hãy đảm bảo Video URL hoạt động tốt.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
