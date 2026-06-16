'use client';

import { createBrowserClient } from '@supabase/ssr';
import type { Database } from './types';

// Whether the public Supabase env is present. Auth is optional, so client
// components check this before assuming a user could ever be signed in.
export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
