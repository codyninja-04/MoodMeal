import type { Restaurant } from '@/types';

interface PlacesApiResult {
  name: string;
  rating?: number;
  vicinity?: string;
  place_id: string;
  opening_hours?: { open_now?: boolean };
  price_level?: number;
}

async function search(
  searchTerm: string,
  lat: number,
  lng: number,
  radiusMeters: number
): Promise<PlacesApiResult[]> {
  const url = new URL(
    'https://maps.googleapis.com/maps/api/place/nearbysearch/json'
  );
  url.searchParams.set('keyword', searchTerm);
  url.searchParams.set('location', `${lat},${lng}`);
  url.searchParams.set('radius', radiusMeters.toString());
  url.searchParams.set('type', 'restaurant');
  url.searchParams.set('key', process.env.GOOGLE_PLACES_API_KEY!);

  const response = await fetch(url.toString());
  const data = await response.json();
  return (data.results ?? []) as PlacesApiResult[];
}

// Manual fallback path: turn a typed suburb/city into coordinates so the user
// who denied location can still get results. Uses the Geocoding API (same key).
export async function geocodeLocation(
  query: string
): Promise<{ lat: number; lng: number } | null> {
  const url = new URL('https://maps.googleapis.com/maps/api/geocode/json');
  url.searchParams.set('address', query);
  url.searchParams.set('key', process.env.GOOGLE_PLACES_API_KEY!);

  const response = await fetch(url.toString());
  const data = await response.json();
  const loc = data.results?.[0]?.geometry?.location;
  if (!loc) return null;
  return { lat: loc.lat, lng: loc.lng };
}

// Find restaurants serving the recommended dish. If the first pass comes back
// empty, widen the radius once before giving up — better one more try than a
// dead-end empty state when the user is standing somewhere quiet.
export async function findNearbyRestaurants(
  searchTerm: string,
  lat: number,
  lng: number,
  radiusMeters = 2000
): Promise<Restaurant[]> {
  let results = await search(searchTerm, lat, lng, radiusMeters);

  if (results.length === 0) {
    results = await search(searchTerm, lat, lng, radiusMeters * 2);
  }

  return results.slice(0, 5).map((place) => ({
    name: place.name,
    rating: place.rating ?? null,
    address: place.vicinity ?? '',
    placeId: place.place_id,
    openNow: place.opening_hours?.open_now ?? null,
    priceLevel: place.price_level ?? null,
  }));
}
