'use client';

import { useState } from 'react';
import type { CravingType } from '@/types';

export type MoodStep = 'energy' | 'stress' | 'craving';

export interface MoodFlowState {
  step: MoodStep;
  energy: number | null;
  stress: number | null;
  craving: CravingType | null;
}

const ORDER: MoodStep[] = ['energy', 'stress', 'craving'];

// Owns the three-question flow state. Per the project conventions this lives in
// a hook and is passed down via props, not context.
export function useMoodFlow() {
  const [state, setState] = useState<MoodFlowState>({
    step: 'energy',
    energy: null,
    stress: null,
    craving: null,
  });

  const goTo = (step: MoodStep) => setState((s) => ({ ...s, step }));

  const advance = () =>
    setState((s) => {
      const idx = ORDER.indexOf(s.step);
      const next = ORDER[Math.min(idx + 1, ORDER.length - 1)];
      return { ...s, step: next };
    });

  const back = () =>
    setState((s) => {
      const idx = ORDER.indexOf(s.step);
      const prev = ORDER[Math.max(idx - 1, 0)];
      return { ...s, step: prev };
    });

  // Questions 1 and 2 auto-advance; question 3 confirms explicitly.
  const setEnergy = (energy: number) =>
    setState((s) => ({ ...s, energy, step: 'stress' }));

  const setStress = (stress: number) =>
    setState((s) => ({ ...s, stress, step: 'craving' }));

  const setCraving = (craving: CravingType) =>
    setState((s) => ({ ...s, craving }));

  const isComplete =
    state.energy !== null && state.stress !== null && state.craving !== null;

  const progress = (ORDER.indexOf(state.step) + 1) / ORDER.length;

  return {
    state,
    progress,
    isComplete,
    goTo,
    advance,
    back,
    setEnergy,
    setStress,
    setCraving,
  };
}
