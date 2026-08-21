import { norm } from '@/lib/arabic';
import { CATS } from '@/data/perfumes';
import type { Perfume, FilterState } from '@/domain/types';

/** Pre-computed normalized search haystacks for each perfume */
export function buildHaystacks(data: Perfume[]): string[] {
  return data.map((d) =>
    norm(
      [d.n, d.en, d.br, d.bar, d.an, d.abr, d.abar, CATS[d.c]?.n ?? '']
        .concat(d.notes, d.anotes)
        .join(' ')
    )
  );
}

/** Check if perfume at index i matches the given filter state */
export function matches(
  i: number,
  s: FilterState,
  data: Perfume[],
  haystacks: string[],
  favs: Set<number>
): boolean {
  const d = data[i];
  return (
    (s.curCat === 'all' || d.c === s.curCat) &&
    (s.curBrand === 'all' || d.br === s.curBrand) &&
    (!s.term || haystacks[i].indexOf(s.term) > -1) &&
    (!s.blindOnly || d.bla) &&
    (!s.favOnly || favs.has(i)) &&
    (s.curOcc === 'all' || (d.occ != null && d.occ.indexOf(s.curOcc) > -1)) &&
    (s.curNote === 'all' ||
      (d.notes != null && d.notes.some((x) => x.indexOf(s.curNote) > -1)))
  );
}
