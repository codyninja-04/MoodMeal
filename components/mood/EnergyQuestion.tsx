'use client';

import { useState } from 'react';
import { Battery, Flame } from 'lucide-react';
import { SliderInput } from '@/components/ui/SliderInput';

interface EnergyQuestionProps {
  onSelect: (energy: number) => void;
}

// Question 1. Slider auto-advances once the user commits a value (on release),
// so there's no Next button — tap, drag, done.
export function EnergyQuestion({ onSelect }: EnergyQuestionProps) {
  const [value, setValue] = useState(3);

  return (
    <div className="animate-fade-up">
      <h2 className="mb-1 text-2xl font-semibold tracking-tight">
        How&apos;s your energy?
      </h2>
      <p className="mb-10 text-zinc-500 dark:text-zinc-400">
        Drag to where you&apos;re at right now.
      </p>

      <SliderInput
        value={value}
        onChange={setValue}
        lowAnchor={<Battery className="text-zinc-400" />}
        highAnchor={<Flame className="text-ember" />}
      />

      <button
        type="button"
        onClick={() => onSelect(value)}
        className="mt-12 w-full rounded-2xl bg-ember py-4 text-base font-semibold text-white transition-transform active:scale-[0.98]"
      >
        That&apos;s me
      </button>
    </div>
  );
}
