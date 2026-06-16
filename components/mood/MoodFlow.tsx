'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useMoodFlow } from '@/hooks/useMoodFlow';
import { EnergyQuestion } from './EnergyQuestion';
import { StressQuestion } from './StressQuestion';
import { CravingQuestion } from './CravingQuestion';
import type { CravingType, RecommendResult } from '@/types';

// Where we stash the recommendation between /mood and /results so the results
// page paints instantly instead of refetching on navigation.
export const RESULT_STORAGE_KEY = 'mm_last_result';

export function MoodFlow() {
  const router = useRouter();
  const flow = useMoodFlow();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (craving: CravingType) => {
    flow.setCraving(craving);
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          energy: flow.state.energy,
          stress: flow.state.stress,
          craving,
        }),
      });

      if (!res.ok) throw new Error('recommend failed');

      const data: RecommendResult = await res.json();
      sessionStorage.setItem(RESULT_STORAGE_KEY, JSON.stringify(data));
      router.push('/results');
    } catch {
      setError('Something went wrong getting your recommendations. Try again?');
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col px-6 py-8">
      {/* Progress + back */}
      <div className="mb-10 flex items-center gap-4">
        {flow.state.step !== 'energy' && (
          <button
            type="button"
            onClick={flow.back}
            aria-label="Go back"
            className="text-zinc-400 transition-colors hover:text-zinc-600 dark:hover:text-zinc-200"
          >
            <ArrowLeft size={22} />
          </button>
        )}
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
          <div
            className="h-full rounded-full bg-ember transition-all duration-300"
            style={{ width: `${flow.progress * 100}%` }}
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-center">
        {submitting ? (
          <p className="animate-pulse text-center text-lg text-zinc-500 dark:text-zinc-400">
            Reading the room…
          </p>
        ) : (
          <>
            {flow.state.step === 'energy' && (
              <EnergyQuestion onSelect={flow.setEnergy} />
            )}
            {flow.state.step === 'stress' && (
              <StressQuestion onSelect={flow.setStress} />
            )}
            {flow.state.step === 'craving' && (
              <CravingQuestion onConfirm={submit} />
            )}
          </>
        )}

        {error && (
          <p className="mt-6 text-center text-sm text-ember">{error}</p>
        )}
      </div>
    </div>
  );
}
