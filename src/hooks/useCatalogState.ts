'use client';
import { useState, useCallback, useEffect } from 'react';
import type { FilterState } from '@/domain/types';
import { loadState, applyHash, saveHash } from '@/lib/catalog/state';

const INITIAL: FilterState = {
  term: '',
  sortMode: 'rank',
  favOnly: false,
  curBrand: 'all',
  curCat: 'all',
  curOcc: 'all',
  curNote: 'all',
  blindOnly: false,
};

export function useCatalogState() {
  const [state, setState] = useState<FilterState>(INITIAL);
  const [ready, setReady] = useState(false);

  // Restore state from URL hash once after mount (client-only, avoids hydration mismatch)
  useEffect(() => {
    const kv = loadState();
    setState((prev) => {
      const next = { ...prev };
      applyHash(kv, (key, value) => {
        (next as unknown as Record<string, unknown>)[key] = value;
      });
      return next;
    });
    setReady(true);
  }, []);

  // Persist state to URL hash on every change (after initial restore)
  useEffect(() => {
    if (!ready || typeof window === 'undefined') return;
    const h = saveHash({
      curCat: state.curCat,
      term: state.term.trim(),
      blindOnly: state.blindOnly,
      sortMode: state.sortMode,
      curBrand: state.curBrand,
      favOnly: state.favOnly,
      curOcc: state.curOcc,
      curNote: state.curNote,
    });
    const current = window.location.hash;
    if ((h || '#') !== current) {
      window.history.replaceState(
        null,
        '',
        h || window.location.pathname + window.location.search
      );
    }
  }, [state, ready]);

  const update = useCallback(
    <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
      setState((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const reset = useCallback(() => setState(INITIAL), []);

  return { state, update, reset };
}
