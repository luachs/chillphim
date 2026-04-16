"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function Card({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { onDrag, onDragStart, onDragEnd, ...safeProps } = props as any;

  return (
    <motion.div
      // Hiệu ứng nhích nhẹ khi hover tạo cảm giác vật lý
      whileHover={{ y: -5, scale: 1.01 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn(
        "group relative overflow-hidden rounded-2xl transition-all duration-500",
        // Viền và Nền Glassmorphism
        "border border-zinc-200/50 bg-white/40 shadow-sm backdrop-blur-xl",
        "dark:border-zinc-800/50 dark:bg-zinc-950/40 dark:shadow-2xl",
        "hover:shadow-indigo-500/10 hover:border-indigo-500/30 dark:hover:border-indigo-500/30",
        className,
      )}
      {...safeProps}>
      {/* 1. Hiệu ứng vệt sáng (Spotlight) lướt qua khi hover */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -inset-[100%] opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-[radial-gradient(circle_at_var(--mouse-x)_var(--mouse-y),rgba(99,102,241,0.15)_0%,transparent_50%)]"
          style={{
            // Chỗ này nếu bạn muốn xịn hơn nữa có thể viết thêm 1 hook để theo dõi mouse position
            // Còn không thì để mặc định gradient tỏa ra từ giữa
            background:
              "radial-gradient(circle at center, rgba(99,102,241,0.1) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* 2. Lớp Border sáng rực nhẹ ở cạnh trên */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* 3. Nội dung bên trong */}
      <div className="relative z-10 p-6">{children}</div>

      {/* 4. Hiệu ứng hạt bụi/nhiễu (Grainy) nhẹ để tăng độ thực của kính */}
      <div className="absolute inset-0 -z-10 opacity-[0.03] dark:opacity-[0.05] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </motion.div>
  );
}

// Sub-components để code sạch hơn (giống Shadcn UI)
export function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-col space-y-1.5", className)} {...props} />
  );
}

export function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("text-xl font-bold tracking-tight", className)}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-sm text-zinc-500 dark:text-zinc-400", className)}
      {...props}
    />
  );
}

export function CardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("pt-4", className)} {...props} />;
}
