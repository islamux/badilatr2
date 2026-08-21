import { normEn } from '@/lib/arabic';
import type { Perfume, Occasion } from '@/domain/types';

export const OCC_ICON: Record<string, string> = {
  'مكتب': '🏢',
  'صيف': '☀️',
  'سهرة': '🌙',
  'موعد': '❤️',
  'شتاء': '❄️',
  'مناسبات': '👔',
  'يومي': '🔄'
};

export const OCC_LABEL: Record<string, string> = {
  'مكتب': 'المكتب',
  'صيف': 'الصيف',
  'سهرة': 'السهرة',
  'موعد': 'الموعد',
  'شتاء': 'الشتاء',
  'مناسبات': 'المناسبات',
  'يومي': 'اليومي'
};

export const OCCS: Occasion[] = ['مكتب', 'صيف', 'سهرة', 'موعد', 'شتاء', 'مناسبات', 'يومي'];

// WARDROBE — English perfume name → occasion tags
const WARDROBE: Record<string, Occasion[]> = {
  'Guerlain Homme': ['مكتب', 'يومي'],
  'Weekend for Men': ['مكتب', 'صيف', 'يومي'],
  'Kenzo Homme Marine': ['صيف', 'يومي'],
  'Salvador Dali Pour Homme': ['مكتب', 'يومي'],
  'Italian Bergamot': ['مكتب', 'صيف'],
  'Orange Sanguine': ['صيف', 'يومي'],
  'Bergamotto di Calabria': ['مكتب', 'صيف'],
  'Eau de Pamplemousse Rose': ['صيف', 'يومي'],
  'Clean Reserve Skin': ['مكتب', 'يومي'],
  'Jacomo de Jacomo': ['مكتب', 'يومي'],
  'Emanuel Ungaro III': ['مكتب', 'يومي'],
  'Karl Lagerfeld Classic': ['مكتب', 'يومي'],
  'Memoire d\u2019une Odeur': ['مكتب', 'يومي'],
  'Code Colonia': ['مكتب', 'صيف'],
  'Egra': ['مكتب', 'صيف', 'يومي'],
  'Rasasi Blue': ['صيف', 'يومي'],
  'Naseem': ['مكتب', 'صيف', 'يومي'],
  'Cool': ['صيف', 'يومي'],
  'Warm Cotton': ['مكتب', 'يومي'],
  'Clémentine California': ['صيف', 'يومي'],
  'Bleu de Chanel': ['مكتب', 'سهرة', 'يومي'],
  'Terre d\u2019Hermès': ['مكتب', 'يومي'],
  'Acqua di Giò': ['صيف', 'يومي'],
  'Light Blue Pour Homme': ['صيف', 'يومي'],
  'Cool Water': ['صيف', 'يومي'],
  'Nautica Voyage': ['صيف', 'يومي'],
  'Versace Pour Homme': ['مكتب', 'صيف', 'يومي'],
  'Invictus': ['صيف', 'يومي'],
  'Sauvage EDT': ['مكتب', 'يومي'],
  'Y EDP': ['مكتب', 'سهرة', 'يومي'],
  'Dylan Blue': ['مكتب', 'يومي'],
  'Explorer': ['مكتب', 'يومي'],
  'Hawas': ['صيف', 'يومي'],
  'Eros': ['سهرة', 'موعد'],
  'Ultra Male': ['سهرة', 'موعد'],
  'Le Male': ['سهرة', 'موعد', 'شتاء'],
  'La Nuit de L\u2019Homme': ['سهرة', 'موعد', 'شتاء'],
  'Dior Homme Intense': ['سهرة', 'موعد', 'شتاء'],
  'Stronger With You': ['سهرة', 'موعد', 'شتاء'],
  '1 Million': ['سهرة', 'موعد'],
  'Le Male Le Parfum': ['سهرة', 'موعد', 'شتاء'],
  'Bleu Noir': ['سهرة', 'موعد'],
  'Layton': ['سهرة', 'موعد', 'شتاء'],
  'Herod': ['شتاء', 'سهرة', 'موعد'],
  'Spicebomb Extreme': ['شتاء', 'سهرة'],
  'Angels\u2019 Share': ['شتاء', 'سهرة', 'مناسبات'],
  'Naxos': ['شتاء', 'سهرة', 'مناسبات'],
  'Khamrah': ['شتاء', 'سهرة'],
  'Kalemat': ['شتاء', 'سهرة', 'مناسبات'],
  'La Yuqawam': ['سهرة', 'شتاء', 'مناسبات'],
  'Baccarat Rouge 540': ['مناسبات', 'سهرة'],
  'Aventus': ['مكتب', 'مناسبات', 'سهرة'],
  'Oud for Greatness': ['مناسبات', 'شتاء'],
  'Interlude Man': ['شتاء', 'مناسبات'],
  'Sauvage Elixir': ['سهرة', 'شتاء', 'مناسبات'],
  'Tuxedo': ['سهرة', 'مناسبات', 'شتاء'],
  /* الدفعة العاشرة (٦ جديدة + ٤ موسومة في القائمة الحالية) */
  'Acqua di Gio Parfum': ['مكتب', 'صيف', 'يومي'],
  'Ombré Leather Parfum': ['سهرة', 'شتاء', 'مناسبات'],
  '1 Million Royal': ['سهرة', 'موعد'],
  'Phantom Intense': ['سهرة', 'موعد'],
  'Stronger With You Forever': ['سهرة', 'موعد', 'شتاء'],
  'Armani Code Parfum': ['مكتب', 'سهرة', 'يومي'],
  'Eros Energy': ['صيف', 'يومي'],
  'Invictus Victory Elixir': ['سهرة', 'موعد', 'يومي'],
  'Gentleman Réserve Privée': ['سهرة', 'موعد', 'شتاء'],
  'Born in Roma Intense': ['سهرة', 'موعد']
};

// Pre-compute normalized lookup
const WLOOK: Record<string, Occasion[]> = {};
for (const k in WARDROBE) {
  WLOOK[normEn(k)] = WARDROBE[k];
}

export function lookupOccasions(en: string): Occasion[] {
  return WLOOK[normEn(en)] || [];
}

/** Apply occasion tags to all perfumes */
export function applyOccasions(data: Perfume[]): void {
  data.forEach((d) => {
    d.occ = lookupOccasions(d.en);
  });
}
