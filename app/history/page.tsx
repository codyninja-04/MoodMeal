import Link from 'next/link';
import { cookies } from 'next/headers';
import { ArrowLeft } from 'lucide-react';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server';
import { HistoryCard } from '@/components/history/HistoryCard';
import { MoodTrend } from '@/components/history/MoodTrend';
import { SavedMealRow } from '@/components/history/SavedMealRow';
import type { MealRecommendation, MoodSessionRecord, SavedMeal } from '@/types';

export const dynamic = 'force-dynamic';

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto min-h-dvh max-w-md px-6 py-8">
      <header className="mb-6 flex items-center gap-3">
        <Link
          href="/mood"
          aria-label="Back to check-in"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 transition-colors hover:text-zinc-800 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          <ArrowLeft size={18} />
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">Your history</h1>
      </header>
      {children}
    </main>
  );
}

function EmptyState({ message, cta }: { message: string; cta?: boolean }) {
  return (
    <div className="rounded-3xl border border-dashed border-zinc-300 p-8 text-center dark:border-zinc-700">
      <p className="text-zinc-500 dark:text-zinc-400">{message}</p>
      {cta && (
        <Link
          href="/mood"
          className="mt-4 inline-block rounded-2xl bg-ember px-5 py-3 text-sm font-semibold text-white"
        >
          Do a check-in
        </Link>
      )}
    </div>
  );
}

export default async function HistoryPage() {
  if (!isSupabaseConfigured()) {
    return (
      <Shell>
        <EmptyState message="History needs Supabase configured. Your check-ins still work without it — they just aren't saved." />
      </Shell>
    );
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const token = cookies().get('mm_session')?.value;

  // Logged-in users see their own sessions; anonymous visitors see only the
  // check-ins tied to this browser's token. Filters (.eq) must precede the
  // .order/.limit transforms, so apply them first.
  let filter = supabase
    .from('mood_sessions')
    .select(
      'id, energy_level, stress_level, craving_type, recommendations, created_at'
    );

  if (user) {
    filter = filter.eq('user_id', user.id);
  } else if (token) {
    filter = filter.eq('session_token', token);
  } else {
    return (
      <Shell>
        <EmptyState message="No check-ins yet." cta />
      </Shell>
    );
  }

  const { data: rows } = await filter
    .order('created_at', { ascending: false })
    .limit(30);
  const sessions = (rows ?? []) as unknown as MoodSessionRecord[];

  // Saved meals are an authenticated-only feature.
  let saved: SavedMeal[] = [];
  if (user) {
    const { data: savedRows } = await supabase
      .from('saved_meals')
      .select('id, meal_name, meal_data, saved_at')
      .order('saved_at', { ascending: false });
    saved = (savedRows ?? []).map((r) => ({
      id: r.id,
      meal_name: r.meal_name,
      meal_data: r.meal_data as unknown as MealRecommendation,
      saved_at: r.saved_at,
    }));
  }

  if (sessions.length === 0 && saved.length === 0) {
    return (
      <Shell>
        <EmptyState message="No check-ins yet." cta />
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="space-y-4">
        <MoodTrend sessions={sessions} />

        {saved.length > 0 && (
          <section>
            <h2 className="mb-3 px-1 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
              Saved meals
            </h2>
            <div className="space-y-2.5">
              {saved.map((s) => (
                <SavedMealRow key={s.id} saved={s} />
              ))}
            </div>
          </section>
        )}

        {sessions.length > 0 && (
          <section>
            <h2 className="mb-3 px-1 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
              Past check-ins
            </h2>
            <div className="space-y-4">
              {sessions.map((s) => (
                <HistoryCard key={s.id} session={s} />
              ))}
            </div>
          </section>
        )}

        {!user && (
          <p className="pt-2 text-center text-xs text-zinc-400">
            <Link href="/login" className="text-ember hover:underline">
              Sign in
            </Link>{' '}
            to keep this history across devices.
          </p>
        )}
      </div>
    </Shell>
  );
}
