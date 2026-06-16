import { NextResponse } from 'next/server';
import { findNearbyRestaurants, geocodeLocation } from '@/lib/places';

// Always proxy Places through the server so the key never reaches the browser.
// Accepts either explicit coords or a typed location string (manual fallback).
export async function POST(req: Request) {
  try {
    const { searchTerm, lat, lng, location } = await req.json();

    if (!searchTerm || typeof searchTerm !== 'string') {
      return NextResponse.json(
        { error: 'Missing search term' },
        { status: 400 }
      );
    }

    let coords: { lat: number; lng: number } | null = null;

    if (typeof lat === 'number' && typeof lng === 'number') {
      coords = { lat, lng };
    } else if (typeof location === 'string' && location.trim()) {
      coords = await geocodeLocation(location.trim());
    }

    if (!coords) {
      return NextResponse.json(
        { error: 'Could not determine a location' },
        { status: 400 }
      );
    }

    const restaurants = await findNearbyRestaurants(
      searchTerm,
      coords.lat,
      coords.lng
    );
    return NextResponse.json({ restaurants });
  } catch (err) {
    console.error('places route error', err);
    return NextResponse.json(
      { error: 'Could not find restaurants' },
      { status: 500 }
    );
  }
}
