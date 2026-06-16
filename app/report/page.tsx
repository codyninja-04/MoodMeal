import Link from 'next/link';
import { ArrowLeft, Lock } from 'lucide-react';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server';
import { isPremium } from '@/lib/premium';
import type { MoodSessionRecord } from '@/types';

export const dynamic = 'force-dynamic';

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto min-h-dvh max-w-md px-6 py-8">
      <header className="mb-6 flex items-center gap-3">
        <Link
          href="/history"
          aria-label="Back to history"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 transition-colors hover:text-zinc-800 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          <ArrowLeft size={18} />
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">This week</h1>
      </header>
      {children}
    </main>
  );
}

function Locked({ message }: { message: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-zinc-300 p-8 text-center dark:border-zinc-700">
      <Lock size={22} className="mx-auto mb-3 text-zinc-400" />
      <p className="mb-4 text-zinc-500 dark:text-zinc-400">{message}</p>
      <Link
        href="/premium"
        className="inline-block rounded-2xl bg-ember px-5 py-3 text-sm font-semibold text-white"
      >
        Go Premium
      </Link>
    </div>
  );
}

const STRESS_LABEL = ['', 'Zen', 'Chill', 'Okay', 'Stressed', 'Overwhelmed'];

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-surface">
      <p className="text-sm text-zinc-500 dark:text-zinc-400">{label}</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        {value}
      </p>
    </div>
  );
}

export default async function ReportPage() {
  if (!isSupabaseConfigured()) {
    return (
      <Shell>
        <Locked message="The weekly report needs Supabase configured." />
      </Shell>
    );
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <Shell>
        <Locked message="Sign in and go Premium to see your weekly report." />
      </Shell>
    );
  }
  if (!(await isPremium(supabase, user.id))) {
    return (
      <Shell>
        <Locked message="The weekly mood report is a Premium feature." />
      </Shell>
    );
  }

  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const { data: rows } = await supabase
    .from('mood_sessions')
    .select(
      'id, energy_level, stress_level, craving_type, recommendations, created_at'
    )
    .eq('user_id', user.id)
    .gte('created_at', weekAgo)
    .order('created_at', { ascending: false });

  const sessions = (rows ?? []) as unknown as MoodSessionRecord[];

  if (sessions.length === 0) {
    return (
      <Shell>
        <div className="rounded-3xl border border-dashed border-zinc-300 p-8 text-center dark:border-zinc-700">
          <p className="text-zinc-500 dark:text-zinc-400">
            No check-ins this week yet. Come back after a few.
          </p>
        </div>
      </Shell>
    );
  }

  const n = sessions.length;
  const avg = (key: 'energy_level' | 'stress_level') =>
    sessions.reduce((sum, s) => sum + s[key], 0) / n;

  const avgEnergy = avg('energy_level');
  const avgStress = avg('stress_level');

  // Most frequent craving across the week.
  const cravingCounts = sessions.reduce<Record<string, number>>((acc, s) => {
    acc[s.craving_type] = (acc[s.craving_type] ?? 0) + 1;
    return acc;
  }, {});
  const topCraving = Object.entries(cravingCounts).sort(
    (a, b) => b[1] - a[1]
  )[0][0];

  return (
    <Shell>
      <p className="mb-5 text-zinc-500 dark:text-zinc-400">
        {n} check-in{n === 1 ? '' : 's'} over the last 7 days.
      </p>
      <div className="grid grid-cols-2 gap-3">
        <Stat label="Avg energy" value={`${avgEnergy.toFixed(1)} / 5`} />
        <Stat
          label="Avg stress"
          value={STRESS_LABEL[Math.round(avgStress)] ?? avgStress.toFixed(1)}
        />
        <Stat label="Check-ins" value={String(n)} />
        <Stat label="Top craving" value={topCraving} />
      </div>
    </Shell>
  );
}
