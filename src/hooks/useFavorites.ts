'use client';
import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'p100favs';

function loadFavs(): Set<number> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch { return new Set(); }
}

export function useFavorites() {
  const [favs, setFavs] = useState<Set<number>>(new Set());
  const [ready, setReady] = useState(false);

  // localStorage is an external store readable only on the client; restoring after
  // mount (not lazily in useState) keeps the prerendered HTML hydration-safe.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFavs(loadFavs());
    setReady(true);
  }, []);

  const toggle = useCallback((i: number) => {
    setFavs((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  }, []);

  useEffect(() => {
    if (!ready || typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(favs)));
    } catch {
      /* ignore quota/private-mode failures */
    }
  }, [ready, favs]);

  return { favs, toggle, count: favs.size };
}
