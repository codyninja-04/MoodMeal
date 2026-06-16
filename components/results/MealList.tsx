'use client';

import { MealCard } from './MealCard';
import type { MealRecommendation } from '@/types';

interface MealListProps {
  meals: MealRecommendation[];
  sessionId: string | null;
  isAuthed: boolean;
}

export function MealList({ meals, sessionId, isAuthed }: MealListProps) {
  return (
    <div className="space-y-4">
      {meals.map((meal, i) => (
        <MealCard
          key={`${meal.meal_name}-${i}`}
          meal={meal}
          sessionId={sessionId}
          isAuthed={isAuthed}
        />
      ))}
    </div>
  );
}
