import { Skeleton } from "@/components/ui/Skeleton";

export function MovieCardSkeleton() {
  return (
    <div className="group relative flex flex-col gap-3">
      {/* Thumbnail Skeleton với tỷ lệ 2/3 chuẩn điện ảnh */}
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 bg-zinc-100 dark:bg-zinc-900">
        <Skeleton className="h-full w-full rounded-none" />

        {/* Giả lập badge (như HD hoặc Rating) ở góc */}
        <div className="absolute top-3 left-3">
          <Skeleton className="h-5 w-10 rounded-full bg-zinc-300 dark:bg-zinc-700" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="flex flex-col gap-2 px-1">
        {/* Title line 1 */}
        <Skeleton className="h-5 w-full rounded-lg" />

        {/* Info line (Rating & Year) */}
        <div className="flex items-center gap-3">
          <Skeleton className="h-4 w-12 rounded-md" />
          <Skeleton className="h-4 w-16 rounded-md" />
        </div>
      </div>
    </div>
  );
}
