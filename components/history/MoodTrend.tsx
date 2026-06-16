import type { MoodSessionRecord } from '@/types';

interface MoodTrendProps {
  sessions: MoodSessionRecord[];
}

// A lightweight read on how energy and stress have moved across recent
// check-ins — no chart library, just proportional bars oldest → newest.
export function MoodTrend({ sessions }: MoodTrendProps) {
  // Sessions arrive newest-first; show them left-to-right as oldest-first.
  const points = [...sessions].reverse().slice(-10);
  if (points.length < 2) return null;

  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-surface">
      <h2 className="mb-4 text-sm font-semibold text-zinc-700 dark:text-zinc-200">
        Your last {points.length} check-ins
      </h2>

      <div className="flex items-end gap-1.5">
        {points.map((p) => (
          <div key={p.id} className="flex flex-1 flex-col items-center gap-1">
            <div className="flex h-24 w-full items-end justify-center gap-0.5">
              <span
                title={`Energy ${p.energy_level}/5`}
                className="w-1/2 rounded-t bg-ember/70"
                style={{ height: `${(p.energy_level / 5) * 100}%` }}
              />
              <span
                title={`Stress ${p.stress_level}/5`}
                className="w-1/2 rounded-t bg-zinc-300 dark:bg-zinc-600"
                style={{ height: `${(p.stress_level / 5) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-center gap-4 text-xs text-zinc-400">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-ember/70" /> Energy
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-zinc-300 dark:bg-zinc-600" />{' '}
          Stress
        </span>
      </div>
    </div>
  );
}
