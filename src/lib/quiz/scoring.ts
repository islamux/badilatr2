import { CATS } from '@/data/perfumes';
import { questions, noteMap } from './questions';
import type { Perfume } from '@/domain/types';

const QLABEL: Record<string, string> = {};
questions.forEach((q) =>
  q.options.forEach((o) => {
    QLABEL[o.value] = o.label;
  })
);

export function profileName(answers: string[]): string {
  const a = answers.join(' ');
  if (/gourmand|vanilla|sweet/.test(a)) return 'الجورماند الدافئ';
  if (/citrus|aromatic|aquatic|hot/.test(a)) return 'المنعش المضيء';
  if (/leather|spicy|smoke|boozy/.test(a)) return 'الشرقي الجريء';
  if (/woody|fougere|mild/.test(a)) return 'الخشبي الأنيق';
  if (/floral/.test(a)) return 'الزهري الأنيق';
  if (/musk|soft|aromatic/.test(a)) return 'النظيف العصري';
  return 'المتوازن الأنيق';
}

export function getReasons(d: Perfume, answers: string[]): string[] {
  const r: string[] = [];
  const all = answers.join(' ');
  const notes = (d.notes || []).concat(d.anotes || []);
  const fams = answers.filter((a) => Object.keys(CATS).includes(a));

  if (fams.includes(d.c))
    r.push('من عائلة ' + CATS[d.c].n + ' التي اخترتها');

  Object.keys(noteMap).forEach((k) => {
    if (
      all.includes(k) &&
      noteMap[k].some((x) => notes.join(' ').includes(x))
    ) {
      r.push('نوتة تحبها: ' + (QLABEL[k] || k));
    }
  });

  if (all.includes('soft') && d.ps <= 60) r.push('فوحانه هادئ ومناسب');
  if (all.includes('strong') && d.ps >= 75) r.push('فوحانه قوي ولافت');
  if (
    all.includes('hot') &&
    ['citrus', 'aquatic', 'aromatic'].includes(d.c)
  )
    r.push('مناسب للصيف والحر');
  if (
    (all.includes('cold') || all.includes('winter')) &&
    ['woody', 'oriental', 'gourmand'].includes(d.c)
  )
    r.push('دافئ ومناسب للشتاء');
  if (all.includes('dry') && d.c === 'gourmand') r.push('جورماند لكن بلمسة جافة');

  const occMap: Record<string, string[]> = {
    daily: ['يومي'],
    work: ['مكتب'],
    evening: ['سهرة', 'موعد'],
    night: ['مناسبات', 'سهرة'],
  };
  const occVal = answers[0];
  const tags = d.occ || [];
  if (
    occVal &&
    occMap[occVal] &&
    occMap[occVal].some((o) => tags.includes(o))
  ) {
    r.push('موسوم لـ' + occMap[occVal][0]);
  }

  if (r.length === 0) r.push('متوافق مع ذوقك العام');
  return r.slice(0, 2);
}

export function scorePerfume(d: Perfume, answers: string[]): number {
  const a = answers.join(' ');
  const notes = (d.notes || []).concat(d.anotes || []);
  const cat = d.c || '';
  let sc = 25;
  const fams = answers.filter((av) => Object.keys(CATS).includes(av));

  if (fams.includes(cat)) sc += 18;

  Object.keys(noteMap).forEach((k) => {
    if (a.includes(k) && noteMap[k].some((x) => notes.join(' ').includes(x)))
      sc += 7;
  });

  if (a.includes('strong')) sc += d.ps >= 75 ? 9 : -2;
  if (a.includes('soft')) sc += d.ps <= 60 ? 9 : -2;
  if (a.includes('mid') && d.ps > 55 && d.ps < 82) sc += 6;
  if (a.includes('dry') && cat === 'gourmand') sc -= 6;
  if (a.includes('sweet') && ['gourmand', 'oriental'].includes(cat)) sc += 7;
  if (a.includes('light') && ['gourmand', 'oriental'].includes(cat)) sc -= 3;
  if (a.includes('hot') && ['citrus', 'aquatic', 'aromatic'].includes(cat))
    sc += 8;
  if (
    (a.includes('cold') || a.includes('winter')) &&
    ['woody', 'oriental', 'gourmand'].includes(cat)
  )
    sc += 8;

  const occMap: Record<string, string[]> = {
    daily: ['يومي'],
    work: ['مكتب'],
    evening: ['سهرة', 'موعد'],
    night: ['مناسبات', 'سهرة'],
  };
  const t = answers[0];
  const tags = d.occ || [];
  if (t && occMap[t] && occMap[t].some((o) => tags.includes(o))) {
    sc += 8;
  } else {
    if (a.includes('morning') && ['citrus', 'aquatic', 'aromatic'].includes(cat))
      sc += 5;
    if (a.includes('evening') && ['woody', 'oriental'].includes(cat)) sc += 5;
    if (
      a.includes('night') &&
      ['oriental', 'gourmand', 'boozy'].includes(cat)
    )
      sc += 6;
    if (
      a.includes('work') &&
      ['aromatic', 'citrus', 'fougere'].includes(cat)
    )
      sc += 5;
    if (a.includes('daily') && d.bl) sc += 3;
    if (a.includes('party') && d.ps >= 70) sc += 4;
  }

  if (a.includes('hot') && tags.includes('صيف')) sc += 4;
  if (
    (a.includes('cold') || a.includes('winter')) &&
    tags.includes('شتاء')
  )
    sc += 4;

  sc += Math.round((d.rate - 4) * 8);
  return Math.max(25, Math.min(97, Math.round(sc)));
}

export interface QuizResult {
  perfume: Perfume;
  index: number;
  score: number;
  reasons: string[];
}

export function getResults(
  data: Perfume[],
  answers: string[]
): QuizResult[] {
  return data
    .map((d, i) => ({
      perfume: d,
      index: i,
      score: scorePerfume(d, answers),
      reasons: getReasons(d, answers),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}
