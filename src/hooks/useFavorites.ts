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
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setFavs(loadFavs());
    setLoaded(true);
  }, []);

  const toggle = useCallback((i: number) => {
    setFavs((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(next)));
      return next;
    });
  }, []);

  const has = useCallback((i: number) => favs.has(i), [favs]);

  return { favs, toggle, has, loaded, count: favs.size };
}
