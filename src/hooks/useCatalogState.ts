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

/** Merge the currently-parsed URL hash params into filter state */
function mergeHashIntoState(prev: FilterState): FilterState {
  const kv = loadState();
  const next = { ...prev };
  applyHash(kv, (key, value) => {
    (next as unknown as Record<string, unknown>)[key] = value;
  });
  return next;
}

export function useCatalogState() {
  const [state, setState] = useState<FilterState>(INITIAL);
  const [ready, setReady] = useState(false);

  // Restore state from URL hash once after mount (client-only, avoids hydration mismatch)
  // setState-in-effect is intentional: the prerendered HTML ships defaults and the
  // URL hash is an external store only readable on the client after mount.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(mergeHashIntoState);
    setReady(true);
  }, []);

  // Re-apply state when the hash changes externally (manual edit, back/forward).
  // history.replaceState does NOT fire hashchange, so our own writes won't loop.
  useEffect(() => {
    const onHash = () => setState(mergeHashIntoState);
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  // Persist state to URL hash on every change (after initial restore)
  useEffect(() => {
    if (!ready || typeof window === 'undefined') return;
    const current = window.location.hash;
    // Preserve a #p-N deep link until the user actually changes filter state
    if (current.startsWith('#p-') && stateEquals(INITIAL, state)) return;
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

function stateEquals(
  a: FilterState,
  b: FilterState
): boolean {
  return (
    a.term === b.term &&
    a.sortMode === b.sortMode &&
    a.favOnly === b.favOnly &&
    a.curBrand === b.curBrand &&
    a.curCat === b.curCat &&
    a.curOcc === b.curOcc &&
    a.curNote === b.curNote &&
    a.blindOnly === b.blindOnly
  );
}
