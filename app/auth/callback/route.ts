import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server';

// Magic-link landing. Exchanges the code for a session, then claims any
// anonymous check-ins made on this browser by matching the cookie token to the
// freshly signed-in user — so history carries over from before they signed up.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/history';

  if (code && isSupabaseConfigured()) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const token = cookies().get('mm_session')?.value;
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (token && user) {
        await supabase
          .from('mood_sessions')
          .update({ user_id: user.id })
          .eq('session_token', token)
          .is('user_id', null);
      }
    }
  }

  return NextResponse.redirect(`${origin}${next}`);
}
