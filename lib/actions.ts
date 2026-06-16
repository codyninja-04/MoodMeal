'use server';

import { revalidatePath } from 'next/cache';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server';
import type { Json } from '@/lib/supabase/types';
import type { MealRecommendation } from '@/types';

export type SaveResult =
  | { ok: true; id: string }
  | { ok: false; reason: 'not-configured' | 'not-authed' | 'error' };

// Bookmark a meal for the signed-in user. Anonymous visitors can't save —
// the UI nudges them to log in rather than calling this.
export async function saveMeal(
  meal: MealRecommendation,
  sessionId: string | null
): Promise<SaveResult> {
  if (!isSupabaseConfigured()) return { ok: false, reason: 'not-configured' };

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, reason: 'not-authed' };

  const { data, error } = await supabase
    .from('saved_meals')
    .insert({
      user_id: user.id,
      session_id: sessionId,
      meal_name: meal.meal_name,
      meal_data: meal as unknown as Json,
    })
    .select('id')
    .single();

  if (error || !data) return { ok: false, reason: 'error' };
  return { ok: true, id: data.id };
}

// Remove a bookmark. RLS already scopes deletes to the owner, so id is enough.
export async function unsaveMeal(id: string): Promise<{ ok: boolean }> {
  if (!isSupabaseConfigured()) return { ok: false };

  const supabase = createClient();
  const { error } = await supabase.from('saved_meals').delete().eq('id', id);
  if (error) return { ok: false };

  revalidatePath('/history');
  return { ok: true };
}
