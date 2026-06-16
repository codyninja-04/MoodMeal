'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

// Optional sign-in. Auth only exists so people can keep their mood history —
// the core flow never requires it. Magic link, no passwords.
export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>(
    'idle'
  );

  const sendLink = async () => {
    if (!email.trim()) return;
    setStatus('sending');
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/history`,
        },
      });
      setStatus(error ? 'error' : 'sent');
    } catch {
      setStatus('error');
    }
  };

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-6 py-12">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
      >
        <ArrowLeft size={16} /> Back
      </Link>

      <h1 className="text-2xl font-semibold tracking-tight">Save your history</h1>
      <p className="mt-2 text-zinc-500 dark:text-zinc-400">
        Sign in to keep your check-ins and saved meals. We&apos;ll email you a
        link — no password.
      </p>

      {status === 'sent' ? (
        <p className="mt-8 rounded-2xl bg-sage/10 p-4 text-sm text-zinc-700 dark:text-zinc-200">
          Check your inbox for a sign-in link.
        </p>
      ) : (
        <div className="mt-8 space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendLink()}
            placeholder="you@example.com"
            className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3.5 outline-none focus:border-ember dark:border-zinc-700 dark:bg-surface"
          />
          <button
            type="button"
            onClick={sendLink}
            disabled={status === 'sending'}
            className="w-full rounded-2xl bg-ember py-4 text-base font-semibold text-white transition-transform active:scale-[0.98] disabled:opacity-60"
          >
            {status === 'sending' ? 'Sending…' : 'Email me a link'}
          </button>
          {status === 'error' && (
            <p className="text-center text-sm text-ember">
              Couldn&apos;t send that link. Try again?
            </p>
          )}
        </div>
      )}
    </main>
  );
}
