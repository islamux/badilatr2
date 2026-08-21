import { CATS } from '@/data/perfumes';
import { OCCS, lookupOccasions } from '@/lib/catalog/occasions';
import { isValid as isNoteValid } from '@/lib/catalog/notes';
import type { SortMode } from '@/domain/types';

/** Parse hash into state params */
export function loadState(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const kv: Record<string, string> = {};
  window.location.hash
    .slice(1)
    .split('&')
    .forEach((p) => {
      const s = p.split('=');
      if (s[0]) kv[s[0]] = decodeURIComponent(s.slice(1).join('='));
    });
  return kv;
}

/** Build hash string from state */
export function saveHash(params: {
  curCat: string;
  term: string;
  blindOnly: boolean;
  sortMode: SortMode;
  curBrand: string;
  favOnly: boolean;
  curOcc: string;
  curNote: string;
}): string {
  const p: string[] = [];
  if (params.curCat !== 'all') p.push('cat=' + params.curCat);
  if (params.term) p.push('q=' + encodeURIComponent(params.term));
  if (params.blindOnly) p.push('blind=1');
  if (params.sortMode !== 'rank') p.push('sort=' + params.sortMode);
  if (params.curBrand !== 'all')
    p.push('brand=' + encodeURIComponent(params.curBrand));
  if (params.favOnly) p.push('fav=1');
  if (params.curOcc !== 'all')
    p.push('occ=' + encodeURIComponent(params.curOcc));
  if (params.curNote !== 'all')
    p.push('note=' + encodeURIComponent(params.curNote));
  return p.length ? '#' + p.join('&') : '';
}

/** Apply parsed hash params to setState calls */
export function applyHash(
  kv: Record<string, string>,
  set: <K extends string>(key: K, value: unknown) => void
) {
  if (kv.cat && CATS[kv.cat]) set('curCat', kv.cat);
  if (typeof kv.q === 'string') set('term', kv.q);
  if (kv.blind === '1') set('blindOnly', true);
  if (['rank', 'rate', 'pf', 'ps', 'price', 'name'].includes(kv.sort))
    set('sortMode', kv.sort);
  if (typeof kv.brand === 'string') set('curBrand', kv.brand);
  if (kv.fav === '1') set('favOnly', true);
  if (OCCS.includes(kv.occ as never)) set('curOcc', kv.occ);
  if (typeof kv.note === 'string' && isNoteValid(kv.note))
    set('curNote', kv.note);
}
