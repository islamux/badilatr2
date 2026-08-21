import { priceRank } from '@/lib/arabic';
import type { Perfume, SortMode } from '@/domain/types';

/** Sort indices by the given mode, returning a new sorted array */
export function sortBy(
  idxs: number[],
  mode: SortMode,
  data: Perfume[]
): number[] {
  return idxs.slice().sort((ia, ib) => {
    const A = data[ia];
    const B = data[ib];
    if (mode === 'rate') return B.rate - A.rate;
    if (mode === 'pf') return B.pf - A.pf;
    if (mode === 'ps') return B.ps - A.ps;
    if (mode === 'price') return priceRank(A.price) - priceRank(B.price);
    if (mode === 'name') return A.n.localeCompare(B.n, 'ar');
    return ia - ib; // 'rank' — original order
  });
}
