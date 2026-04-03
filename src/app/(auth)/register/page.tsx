"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

  const [message, setMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setMessage("Register success!");

      setTimeout(() => {
        router.push("/login");
      }, 1000);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Đăng ký thất bại";
      setMessage(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-4 rounded-2xl border border-zinc-200/60 bg-white/30 p-8 shadow-sm backdrop-blur dark:border-zinc-800/60 dark:bg-zinc-950/30">
        <h2 className="text-2xl font-bold text-center text-zinc-900 dark:text-zinc-50">
          Register
        </h2>

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
          className="w-full rounded-md border border-zinc-200 bg-white/30 p-2 text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950/30 dark:text-zinc-50"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full rounded-md border border-zinc-200 bg-white/30 p-2 text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950/30 dark:text-zinc-50"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full rounded-md border border-zinc-200 bg-white/30 p-2 text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950/30 dark:text-zinc-50"
        />

        <button
          type="submit"
          className="w-full rounded-md bg-blue-500 p-2 text-white hover:bg-blue-400">
          Register
        </button>

        {message && (
          <p className="text-center text-sm text-red-500">{message}</p>
        )}

        <p className="text-center text-sm text-zinc-600 dark:text-zinc-300">
          Already have account?{" "}
          <Link href="/login" className="text-blue-500 hover:underline dark:text-blue-400">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
