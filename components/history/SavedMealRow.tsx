'use client';

import { useState, useTransition } from 'react';
import { X } from 'lucide-react';
import { unsaveMeal } from '@/lib/actions';
import type { SavedMeal } from '@/types';

interface SavedMealRowProps {
  saved: SavedMeal;
}

export function SavedMealRow({ saved }: SavedMealRowProps) {
  const [removed, setRemoved] = useState(false);
  const [pending, startTransition] = useTransition();

  if (removed) return null;

  const remove = () =>
    startTransition(async () => {
      const res = await unsaveMeal(saved.id);
      if (res.ok) setRemoved(true);
    });

  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-surface">
      <div className="min-w-0">
        <p className="truncate font-medium text-zinc-900 dark:text-zinc-50">
          {saved.meal_name}
        </p>
        {saved.meal_data?.mood_reason && (
          <p className="mt-0.5 truncate text-sm text-zinc-500 dark:text-zinc-400">
            {saved.meal_data.mood_reason}
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={remove}
        disabled={pending}
        aria-label="Remove saved meal"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-ember disabled:opacity-50 dark:hover:bg-zinc-800"
      >
        <X size={16} />
      </button>
    </div>
  );
}
