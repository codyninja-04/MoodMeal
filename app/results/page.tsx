'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { RotateCcw, Clock3, Sparkles } from 'lucide-react';
import { MealList } from '@/components/results/MealList';
import { LoadingMeal } from '@/components/ui/LoadingMeal';
import { RESULT_STORAGE_KEY } from '@/components/mood/MoodFlow';
import { useUser } from '@/hooks/useUser';
import type { RecommendResult, StoredResult } from '@/types';

export default function ResultsPage() {
  const router = useRouter();
  const { user } = useUser();
  const [result, setResult] = useState<StoredResult | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem(RESULT_STORAGE_KEY);
    if (raw) {
      try {
        setResult(JSON.parse(raw) as StoredResult);
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

  // Same mood, fresh ideas — tell Claude which meals we've already shown.
  const tryAgain = async () => {
    if (!result || retrying) return;
    setRetrying(true);
    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...result.mood,
          exclude: result.recommendations.map((m) => m.meal_name),
        }),
      });
      if (!res.ok) throw new Error();
      const data: RecommendResult = await res.json();
      const next: StoredResult = { ...data, mood: result.mood };
      sessionStorage.setItem(RESULT_STORAGE_KEY, JSON.stringify(next));
      setResult(next);
    } catch {
      // Keep the current results on a failed retry.
    } finally {
      setRetrying(false);
    }
  };

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
        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/history"
            aria-label="Your history"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 transition-colors hover:text-zinc-800 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            <Clock3 size={18} />
          </Link>
          <Link
            href="/mood"
            aria-label="Start over"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 transition-colors hover:text-zinc-800 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            <RotateCcw size={18} />
          </Link>
        </div>
      </header>

      {!hydrated || !result ? (
        <LoadingMeal />
      ) : retrying ? (
        <LoadingMeal />
      ) : (
        <>
          <MealList
            meals={result.recommendations}
            sessionId={result.sessionId}
            isAuthed={Boolean(user)}
          />

          <button
            type="button"
            onClick={tryAgain}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl border border-zinc-200 py-3.5 text-sm font-semibold text-zinc-600 transition-colors hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:text-zinc-50"
          >
            <Sparkles size={16} /> Show me three more
          </button>

          {!user && (
            <p className="mt-4 text-center text-xs text-zinc-400">
              <Link href="/login" className="text-ember hover:underline">
                Sign in
              </Link>{' '}
              to save meals and keep your history.
            </p>
          )}
        </>
      )}
    </main>
  );
}
