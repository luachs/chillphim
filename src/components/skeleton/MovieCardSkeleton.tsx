import { Skeleton } from "@/components/ui/Skeleton";

export function MovieCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200/60 bg-white/5 dark:border-zinc-800/60">
      <Skeleton className="h-56 w-full rounded-none" />
      <div className="space-y-2 p-3">
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}

