'use client';

import { MealCard } from './MealCard';
import type { MealRecommendation } from '@/types';

interface MealListProps {
  meals: MealRecommendation[];
}

export function MealList({ meals }: MealListProps) {
  return (
    <div className="space-y-4">
      {meals.map((meal, i) => (
        <MealCard key={`${meal.meal_name}-${i}`} meal={meal} />
      ))}
    </div>
  );
}
