import { useState, useCallback } from 'react';
import type { SortMode } from '@/domain/types';

export interface CatalogState {
  term: string;
  sortMode: SortMode;
  favOnly: boolean;
  curBrand: string;
  curCat: string;
  curOcc: string;
  curNote: string;
  blindOnly: boolean;
}

const INITIAL: CatalogState = {
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
  const [state, setState] = useState<CatalogState>(INITIAL);

  const update = useCallback(
    <K extends keyof CatalogState>(key: K, value: CatalogState[K]) => {
      setState((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const reset = useCallback(() => setState(INITIAL), []);

  return { state, update, reset };
}
