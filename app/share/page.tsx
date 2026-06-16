import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { decodeMeal } from '@/lib/share';
import { brand } from '@/lib/brand';

interface SharePageProps {
  searchParams: { m?: string };
}

// Public, no-auth view of a single recommended meal — what a share link opens.
export function generateMetadata({ searchParams }: SharePageProps): Metadata {
  const meal = searchParams.m ? decodeMeal(searchParams.m) : null;
  if (!meal) {
    return { title: brand.name };
  }

  const title = `${meal.meal_name} — ${brand.name}`;
  const ogImage = `/api/og?m=${encodeURIComponent(searchParams.m!)}`;

  return {
    title,
    description: meal.mood_reason,
    openGraph: {
      title,
      description: meal.mood_reason,
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: meal.mood_reason,
      images: [ogImage],
    },
  };
}

export default function SharePage({ searchParams }: SharePageProps) {
  const meal = searchParams.m ? decodeMeal(searchParams.m) : null;

  if (!meal) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center px-6 text-center">
        <p className="text-zinc-500 dark:text-zinc-400">
          That link didn&apos;t carry a meal.
        </p>
        <Link href="/" className="mt-4 text-ember hover:underline">
          Go to MoodMeal
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-6 py-12">
      <span className="mb-6 inline-flex w-fit items-center gap-2 rounded-full bg-ember/10 px-3 py-1 text-xs font-medium text-ember">
        {brand.emoji} Recommended on {brand.name}
      </span>

      <div className="rounded-3xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-surface">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {meal.meal_name}
        </h1>
        {meal.cuisine_type && (
          <span className="mt-2 inline-block rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
            {meal.cuisine_type}
          </span>
        )}
        <p className="mt-4 leading-relaxed text-zinc-700 dark:text-zinc-200">
          {meal.mood_reason}
        </p>
        {meal.key_nutrients.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {meal.key_nutrients.map((n) => (
              <span
                key={n}
                className="rounded-full bg-sage/10 px-2.5 py-1 text-xs font-medium text-sage"
              >
                {n}
              </span>
            ))}
          </div>
        )}
      </div>

      <Link
        href="/mood"
        className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-ember py-4 text-base font-semibold text-white transition-transform active:scale-[0.98]"
      >
        Check your own mood <ArrowRight size={18} />
      </Link>
      <p className="mt-3 text-center text-sm text-zinc-400">{brand.tagline}</p>
    </main>
  );
}
