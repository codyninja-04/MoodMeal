'use client';

import { OptionPill } from '@/components/ui/OptionPill';

interface StressQuestionProps {
  onSelect: (stress: number) => void;
}

// Question 2. Five pills mapped to the 1-5 stress scale. Tap to advance,
// no confirm step.
const OPTIONS: { label: string; value: number }[] = [
  { label: 'Zen', value: 1 },
  { label: 'Chill', value: 2 },
  { label: 'Okay', value: 3 },
  { label: 'Stressed', value: 4 },
  { label: 'Overwhelmed', value: 5 },
];

export function StressQuestion({ onSelect }: StressQuestionProps) {
  return (
    <div className="animate-fade-up">
      <h2 className="mb-1 text-2xl font-semibold tracking-tight">
        Where&apos;s your head at?
      </h2>
      <p className="mb-10 text-zinc-500 dark:text-zinc-400">
        Pick the one that fits.
      </p>

      <div className="space-y-3">
        {OPTIONS.map((opt) => (
          <OptionPill
            key={opt.value}
            label={opt.label}
            onClick={() => onSelect(opt.value)}
          />
        ))}
      </div>
    </div>
  );
}
