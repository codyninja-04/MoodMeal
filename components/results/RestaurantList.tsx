'use client';

import { useState } from 'react';
import { MapPin, Search } from 'lucide-react';
import { useLocation } from '@/hooks/useLocation';
import { RestaurantCard } from './RestaurantCard';
import type { Restaurant } from '@/types';

interface RestaurantListProps {
  searchTerm: string;
}

type Phase = 'prompt' | 'locating' | 'loading' | 'done' | 'empty' | 'manual';

// Self-contained nearby flow. We only ask for location here on the results page
// — never before the user has seen the value — and we warm them up with one
// line of copy before the browser's native permission prompt fires.
export function RestaurantList({ searchTerm }: RestaurantListProps) {
  const { requestLocation, setManualCoords } = useLocation();
  const [phase, setPhase] = useState<Phase>('prompt');
  const [results, setResults] = useState<Restaurant[]>([]);
  const [manualValue, setManualValue] = useState('');

  const fetchPlaces = async (body: Record<string, unknown>) => {
    setPhase('loading');
    try {
      const res = await fetch('/api/places', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ searchTerm, ...body }),
      });
      const data = await res.json();
      const list: Restaurant[] = data.restaurants ?? [];
      setResults(list);
      setPhase(list.length ? 'done' : 'empty');
    } catch {
      setPhase('empty');
    }
  };

  const useMyLocation = () => {
    setPhase('locating');
    if (!navigator.geolocation) {
      setPhase('manual');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setManualCoords(coords);
        fetchPlaces(coords);
      },
      () => setPhase('manual')
    );
  };

  const useManual = () => {
    if (!manualValue.trim()) return;
    fetchPlaces({ location: manualValue.trim() });
  };

  if (phase === 'prompt' || phase === 'locating') {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-300 p-5 text-center dark:border-zinc-700">
        <p className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
          We need your location to find restaurants near you.
        </p>
        <button
          type="button"
          onClick={useMyLocation}
          disabled={phase === 'locating'}
          className="inline-flex items-center gap-2 rounded-2xl bg-ember px-5 py-3 text-sm font-semibold text-white transition-transform active:scale-[0.98] disabled:opacity-60"
        >
          <MapPin size={16} />
          {phase === 'locating' ? 'Finding you…' : 'Use my location'}
        </button>
        <button
          type="button"
          onClick={() => setPhase('manual')}
          className="mt-3 block w-full text-xs text-zinc-400 underline-offset-2 hover:underline"
        >
          Or enter a suburb instead
        </button>
      </div>
    );
  }

  if (phase === 'manual') {
    return (
      <div className="rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800">
        <p className="mb-3 text-sm text-zinc-500 dark:text-zinc-400">
          Where are you? Type a suburb or city.
        </p>
        <div className="flex gap-2">
          <input
            value={manualValue}
            onChange={(e) => setManualValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && useManual()}
            placeholder="e.g. Tampines, Singapore"
            className="min-w-0 flex-1 rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-ember dark:border-zinc-700 dark:bg-ink"
          />
          <button
            type="button"
            onClick={useManual}
            className="flex items-center gap-1 rounded-xl bg-ember px-4 py-2.5 text-sm font-semibold text-white active:scale-[0.98]"
          >
            <Search size={15} />
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'loading') {
    return (
      <p className="py-2 text-sm text-zinc-400">Looking for spots nearby…</p>
    );
  }

  if (phase === 'empty') {
    return (
      <div className="rounded-2xl border border-zinc-200 p-5 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
        <p>No spots nearby for that one.</p>
        <button
          type="button"
          onClick={() => setPhase('manual')}
          className="mt-2 text-ember underline-offset-2 hover:underline"
        >
          Try a different area
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {results.map((r) => (
        <RestaurantCard key={r.placeId} restaurant={r} />
      ))}
    </div>
  );
}
