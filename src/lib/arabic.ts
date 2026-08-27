const AR = '٠١٢٣٤٥٦٧٨٩';

/** Convert western digits to Arabic-Indic digits */
export function arN(n: number | string): string {
  return String(n).replace(/\d/g, (d) => AR[+d]);
}

/** Format a number with Arabic-Indic decimal */
export function arDec(n: number): string {
  return arN(n.toFixed(1)).replace('.', '٫');
}

/** Normalize Arabic text for search: remove diacritics, unify alef/ta-marbuta/yaa */
export function norm(s: string): string {
  return s
    .toLowerCase()
    .replace(/[\u064B-\u0652\u0640]/g, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي');
}

/** Normalize Arabic text for keys (no lowercase, no collapse) */
export function normAr(s: string): string {
  return String(s)
    .replace(/[\u064B-\u0652\u0640]/g, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Normalize English text for keys */
export function normEn(s: string): string {
  return String(s)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

/** Map price tier to numeric rank */
export function priceRank(p: string): number {
  return p === '$$' ? 2 : p === '$$$' ? 3 : 1;
}
