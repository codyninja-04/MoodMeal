import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase/types';

// Free users see a capped slice of their history; premium unlocks the rest,
// the recipe box, and the weekly report.
export const FREE_HISTORY_LIMIT = 7;

// Reads the premium flag for a user. Defaults to false on any miss so the app
// fails closed (free tier) rather than handing out premium by accident.
export async function isPremium(
  supabase: SupabaseClient<Database>,
  userId: string
): Promise<boolean> {
  const { data } = await supabase
    .from('profiles')
    .select('is_premium')
    .eq('id', userId)
    .single();
  return data?.is_premium ?? false;
}
