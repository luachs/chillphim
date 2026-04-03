"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { clearStoredAuthUser, getStoredAuthUser } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api-client";

const NavItem = ({ href, label }: { href: string; label: string }) => {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      className={
        active
          ? "text-zinc-900 dark:text-zinc-50 font-semibold"
          : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-50"
      }>
      {label}
    </Link>
  );
};

export default function TopNav() {
  const router = useRouter();
  const [user, setUser] = React.useState<ReturnType<
    typeof getStoredAuthUser
  >>(null);

  React.useEffect(() => {
    setUser(getStoredAuthUser());
  }, []);

  const logout = async () => {
    try {
      await apiFetch("/api/logout", { method: "POST" });
    } catch {
      // ignore
    } finally {
      clearStoredAuthUser();
      setUser(null);
      router.push("/login");
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/60 bg-white/60 backdrop-blur dark:border-zinc-800/60 dark:bg-zinc-950/60">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          chillphim
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <NavItem href="/" label="Home" />
          <NavItem href="/movies" label="Movies" />
          <NavItem href="/profile" label="Profile" />

          {user?.role === "admin" ? (
            <Link
              href="/admin/createMovie"
              className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-50">
              Admin
            </Link>
          ) : null}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          {user ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Profile"
                onClick={() => router.push("/profile")}>
                <User className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Logout"
                onClick={logout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Button variant="outline" onClick={() => router.push("/login")}>
              Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

