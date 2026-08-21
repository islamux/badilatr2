export interface Category {
  n: string;
  d: string;
  c: string;
  c2: string;
}

export interface Perfume {
  c: string;
  n: string;
  en: string;
  br: string;
  bar: string;
  notes: string[];
  an: string;
  abr: string;
  abar: string;
  anotes: string[];
  pf: number;
  ps: number;
  af: number;
  as: number;
  bl: boolean;
  bla: boolean;
  rate: number;
  price: '$' | '$$' | '$$$';
  occ?: string[];
  sim?: number;
}

export interface NoteEntry {
  n: string;
  icon: string;
  cat: string;
  d: string;
  count?: number;
}

export type Occasion = 'مكتب' | 'صيف' | 'سهرة' | 'موعد' | 'شتاء' | 'مناسبات' | 'يومي';

export type SortMode = 'rank' | 'rate' | 'pf' | 'ps' | 'price' | 'name';

export interface FilterState {
  term: string;
  sortMode: SortMode;
  favOnly: boolean;
  curBrand: string;
  curCat: string;
  curOcc: string;
  curNote: string;
  blindOnly: boolean;
}
