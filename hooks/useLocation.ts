'use client';

import { useState } from 'react';

interface Coords {
  lat: number;
  lng: number;
}

export function useLocation() {
  const [coords, setCoords] = useState<Coords | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }
    setLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLoading(false);
      },
      () => {
        setError('Could not get your location');
        setLoading(false);
      }
    );
  };

  // Lets the manual suburb/city fallback feed coordinates back into the flow.
  const setManualCoords = (next: Coords) => {
    setCoords(next);
    setError(null);
  };

  return { coords, error, loading, requestLocation, setManualCoords };
}
