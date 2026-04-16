"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserPlus,
  Mail,
  Lock,
  User,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

type RegisterForm = {
  username: string;
  email: string;
  password: string;
};

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState<RegisterForm>({
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setMessage({
        type: "success",
        text: "Tạo tài khoản thành công! Đang tới trang đăng nhập...",
      });

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Đăng ký thất bại, vui lòng thử lại",
      });
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-white dark:bg-[#050505] flex items-center justify-center px-4">
      {/* --- PHÔNG NỀN NGHỆ THUẬT --- */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-5%] right-[-5%] h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-[100px] dark:bg-blue-600/5" />
        <div className="absolute bottom-[-5%] left-[-5%] h-[500px] w-[500px] rounded-full bg-indigo-500/10 blur-[100px] dark:bg-purple-600/5" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-[480px]">
        {/* HEADER AREA */}
        <div className="mb-8 text-center">
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-indigo-500 shadow-2xl shadow-blue-500/20">
            <UserPlus className="text-white" size={32} />
          </motion.div>
          <h2 className="text-4xl font-black tracking-tighter text-zinc-900 dark:text-white">
            Join the Club.
          </h2>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400 font-medium italic">
            Bắt đầu hành trình điện ảnh của bạn ngay hôm nay
          </p>
        </div>

        {/* REGISTER CARD */}
        <div className="relative rounded-[3rem] border border-zinc-200 bg-white/80 p-10 shadow-2xl backdrop-blur-3xl dark:border-white/5 dark:bg-zinc-900/60 dark:shadow-none">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              {/* Username */}
              <div className="group relative">
                <label className="mb-2 ml-1 block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                  Identity Name
                </label>
                <div className="relative">
                  <User
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 transition-colors group-focus-within:text-blue-500"
                    size={18}
                  />
                  <input
                    type="text"
                    name="username"
                    placeholder="VD: StevenSpielberg"
                    value={form.username}
                    onChange={handleChange}
                    required
                    className="w-full rounded-2xl border border-zinc-200 bg-white px-12 py-4 text-sm font-medium transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 dark:border-white/5 dark:bg-black/40 dark:text-white"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="group relative">
                <label className="mb-2 ml-1 block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                  Secure Email
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 transition-colors group-focus-within:text-blue-500"
                    size={18}
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="email@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-2xl border border-zinc-200 bg-white px-12 py-4 text-sm font-medium transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 dark:border-white/5 dark:bg-black/40 dark:text-white"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="group relative">
                <label className="mb-2 ml-1 block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                  Master Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 transition-colors group-focus-within:text-blue-500"
                    size={18}
                  />
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="w-full rounded-2xl border border-zinc-200 bg-white px-12 py-4 text-sm font-medium transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 dark:border-white/5 dark:bg-black/40 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* FEEDBACK MESSAGE */}
            <AnimatePresence>
              {message.text && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-xs font-bold ${
                    message.type === "success"
                      ? "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/5 dark:text-emerald-400"
                      : "bg-red-500/10 text-red-600 dark:bg-red-400/5 dark:text-red-400"
                  }`}>
                  {message.type === "success" ? (
                    <CheckCircle2 size={16} />
                  ) : (
                    <Sparkles size={16} />
                  )}
                  {message.text}
                </motion.div>
              )}
            </AnimatePresence>

            {/* BUTTON ACTION */}
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              type="submit"
              className="relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-zinc-900 py-4 font-black text-white shadow-2xl transition-all hover:bg-blue-600 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-blue-400">
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  CREATE ACCOUNT <ArrowRight size={18} />
                </>
              )}
            </motion.button>
          </form>

          {/* REDIRECT */}
          <div className="mt-8 border-t border-zinc-100 pt-6 text-center dark:border-white/5">
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Đã là thành viên?{" "}
              <Link
                href="/login"
                className="font-black text-blue-600 transition-colors hover:text-blue-500 dark:text-blue-400">
                Đăng nhập
              </Link>
            </p>
          </div>
        </div>
      </motion.div>

      {/* FOOTER DECOR */}
      <div className="absolute bottom-6 flex items-center gap-2 opacity-30">
        <div className="h-1 w-1 rounded-full bg-blue-500" />
        <span className="text-[10px] font-bold uppercase tracking-widest dark:text-white">
          Gemini Streaming Service
        </span>
        <div className="h-1 w-1 rounded-full bg-blue-500" />
      </div>
    </div>
  );
}
