'use client';

import { Star, MapPin } from 'lucide-react';
import { DeliveryLinks } from './DeliveryLinks';
import type { Restaurant } from '@/types';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

const PRICE: Record<number, string> = {
  0: 'Free',
  1: '$',
  2: '$$',
  3: '$$$',
  4: '$$$$',
};

// The main row opens Google Maps for directions; delivery links sit below as
// their own anchors (no nesting), each affiliate-tagged when IDs are set.
export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    restaurant.name
  )}&query_place_id=${restaurant.placeId}`;

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-surface dark:hover:border-zinc-700">
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between gap-3"
      >
        <div className="min-w-0">
          <p className="truncate font-medium text-zinc-900 dark:text-zinc-50">
            {restaurant.name}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-zinc-500 dark:text-zinc-400">
            {restaurant.rating != null && (
              <span className="flex items-center gap-1">
                <Star size={14} className="fill-amber-400 text-amber-400" />
                {restaurant.rating.toFixed(1)}
              </span>
            )}
            {restaurant.priceLevel != null && (
              <span>{PRICE[restaurant.priceLevel]}</span>
            )}
            {restaurant.openNow != null && (
              <span className={restaurant.openNow ? 'text-sage' : 'text-ember'}>
                {restaurant.openNow ? 'Open now' : 'Closed'}
              </span>
            )}
          </div>
          {restaurant.address && (
            <p className="mt-1 truncate text-xs text-zinc-400 dark:text-zinc-500">
              {restaurant.address}
            </p>
          )}
        </div>
        <MapPin size={20} className="shrink-0 text-ember" />
      </a>

      <DeliveryLinks restaurantName={restaurant.name} />
    </div>
  );
}
