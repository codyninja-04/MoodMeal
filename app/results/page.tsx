'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { RotateCcw } from 'lucide-react';
import { MealList } from '@/components/results/MealList';
import { LoadingMeal } from '@/components/ui/LoadingMeal';
import { RESULT_STORAGE_KEY } from '@/components/mood/MoodFlow';
import type { RecommendResult } from '@/types';

export default function ResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<RecommendResult | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem(RESULT_STORAGE_KEY);
    if (raw) {
      try {
        setResult(JSON.parse(raw) as RecommendResult);
      } catch {
        // Corrupt payload — send them back to start fresh.
      }
    }
    setHydrated(true);
  }, []);

  // No stored result (e.g. someone deep-linked here) — start the flow.
  useEffect(() => {
    if (hydrated && !result) router.replace('/mood');
  }, [hydrated, result, router]);

  return (
    <main className="mx-auto min-h-dvh max-w-md px-6 py-8">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            For how you feel
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Three meals worth reaching for right now.
          </p>
        </div>
        <Link
          href="/mood"
          aria-label="Start over"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 transition-colors hover:text-zinc-800 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          <RotateCcw size={18} />
        </Link>
      </header>

      {!hydrated || !result ? (
        <LoadingMeal />
      ) : (
        <MealList meals={result.recommendations} />
      )}
    </main>
  );
}
