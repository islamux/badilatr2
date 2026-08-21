import { rawPerfumes, applyBoozy } from '@/data/perfumes';
import { applyOccasions } from '@/lib/catalog/occasions';
import { assignScores } from '@/lib/catalog/similarity';
import type { Perfume } from '@/domain/types';

/** Initialize and enrich the raw perfume dataset. Call once per page module. */
export function initCatalogData(): Perfume[] {
  const data = applyBoozy(rawPerfumes);
  applyOccasions(data);
  assignScores(data);
  return data;
}
