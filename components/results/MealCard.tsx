'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  MapPin,
  ChefHat,
  Clock,
  Bookmark,
  Share2,
  Check,
} from 'lucide-react';
import { NutritionReason } from './NutritionReason';
import { RestaurantList } from './RestaurantList';
import { RecipeView } from './RecipeView';
import { saveMeal, unsaveMeal } from '@/lib/actions';
import { encodeMeal } from '@/lib/share';
import type { MealRecommendation } from '@/types';

interface MealCardProps {
  meal: MealRecommendation;
  sessionId: string | null;
  isAuthed: boolean;
}

type Expanded = 'none' | 'nearby' | 'cook';

export function MealCard({ meal, sessionId, isAuthed }: MealCardProps) {
  const router = useRouter();
  const [expanded, setExpanded] = useState<Expanded>('none');
  const [savedId, setSavedId] = useState<string | null>(null);
  const [savePending, setSavePending] = useState(false);
  const [shared, setShared] = useState(false);

  const toggle = (next: Expanded) =>
    setExpanded((cur) => (cur === next ? 'none' : next));

  const handleSave = async () => {
    // Anonymous visitors can't save — send them to sign in instead.
    if (!isAuthed) {
      router.push('/login');
      return;
    }
    if (savePending) return;
    setSavePending(true);

    if (savedId) {
      const res = await unsaveMeal(savedId);
      if (res.ok) setSavedId(null);
    } else {
      const res = await saveMeal(meal, sessionId);
      if (res.ok) setSavedId(res.id);
    }
    setSavePending(false);
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/share?m=${encodeMeal(meal)}`;
    const shareData = {
      title: `${meal.meal_name} — MoodMeal`,
      text: meal.mood_reason,
      url,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(url);
        setShared(true);
        setTimeout(() => setShared(false), 1800);
      }
    } catch {
      // User dismissed the share sheet — nothing to do.
    }
  };

  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-surface">
      <div className="mb-2 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            {meal.meal_name}
          </h3>
          <span className="mt-1 inline-block rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
            {meal.cuisine_type}
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={handleSave}
            disabled={savePending}
            aria-label={savedId ? 'Remove from saved' : 'Save this meal'}
            aria-pressed={Boolean(savedId)}
            className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors disabled:opacity-50 ${
              savedId
                ? 'bg-ember/10 text-ember'
                : 'text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            <Bookmark size={18} className={savedId ? 'fill-ember' : ''} />
          </button>
          <button
            type="button"
            onClick={handleShare}
            aria-label="Share this meal"
            className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
          >
            {shared ? <Check size={18} className="text-sage" /> : <Share2 size={18} />}
          </button>
        </div>
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
