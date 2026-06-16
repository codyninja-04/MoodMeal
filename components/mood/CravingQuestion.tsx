'use client';

import { useState } from 'react';
import { OptionPill } from '@/components/ui/OptionPill';
import type { CravingType } from '@/types';

interface CravingQuestionProps {
  onConfirm: (craving: CravingType) => void;
}

// Question 3. Eight options in a 2x4 grid. Unlike the first two, this one has a
// confirm button so the user can reconsider before we fire off the request.
const CRAVINGS: { label: string; value: CravingType; emoji: string }[] = [
  { label: 'Light', value: 'light', emoji: '🥗' },
  { label: 'Hearty', value: 'hearty', emoji: '🍲' },
  { label: 'Sweet', value: 'sweet', emoji: '🍫' },
  { label: 'Savoury', value: 'savoury', emoji: '🧀' },
  { label: 'Warm', value: 'warm', emoji: '🔥' },
  { label: 'Cold', value: 'cold', emoji: '🧊' },
  { label: 'Crunchy', value: 'crunchy', emoji: '🥨' },
  { label: 'Comfort', value: 'comfort', emoji: '🍜' },
];

export function CravingQuestion({ onConfirm }: CravingQuestionProps) {
  const [selected, setSelected] = useState<CravingType | null>(null);

  return (
    <div className="animate-fade-up">
      <h2 className="mb-1 text-2xl font-semibold tracking-tight">
        What sounds good?
      </h2>
      <p className="mb-8 text-zinc-500 dark:text-zinc-400">
        Go with your gut.
      </p>

      <div className="grid grid-cols-2 gap-3">
        {CRAVINGS.map((c) => (
          <OptionPill
            key={c.value}
            label={c.label}
            icon={c.emoji}
            selected={selected === c.value}
            onClick={() => setSelected(c.value)}
          />
        ))}
      </div>

      <button
        type="button"
        disabled={!selected}
        onClick={() => selected && onConfirm(selected)}
        className="mt-8 w-full rounded-2xl bg-ember py-4 text-base font-semibold text-white transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
      >
        Find my meals
      </button>
    </div>
  );
}
