import Link from 'next/link';
import { ArrowLeft, Check, Clock3, BookOpen, LineChart } from 'lucide-react';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server';
import { isPremium } from '@/lib/premium';
import { UpgradeButton } from '@/components/premium/UpgradeButton';
import { brand } from '@/lib/brand';

export const dynamic = 'force-dynamic';

const PERKS = [
  {
    icon: Clock3,
    title: 'Unlimited history',
    body: 'Keep every check-in, not just the last handful.',
  },
  {
    icon: BookOpen,
    title: 'Recipe box',
    body: 'Save the recipes you love and find them in one place.',
  },
  {
    icon: LineChart,
    title: 'Weekly mood report',
    body: 'See how your energy, stress, and cravings trend each week.',
  },
];

export default async function PremiumPage() {
  let alreadyPremium = false;
  let loggedIn = false;

  if (isSupabaseConfigured()) {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    loggedIn = Boolean(user);
    if (user) alreadyPremium = await isPremium(supabase, user.id);
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col px-6 py-8">
      <header className="mb-8 flex items-center gap-3">
        <Link
          href="/history"
          aria-label="Back"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 transition-colors hover:text-zinc-800 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          <ArrowLeft size={18} />
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">
          {brand.name} Premium
        </h1>
      </header>

      <p className="mb-8 text-zinc-500 dark:text-zinc-400">
        Get more out of your check-ins. One simple upgrade.
      </p>

      <div className="mb-8 space-y-4">
        {PERKS.map((perk) => (
          <div key={perk.title} className="flex gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-ember/10 text-ember">
              <perk.icon size={20} />
            </div>
            <div>
              <p className="font-medium text-zinc-900 dark:text-zinc-50">
                {perk.title}
              </p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {perk.body}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto">
        {alreadyPremium ? (
          <div className="flex items-center justify-center gap-2 rounded-2xl bg-sage/10 py-4 font-semibold text-sage">
            <Check size={18} /> You&apos;re on Premium
          </div>
        ) : loggedIn || !isSupabaseConfigured() ? (
          <UpgradeButton />
        ) : (
          <Link
            href="/login"
            className="flex w-full items-center justify-center rounded-2xl bg-ember py-4 text-base font-semibold text-white"
          >
            Sign in to upgrade
          </Link>
        )}
        <p className="mt-3 text-center text-xs text-zinc-400">
          Cancel anytime. {brand.name} stays free to use.
        </p>
      </div>
    </main>
  );
}
