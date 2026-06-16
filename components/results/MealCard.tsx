'use client';

import { useState } from 'react';
import { MapPin, ChefHat, Clock } from 'lucide-react';
import { NutritionReason } from './NutritionReason';
import { RestaurantList } from './RestaurantList';
import { RecipeView } from './RecipeView';
import type { MealRecommendation } from '@/types';

interface MealCardProps {
  meal: MealRecommendation;
}

type Expanded = 'none' | 'nearby' | 'cook';

export function MealCard({ meal }: MealCardProps) {
  const [expanded, setExpanded] = useState<Expanded>('none');

  const toggle = (next: Expanded) =>
    setExpanded((cur) => (cur === next ? 'none' : next));

  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-surface">
      <div className="mb-1 flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {meal.meal_name}
        </h3>
        <span className="shrink-0 rounded-full bg-zinc-100 px-2.5 py-1 text-xs text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
          {meal.cuisine_type}
        </span>
      </div>

      <div className="mb-3">
        <NutritionReason reason={meal.mood_reason} />
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        {meal.key_nutrients.map((n) => (
          <span
            key={n}
            className="rounded-full bg-sage/10 px-2.5 py-1 text-xs font-medium text-sage"
          >
            {n}
          </span>
        ))}
        <span className="ml-auto flex items-center gap-1 text-xs text-zinc-400">
          <Clock size={12} /> {meal.prep_time_minutes} min
        </span>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => toggle('nearby')}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-2xl py-3 text-sm font-semibold transition-colors ${
            expanded === 'nearby'
              ? 'bg-ember text-white'
              : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200'
          }`}
        >
          <MapPin size={15} /> Find nearby
        </button>
        <button
          type="button"
          onClick={() => toggle('cook')}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-2xl py-3 text-sm font-semibold transition-colors ${
            expanded === 'cook'
              ? 'bg-ember text-white'
              : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200'
          }`}
        >
          <ChefHat size={15} /> Cook at home
        </button>
      </div>

      {expanded !== 'none' && (
        <div className="mt-4 animate-fade-up border-t border-zinc-100 pt-4 dark:border-zinc-800">
          {expanded === 'nearby' && (
            <RestaurantList searchTerm={meal.search_term} />
          )}
          {expanded === 'cook' && (
            <RecipeView
              mealName={meal.meal_name}
              prepTime={meal.prep_time_minutes}
            />
          )}
        </div>
      )}
    </div>
  );
}
