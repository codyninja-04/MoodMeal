import type { MealRecommendation } from '@/types';

// We keep share links self-contained (no DB lookup) by packing a trimmed meal
// into a URL-safe base64 blob. Works for anonymous users and unfurls into an OG
// card via /api/og.

type SharePayload = Pick<
  MealRecommendation,
  'meal_name' | 'cuisine_type' | 'mood_reason' | 'key_nutrients'
>;

function toBase64Url(input: string): string {
  const b64 =
    typeof window === 'undefined'
      ? Buffer.from(input, 'utf-8').toString('base64')
      : btoa(unescape(encodeURIComponent(input)));
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(input: string): string {
  const b64 = input.replace(/-/g, '+').replace(/_/g, '/');
  return typeof window === 'undefined'
    ? Buffer.from(b64, 'base64').toString('utf-8')
    : decodeURIComponent(escape(atob(b64)));
}

export function encodeMeal(meal: MealRecommendation): string {
  const payload: SharePayload = {
    meal_name: meal.meal_name,
    cuisine_type: meal.cuisine_type,
    mood_reason: meal.mood_reason,
    key_nutrients: meal.key_nutrients,
  };
  return toBase64Url(JSON.stringify(payload));
}

export function decodeMeal(encoded: string): SharePayload | null {
  try {
    const parsed = JSON.parse(fromBase64Url(encoded)) as SharePayload;
    if (!parsed?.meal_name) return null;
    return {
      meal_name: parsed.meal_name,
      cuisine_type: parsed.cuisine_type ?? '',
      mood_reason: parsed.mood_reason ?? '',
      key_nutrients: Array.isArray(parsed.key_nutrients)
        ? parsed.key_nutrients
        : [],
    };
  } catch {
    return null;
  }
}
