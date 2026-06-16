import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { brand } from '@/lib/brand';

export default function LandingPage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-between px-6 py-12">
      <div className="flex flex-1 flex-col justify-center">
        <span className="mb-6 inline-flex w-fit items-center gap-2 rounded-full bg-ember/10 px-3 py-1 text-xs font-medium text-ember">
          {brand.emoji} {brand.name}
        </span>

        <h1 className="text-4xl font-semibold leading-tight tracking-tight">
          Eat for how you{' '}
          <span className="text-ember">feel</span>, not what you crave.
        </h1>

        <p className="mt-5 text-lg leading-relaxed text-zinc-500 dark:text-zinc-400">
          Most food apps ask what you want. You usually don&apos;t know — you
          know how you feel. Answer three quick questions and we&apos;ll find
          meals that actually help, backed by real nutrition science.
        </p>

        <Link
          href="/mood"
          className="mt-10 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-ember py-4 text-base font-semibold text-white transition-transform active:scale-[0.98]"
        >
          Check in <ArrowRight size={18} />
        </Link>

        <p className="mt-4 text-center text-sm text-zinc-400">
          Takes about 15 seconds. No account needed.
        </p>
      </div>

      <ol className="mt-10 grid grid-cols-3 gap-3 text-center text-xs text-zinc-400">
        <li>
          <span className="block text-base">①</span>
          How you feel
        </li>
        <li>
          <span className="block text-base">②</span>
          Three meals
        </li>
        <li>
          <span className="block text-base">③</span>
          Nearby or cook
        </li>
      </ol>
    </main>
  );
}
