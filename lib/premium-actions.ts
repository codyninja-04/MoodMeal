'use server';

import { revalidatePath } from 'next/cache';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server';
import { isPremium } from '@/lib/premium';
import type { Json } from '@/lib/supabase/types';
import type { Recipe } from '@/types';

// Activate premium for the signed-in user.
//
// NOTE: this is the demo path. In production this action would create a Stripe
// Checkout session and return its URL; a Stripe webhook would then flip
// profiles.is_premium once payment succeeds. With no billing keys configured we
// set the flag directly so the gated features are reachable end to end.
export async function activatePremium(): Promise<{ ok: boolean }> {
  if (!isSupabaseConfigured()) return { ok: false };

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false };

  const { error } = await supabase
    .from('profiles')
    .upsert({ id: user.id, is_premium: true });
  if (error) return { ok: false };

  revalidatePath('/history');
  revalidatePath('/report');
  return { ok: true };
}

// Keep a recipe in the premium recipe box.
export async function saveRecipe(
  recipeName: string,
  recipe: Recipe
): Promise<{ ok: boolean; reason?: 'not-authed' | 'not-premium' | 'error' }> {
  if (!isSupabaseConfigured()) return { ok: false, reason: 'error' };

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, reason: 'not-authed' };

  if (!(await isPremium(supabase, user.id))) {
    return { ok: false, reason: 'not-premium' };
  }

  const { error } = await supabase.from('saved_recipes').insert({
    user_id: user.id,
    recipe_name: recipeName,
    recipe_data: recipe as unknown as Json,
  });
  if (error) return { ok: false, reason: 'error' };

  revalidatePath('/history');
  return { ok: true };
}

export async function unsaveRecipe(id: string): Promise<{ ok: boolean }> {
  if (!isSupabaseConfigured()) return { ok: false };

  const supabase = createClient();
  const { error } = await supabase.from('saved_recipes').delete().eq('id', id);
  if (error) return { ok: false };

  revalidatePath('/history');
  return { ok: true };
}
