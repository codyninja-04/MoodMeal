import type { MoodSessionRecord } from '@/types';

interface HistoryCardProps {
  session: MoodSessionRecord;
}

const ENERGY_LABEL = ['', 'Drained', 'Low', 'Okay', 'Good', 'Buzzing'];
const STRESS_LABEL = ['', 'Zen', 'Chill', 'Okay', 'Stressed', 'Overwhelmed'];

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

// One past check-in: when it was, how they felt, and what we suggested.
export function HistoryCard({ session }: HistoryCardProps) {
  const meals = session.recommendations?.recommendations ?? [];

  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-surface">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
          {formatDate(session.created_at)}
        </span>
        <span className="rounded-full bg-ember/10 px-2.5 py-0.5 text-xs font-medium capitalize text-ember">
          {session.craving_type}
        </span>
      </div>

      <div className="mb-4 flex gap-2 text-xs text-zinc-500 dark:text-zinc-400">
        <span className="rounded-full bg-zinc-100 px-2.5 py-1 dark:bg-zinc-800">
          Energy: {ENERGY_LABEL[session.energy_level] ?? session.energy_level}
        </span>
        <span className="rounded-full bg-zinc-100 px-2.5 py-1 dark:bg-zinc-800">
          {STRESS_LABEL[session.stress_level] ?? session.stress_level}
        </span>
      </div>

      {meals.length > 0 && (
        <ul className="space-y-1.5">
          {meals.map((m, i) => (
            <li
              key={`${m.meal_name}-${i}`}
              className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-200"
            >
              <span className="h-1 w-1 rounded-full bg-ember" />
              {m.meal_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
