"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  Loader2,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { setStoredAuthUser } from "@/lib/auth-client";

type LoginForm = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState<LoginForm>({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      if (data?.user?._id) {
        setStoredAuthUser({
          _id: data.user._id,
          username: data.user.username,
          email: data.user.email,
          role: data.user.role,
          avatar: data.user.avatar,
        });
      }
      // Sau khi gọi API login thành công
      window.dispatchEvent(new Event("auth-state-change"));
      router.push("/");
      setMessage({
        type: "success",
        text: "Khởi động khoang lái thành công! Đang chuyển hướng...",
      });
      setTimeout(() => router.push("/"), 1200);
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Mật mã hoặc email không chính xác",
      });
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-white dark:bg-[#050505] flex items-center justify-center px-4">
      {/* --- BACKGROUND EFFECTS --- */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] h-[600px] w-[600px] rounded-full bg-emerald-500/10 blur-[120px] dark:bg-emerald-600/5" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[600px] w-[600px] rounded-full bg-blue-500/10 blur-[120px] dark:bg-indigo-600/5" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-[440px]">
        {/* LOGO / ICON AREA */}
        <div className="mb-8 flex flex-col items-center">
          <motion.div
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.6 }}
            className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 shadow-xl shadow-emerald-500/20 dark:shadow-emerald-500/10">
            <ShieldCheck className="text-white" size={32} />
          </motion.div>
          <h2 className="mt-6 text-3xl font-black tracking-tighter text-zinc-900 dark:text-white md:text-4xl">
            Welcome Back.
          </h2>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400 font-medium">
            Đăng nhập để tiếp tục hành trình
          </p>
        </div>

        {/* MAIN FORM CARD */}
        <div className="group relative rounded-[2.5rem] border border-zinc-200 bg-white/70 p-8 shadow-2xl backdrop-blur-2xl dark:border-white/5 dark:bg-zinc-900/40 dark:shadow-none">
          {/* Decorative line inside card */}
          <div className="absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50" />

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {/* Email Field */}
              <div className="relative">
                <label className="mb-2 block text-xs font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                    size={18}
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="name@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-2xl border border-zinc-200 bg-white px-11 py-4 text-sm font-medium transition-all focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 dark:border-white/5 dark:bg-black/20 dark:text-white dark:placeholder:text-zinc-600"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                    Security Key
                  </label>
                  <Link
                    href="#"
                    className="text-[10px] font-bold text-emerald-600 hover:underline dark:text-emerald-400">
                    Quên mật khẩu?
                  </Link>
                </div>
                <div className="relative">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                    size={18}
                  />
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="w-full rounded-2xl border border-zinc-200 bg-white px-11 py-4 text-sm font-medium transition-all focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 dark:border-white/5 dark:bg-black/20 dark:text-white dark:placeholder:text-zinc-600"
                  />
                </div>
              </div>
            </div>

            {/* MESSAGE FEEDBACK */}
            <AnimatePresence mode="wait">
              {message.text && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold ${
                    message.type === "success"
                      ? "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/5 dark:text-emerald-400"
                      : "bg-red-500/10 text-red-600 dark:bg-red-400/5 dark:text-red-400"
                  }`}>
                  <Sparkles size={16} />
                  {message.text}
                </motion.div>
              )}
            </AnimatePresence>

            {/* SUBMIT BUTTON */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              type="submit"
              className="relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-zinc-900 py-4 font-black text-white shadow-xl transition-all hover:bg-emerald-600 disabled:opacity-70 dark:bg-white dark:text-black dark:hover:bg-emerald-400">
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  SIGN IN <ArrowRight size={18} />
                </>
              )}
            </motion.button>
          </form>

          {/* FOOTER */}
          <div className="mt-8 text-center">
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Chưa có tài khoản?{" "}
              <Link
                href="/register"
                className="font-black text-zinc-900 transition-colors hover:text-emerald-600 dark:text-white dark:hover:text-emerald-400">
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Trang trí phía dưới */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center z-10">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400 opacity-50">
          Protected by SecureLayer 2.0
        </p>
      </div>
    </div>
  );
}
