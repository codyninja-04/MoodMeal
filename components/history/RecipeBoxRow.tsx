'use client';

import { useState, useTransition } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { unsaveRecipe } from '@/lib/premium-actions';
import type { SavedRecipe } from '@/types';

interface RecipeBoxRowProps {
  recipe: SavedRecipe;
}

// A saved recipe in the premium recipe box. Collapsed by default; expands to
// the full ingredient/step list so the box stays scannable.
export function RecipeBoxRow({ recipe }: RecipeBoxRowProps) {
  const [removed, setRemoved] = useState(false);
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  if (removed) return null;

  const remove = () =>
    startTransition(async () => {
      const res = await unsaveRecipe(recipe.id);
      if (res.ok) setRemoved(true);
    });

  const data = recipe.recipe_data;

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-surface">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex min-w-0 flex-1 items-center gap-2 text-left"
        >
          <ChevronDown
            size={16}
            className={`shrink-0 text-zinc-400 transition-transform ${
              open ? 'rotate-180' : ''
            }`}
          />
          <span className="truncate font-medium text-zinc-900 dark:text-zinc-50">
            {recipe.recipe_name}
          </span>
        </button>
        <button
          type="button"
          onClick={remove}
          disabled={pending}
          aria-label="Remove recipe"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-ember disabled:opacity-50 dark:hover:bg-zinc-800"
        >
          <X size={16} />
        </button>
      </div>

      {open && (
        <div className="mt-3 space-y-3 border-t border-zinc-100 pt-3 text-sm dark:border-zinc-800">
          <ul className="space-y-1">
            {data.ingredients?.map((ing, i) => (
              <li
                key={i}
                className="flex justify-between gap-3 text-zinc-600 dark:text-zinc-300"
              >
                <span>{ing.name}</span>
                <span className="shrink-0 text-zinc-400">{ing.quantity}</span>
              </li>
            ))}
          </ul>
          <ol className="list-decimal space-y-1 pl-4 text-zinc-600 dark:text-zinc-300">
            {data.steps?.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
