'use client';

import { useEffect, useState } from 'react';
import { Lightbulb } from 'lucide-react';
import type { Recipe } from '@/types';

interface RecipeViewProps {
  mealName: string;
  prepTime: number;
}

// Clean cooking card, not a blog post. Loads the recipe on mount for the meal
// the user picked to cook at home.
export function RecipeView({ mealName, prepTime }: RecipeViewProps) {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch('/api/recipe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mealName, prepTime }),
        });
        if (!res.ok) throw new Error();
        const data: Recipe = await res.json();
        if (active) setRecipe(data);
      } catch {
        if (active) setError(true);
      }
    })();
    return () => {
      active = false;
    };
  }, [mealName, prepTime]);

  if (error) {
    return (
      <p className="py-2 text-sm text-ember">
        Couldn&apos;t pull up that recipe. Try again?
      </p>
    );
  }

  if (!recipe) {
    return (
      <p className="py-2 text-sm text-zinc-400">Writing your recipe…</p>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">
          Ingredients
        </h4>
        <ul className="space-y-1.5">
          {recipe.ingredients.map((ing, i) => (
            <li
              key={i}
              className="flex justify-between gap-3 border-b border-dashed border-zinc-200 pb-1.5 text-sm dark:border-zinc-800"
            >
              <span className="text-zinc-700 dark:text-zinc-200">
                {ing.name}
              </span>
              <span className="shrink-0 text-zinc-400">{ing.quantity}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">
          Steps
        </h4>
        <ol className="space-y-2.5">
          {recipe.steps.map((step, i) => (
            <li key={i} className="flex gap-3 text-sm">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ember/10 text-xs font-semibold text-ember">
                {i + 1}
              </span>
              <span className="text-zinc-700 dark:text-zinc-200">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {recipe.tip && (
        <div className="flex gap-2.5 rounded-2xl bg-sage/10 p-3.5 text-sm text-zinc-700 dark:text-zinc-200">
          <Lightbulb size={18} className="shrink-0 text-sage" />
          <span>{recipe.tip}</span>
        </div>
      )}
    </div>
  );
}
