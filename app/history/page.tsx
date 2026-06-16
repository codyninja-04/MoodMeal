import Link from 'next/link';
import { cookies } from 'next/headers';
import { ArrowLeft, LineChart, ChevronRight } from 'lucide-react';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server';
import { isPremium, FREE_HISTORY_LIMIT } from '@/lib/premium';
import { HistoryCard } from '@/components/history/HistoryCard';
import { MoodTrend } from '@/components/history/MoodTrend';
import { SavedMealRow } from '@/components/history/SavedMealRow';
import { RecipeBoxRow } from '@/components/history/RecipeBoxRow';
import type {
  MealRecommendation,
  MoodSessionRecord,
  Recipe,
  SavedMeal,
  SavedRecipe,
} from '@/types';

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
  const premium = user ? await isPremium(supabase, user.id) : false;

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
    .limit(100);
  const sessions = (rows ?? []) as unknown as MoodSessionRecord[];

  // Free tier sees a capped slice; premium sees everything.
  const truncated = !premium && sessions.length > FREE_HISTORY_LIMIT;
  const visibleSessions = premium
    ? sessions
    : sessions.slice(0, FREE_HISTORY_LIMIT);

  // Saved meals are authenticated-only; the recipe box is premium-only.
  let saved: SavedMeal[] = [];
  let recipes: SavedRecipe[] = [];
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

    if (premium) {
      const { data: recipeRows } = await supabase
        .from('saved_recipes')
        .select('id, recipe_name, recipe_data, saved_at')
        .order('saved_at', { ascending: false });
      recipes = (recipeRows ?? []).map((r) => ({
        id: r.id,
        recipe_name: r.recipe_name,
        recipe_data: r.recipe_data as unknown as Recipe,
        saved_at: r.saved_at,
      }));
    }
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
        <MoodTrend sessions={visibleSessions} />

        {/* Weekly report: a live link for premium, an upsell otherwise. */}
        {user && (
          <Link
            href={premium ? '/report' : '/premium'}
            className="flex items-center justify-between rounded-3xl border border-zinc-200 bg-white p-4 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-surface dark:hover:border-zinc-700"
          >
            <span className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-ember/10 text-ember">
                <LineChart size={18} />
              </span>
              <span className="font-medium text-zinc-900 dark:text-zinc-50">
                Weekly mood report
                {!premium && (
                  <span className="ml-2 rounded-full bg-ember/10 px-2 py-0.5 text-xs font-medium text-ember">
                    Premium
                  </span>
                )}
              </span>
            </span>
            <ChevronRight size={18} className="text-zinc-400" />
          </Link>
        )}

        {recipes.length > 0 && (
          <section>
            <h2 className="mb-3 px-1 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
              Recipe box
            </h2>
            <div className="space-y-2.5">
              {recipes.map((r) => (
                <RecipeBoxRow key={r.id} recipe={r} />
              ))}
            </div>
          </section>
        )}

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

        {visibleSessions.length > 0 && (
          <section>
            <h2 className="mb-3 px-1 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
              Past check-ins
            </h2>
            <div className="space-y-4">
              {visibleSessions.map((s) => (
                <HistoryCard key={s.id} session={s} />
              ))}
            </div>
          </section>
        )}

        {truncated && (
          <Link
            href="/premium"
            className="block rounded-2xl border border-dashed border-ember/40 py-3 text-center text-sm font-semibold text-ember"
          >
            Unlock all {sessions.length} check-ins with Premium
          </Link>
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
