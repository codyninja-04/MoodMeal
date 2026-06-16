'use client';

import { Bike } from 'lucide-react';
import { deliveryLinks } from '@/lib/affiliates';

interface DeliveryLinksProps {
  restaurantName: string;
}

// Affiliate order-now links under each restaurant. Kept as separate anchors
// (not wrapping the whole card) so they don't nest inside the maps link.
export function DeliveryLinks({ restaurantName }: DeliveryLinksProps) {
  const links = deliveryLinks(restaurantName);

  return (
    <div className="mt-2.5 flex items-center gap-2">
      <span className="flex items-center gap-1 text-xs text-zinc-400">
        <Bike size={13} /> Order in
      </span>
      {links.map((link) => (
        <a
          key={link.platform}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="rounded-full border border-zinc-200 px-2.5 py-1 text-xs font-medium text-zinc-600 transition-colors hover:border-ember hover:text-ember dark:border-zinc-700 dark:text-zinc-300"
        >
          {link.platform}
        </a>
      ))}
    </div>
  );
}
