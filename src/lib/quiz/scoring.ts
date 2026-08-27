import { CATS } from '@/data/perfumes';
import { questions, noteMap } from './questions';
import type { Perfume } from '@/domain/types';

const QLABEL: Record<string, string> = {};
questions.forEach((q) =>
  q.options.forEach((o) => {
    QLABEL[o.value] = o.label;
  })
);

const OCC_MAP: Record<string, string[]> = {
  daily: ['يومي'],
  work: ['مكتب'],
  evening: ['سهرة', 'موعد'],
  night: ['مناسبات', 'سهرة'],
};

/** Quiz answers: single-answer questions are strings, multi-select ones arrays (Q2 families, Q4 notes). */
export type QuizAnswers = (string | string[])[];

/** Family selections live in the Q2 multi-answer slot (legacy reads answers[1]). */
function famsOf(answers: QuizAnswers): string[] {
  return Array.isArray(answers[1]) ? answers[1] : [];
}

function joined(answers: QuizAnswers): string {
  return answers.join(' ');
}

function firstAnswer(answers: QuizAnswers): string | undefined {
  return typeof answers[0] === 'string' ? answers[0] : undefined;
}

export function profileName(answers: QuizAnswers): string {
  const a = answers.join(' ');
  if (/gourmand|vanilla|sweet/.test(a)) return 'الجورماند الدافئ';
  if (/citrus|aromatic|aquatic|hot/.test(a)) return 'المنعش المضيء';
  if (/leather|spicy|smoke|boozy/.test(a)) return 'الشرقي الجريء';
  if (/woody|fougere|mild/.test(a)) return 'الخشبي الأنيق';
  if (/floral/.test(a)) return 'الزهري الأنيق';
  if (/musk|soft|aromatic/.test(a)) return 'النظيف العصري';
  return 'المتوازن الأنيق';
}

export function getReasons(d: Perfume, answers: QuizAnswers): string[] {
  const r: string[] = [];
  const all = joined(answers);
  const notes = (d.notes || []).concat(d.anotes || []);
  const fams = famsOf(answers);

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

  const occVal = firstAnswer(answers);
  const tags = d.occ || [];
  if (
    occVal &&
    OCC_MAP[occVal] &&
    OCC_MAP[occVal].some((o) => tags.includes(o))
  ) {
    r.push('موسوم لـ' + OCC_MAP[occVal][0]);
  }

  if (r.length === 0) r.push('متوافق مع ذوقك العام');
  return r.slice(0, 2);
}

export function scorePerfume(d: Perfume, answers: QuizAnswers): number {
  const a = joined(answers);
  const notes = (d.notes || []).concat(d.anotes || []);
  const cat = d.c || '';
  let sc = 25;
  const fams = famsOf(answers);

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

  const t = firstAnswer(answers);
  const tags = d.occ || [];
  if (t && OCC_MAP[t] && OCC_MAP[t].some((o) => tags.includes(o))) {
    sc += 8;
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
  answers: QuizAnswers
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
