'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles } from 'lucide-react';
import { activatePremium } from '@/lib/premium-actions';

// Demo upgrade trigger. In production this would redirect to Stripe Checkout;
// here it activates premium directly so the gated features can be tried.
export function UpgradeButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const upgrade = async () => {
    setPending(true);
    const res = await activatePremium();
    if (res.ok) {
      router.push('/history');
      router.refresh();
    } else {
      setPending(false);
    }
  };

  return (
    <button
      type="button"
      onClick={upgrade}
      disabled={pending}
      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-ember py-4 text-base font-semibold text-white transition-transform active:scale-[0.98] disabled:opacity-60"
    >
      <Sparkles size={18} />
      {pending ? 'Activating…' : 'Go Premium'}
    </button>
  );
}
