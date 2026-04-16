"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, User, Film, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { getStoredAuthUser, clearStoredAuthUser } from "@/lib/auth-client"; // Đảm bảo hàm này đọc từ cookie hoặc trạng thái mới nhất
import { apiFetch } from "@/lib/api-client";
import { cn } from "@/lib/utils";

const NavItem = ({ href, label }: { href: string; label: string }) => {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "relative px-3 py-1.5 text-sm font-bold transition-colors",
        active
          ? "text-zinc-900 dark:text-zinc-50"
          : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50",
      )}>
      <span className="relative z-10">{label}</span>
      {active && (
        <motion.div
          layoutId="nav-pill"
          className="absolute inset-0 bg-zinc-100 dark:bg-zinc-800 rounded-xl -z-0"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
    </Link>
  );
};

export default function TopNav() {
  const router = useRouter();
  const [user, setUser] = React.useState<any>(null);

  // Hàm này sẽ gọi lại logic kiểm tra Auth (đọc cookie/session)
  const refreshUser = React.useCallback(() => {
    const currentUser = getStoredAuthUser();
    setUser(currentUser);
  }, []);

  React.useEffect(() => {
    // Chạy ngay khi load trang
    refreshUser();

    // Lắng nghe sự kiện tùy chỉnh "auth-state-change"
    window.addEventListener("auth-state-change", refreshUser);

    return () => {
      window.removeEventListener("auth-state-change", refreshUser);
    };
  }, [refreshUser]);

  const logout = async () => {
    try {
      await apiFetch("/api/logout", { method: "POST" });
    } catch {
      // ignore
    } finally {
      clearStoredAuthUser(); // Xóa cookie/local data
      setUser(null);
      router.push("/login");
      // Báo hiệu cho các phần khác của app (nếu cần)
      window.dispatchEvent(new Event("auth-state-change"));
    }
  };

  return (
    <header className="sticky top-0 z-[100] w-full border-b border-zinc-200/50 bg-white/80 backdrop-blur-xl dark:border-zinc-800/50 dark:bg-[#050505]/80 transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
        {/* LOGO */}
        <Link
          href="/"
          className="group flex items-center gap-2 text-2xl font-[1000] tracking-tighter text-zinc-900 dark:text-zinc-50">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 transition-transform group-hover:rotate-12">
            <Film className="h-5 w-5 fill-current" />
          </div>
          <span className="hidden sm:block">chillphim</span>
        </Link>

        {/* NAVIGATION */}
        <nav className="hidden items-center gap-1 md:flex bg-zinc-100/50 dark:bg-white/5 p-1 rounded-2xl border border-zinc-200/50 dark:border-white/5">
          <NavItem href="/" label="Home" />
          <NavItem href="/movies" label="Movies" />
          {user && <NavItem href="/profile" label="Profile" />}

          {user?.role === "admin" && (
            <Link
              href="/admin/createMovie"
              className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-black text-amber-600 dark:text-amber-400">
              <ShieldCheck size={14} /> ADMIN
            </Link>
          )}
        </nav>

        {/* ACTIONS */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800" />

          {user ? (
            <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-900 p-1 pr-2 rounded-full border border-zinc-200 dark:border-white/5">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full bg-indigo-600 text-white hover:bg-indigo-500 transition-colors"
                onClick={() => router.push("/profile")}>
                <User className="h-4 w-4" />
              </Button>

              <div className="hidden lg:block px-1">
                <p className="text-[9px] font-[1000] uppercase tracking-[0.2em] leading-none opacity-40">
                  Member
                </p>
                <p className="text-xs font-bold truncate max-w-[90px]">
                  {user.name || "Account"}
                </p>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
                onClick={logout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button
              className="rounded-full px-6 font-black bg-zinc-900 dark:bg-white text-white dark:text-black hover:scale-105 active:scale-95 transition-all"
              onClick={() => router.push("/login")}>
              LOGIN
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
