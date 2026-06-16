'use client';

// Skeleton shown while Claude is thinking. Three shimmering cards so the
// results page never flashes empty.
export function LoadingMeal() {
  return (
    <div className="space-y-4">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-surface"
        >
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-black/5 to-transparent dark:via-white/5" />
          <div className="mb-3 h-5 w-1/2 rounded-full bg-zinc-200 dark:bg-zinc-700" />
          <div className="mb-2 h-3 w-1/4 rounded-full bg-zinc-200 dark:bg-zinc-700" />
          <div className="mb-2 h-3 w-full rounded-full bg-zinc-200 dark:bg-zinc-700" />
          <div className="h-3 w-3/4 rounded-full bg-zinc-200 dark:bg-zinc-700" />
        </div>
      ))}
    </div>
  );
}
