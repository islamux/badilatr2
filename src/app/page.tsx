'use client';

import { useMemo, type ReactNode } from 'react';
import { CATS, rawPerfumes, applyBoozy } from '@/data/perfumes';
import { arN, norm } from '@/lib/arabic';
import { applyOccasions } from '@/lib/catalog/occasions';
import { assignScores, tierOf } from '@/lib/catalog/similarity';
import { buildHaystacks, matches } from '@/lib/catalog/filter';
import { sortBy } from '@/lib/catalog/sort';
import { NOTES_DB } from '@/lib/catalog/notes';
import type { Perfume, SortMode } from '@/domain/types';
import { useCatalogState } from '@/hooks/useCatalogState';
import { useFavorites } from '@/hooks/useFavorites';

const PERFUMES: Perfume[] = applyBoozy(rawPerfumes);
applyOccasions(PERFUMES);
assignScores(PERFUMES);

const HAYSTACKS = buildHaystacks(PERFUMES);
const CAT_KEYS = Object.keys(CATS);
const TOTAL = PERFUMES.length;

const BRAND_AR: Record<string, string> = {};
PERFUMES.forEach((d) => {
  if (!(d.br in BRAND_AR)) BRAND_AR[d.br] = d.bar;
});
const BRANDS = Object.keys(BRAND_AR).sort((a, b) => a.localeCompare(b));

const NOTE_OPTIONS = NOTES_DB.filter((nt) =>
  PERFUMES.some((d) => d.notes.some((x) => x.indexOf(nt.n) > -1))
).map((nt) => nt.n);

const SORTS: { v: SortMode; l: string }[] = [
  { v: 'rank', l: 'الترتيب الافتراضي' },
  { v: 'rate', l: 'الأعلى تقييماً' },
  { v: 'pf', l: 'الأقوى ثباتاً' },
  { v: 'ps', l: 'الأقوى فوحاناً' },
  { v: 'price', l: 'الأرخص سعراً' },
  { v: 'name', l: 'أبجدياً' },
];

const TOP_RATED = PERFUMES.reduce((a, b) => (b.rate > a.rate ? b : a));
const LONGEST = PERFUMES.reduce((a, b) => (b.pf > a.pf ? b : a));

const SIM_STYLES: Record<string, string> = {
  'sim-twin': 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300',
  'sim-strong': 'border-teal-400/30 bg-teal-400/10 text-teal-300',
  'sim-close': 'border-amber-400/30 bg-amber-400/10 text-amber-300',
  'sim-vibe': 'border-stone-400/30 bg-stone-400/10 text-stone-300',
};

const SELECT_CLS =
  'rounded-lg border border-[var(--line)] bg-[#1d150b] px-3 py-2 text-sm text-[var(--ink)] outline-none focus:border-[var(--gold)]';

function arDec(n: number): string {
  return arN(n.toFixed(1)).replace('.', '٫');
}

function Bar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-12 shrink-0 text-xs text-[var(--mut)]">{label}</span>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-l from-[var(--gold)] to-[var(--teal)]"
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="w-9 shrink-0 text-end text-xs tabular-nums text-[var(--mut)]">
        {arN(value)}٪
      </span>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors ' +
        (active
          ? 'border-[var(--gold)] bg-[var(--gold)] font-bold text-[#171009]'
          : 'border-[var(--line)] text-[var(--mut)] hover:border-[var(--gold)]/50 hover:text-[var(--ink)]')
      }
    >
      {children}
    </button>
  );
}

function PerfumeCard({
  p,
  isFav,
  onToggle,
}: {
  p: Perfume;
  isFav: boolean;
  onToggle: () => void;
}) {
  const cat = CATS[p.c];
  const tier = tierOf(p.sim ?? 75);
  return (
    <article className="relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-[var(--line)] bg-black/20 p-4 pt-5 transition-colors hover:border-[var(--gold)]/40">
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-1"
        style={{
          background: `linear-gradient(270deg, ${cat?.c ?? '#888'}, ${cat?.c2 ?? '#555'})`,
        }}
      />

      <header className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-bold">{p.n}</h3>
          <p dir="ltr" className="truncate text-right text-xs text-[var(--mut)]">
            {p.en} — {p.br}
          </p>
        </div>
        <button
          onClick={onToggle}
          aria-label={isFav ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
          aria-pressed={isFav}
          className={
            'shrink-0 rounded-full border px-2.5 py-1 text-base leading-none transition-colors ' +
            (isFav
              ? 'border-rose-400/50 bg-rose-400/15 text-rose-300'
              : 'border-[var(--line)] text-[var(--mut)] hover:text-rose-300')
          }
        >
          {isFav ? '♥' : '♡'}
        </button>
      </header>

      <div className="flex flex-wrap gap-1.5">
        {p.notes.map((nt) => (
          <span
            key={nt}
            className="rounded-md bg-white/5 px-2 py-0.5 text-xs text-[var(--mut)]"
          >
            {nt}
          </span>
        ))}
      </div>

      <div className="space-y-1.5">
        <Bar label="الثبات" value={p.pf} />
        <Bar label="الفوحان" value={p.ps} />
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs">
        {p.bla && (
          <span className="rounded-md border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 text-emerald-300">
            شراء أعمى ✓
          </span>
        )}
        <span className="rounded-md bg-white/5 px-2 py-0.5 text-[var(--mut)]">{p.price}</span>
        <span className="ms-auto font-bold text-[var(--gold)]">★ {arDec(p.rate)}</span>
      </div>

      <div className="rounded-xl border border-[var(--line)] bg-black/25 p-3">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-bold text-[var(--teal)]">{p.an}</p>
          <span
            className={
              'shrink-0 rounded-full border px-2 py-0.5 text-[11px] ' +
              (SIM_STYLES[tier.c] ?? '')
            }
          >
            {tier.t} {arN(p.sim ?? 75)}٪
          </span>
        </div>
        <p dir="ltr" className="text-right text-xs text-[var(--mut)]">
          {p.abr} — {p.abar}
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {p.anotes.map((nt) => (
            <span
              key={nt}
              className="rounded-md bg-[var(--teal)]/10 px-2 py-0.5 text-xs text-[var(--teal)]"
            >
              {nt}
            </span>
          ))}
        </div>
        <div className="mt-2 space-y-1.5">
          <Bar label="ثباته" value={p.af} />
          <Bar label="فوحانه" value={p.as} />
        </div>
      </div>
    </article>
  );
}

export default function Home() {
  const { state, update, reset } = useCatalogState();
  const { favs, toggle, count } = useFavorites();

  const visible = useMemo(() => {
    const fs = { ...state, term: norm(state.term.trim()) };
    const idxs: number[] = [];
    for (let i = 0; i < TOTAL; i++) {
      if (matches(i, fs, PERFUMES, HAYSTACKS, favs)) idxs.push(i);
    }
    return sortBy(idxs, fs.sortMode, PERFUMES);
  }, [state, favs]);

  const sections = useMemo(
    () =>
      CAT_KEYS.map((key) => ({
        key,
        cat: CATS[key],
        idxs: visible.filter((i) => PERFUMES[i].c === key),
      })).filter((s) => s.idxs.length > 0),
    [visible]
  );

  const pills: { label: string; clear: () => void }[] = [];
  if (state.term.trim())
    pills.push({ label: `بحث: ${state.term.trim()}`, clear: () => update('term', '') });
  if (state.blindOnly)
    pills.push({ label: 'الشراء الأعمى فقط', clear: () => update('blindOnly', false) });
  if (state.favOnly)
    pills.push({ label: 'المفضلة فقط', clear: () => update('favOnly', false) });
  if (state.curBrand !== 'all')
    pills.push({
      label: BRAND_AR[state.curBrand] ?? state.curBrand,
      clear: () => update('curBrand', 'all'),
    });
  if (state.curNote !== 'all')
    pills.push({ label: state.curNote, clear: () => update('curNote', 'all') });

  const today = new Date().toLocaleDateString('ar-EG', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[#161009]/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2.5">
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl bg-[var(--gold)] font-['Aref_Ruqaa'] text-lg leading-none text-[#171009]">
              عَطْـر
            </span>
            <span className="text-sm text-[var(--mut)]">بديل عطر ٢ · النسخة الرجالية</span>
          </div>
          <time suppressHydrationWarning className="hidden text-xs text-[var(--mut)] sm:block">
            {today}
          </time>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 pb-6 pt-10 text-center">
        <p className="text-sm tracking-wide text-[var(--gold)]">أرشيف موثّق · تحديث مستمر</p>
        <h1 className="mt-2 font-['Aref_Ruqaa'] text-[clamp(2.6rem,6vw,4.4rem)] leading-tight">
          بديل عطر <span className="text-[var(--gold)]">٢</span>
        </h1>
        <p className="mx-auto mt-3 max-w-2xl leading-relaxed text-[var(--mut)]">
          أفضل العطور الرجالية مع بدائلها العربية والاقتصادية — النوتات، الثبات والفوحان، وحكم
          الشراء الأعمى، مصنّفة في إحدى عشرة عائلة عطرية مع بحث وفلترة فورية.
        </p>
        <dl className="mx-auto mt-6 grid max-w-lg grid-cols-3 gap-3">
          {[
            ['عطر', TOTAL],
            ['عائلة', CAT_KEYS.length],
            ['نوتة', NOTE_OPTIONS.length],
          ].map(([label, n]) => (
            <div
              key={label}
              className="rounded-xl border border-[var(--line)] bg-black/20 px-2 py-3"
            >
              <dt className="order-2 text-xs text-[var(--mut)]">{label}</dt>
              <dd className="order-1 text-xl font-bold text-[var(--gold)]">{arN(n)}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-xs text-[var(--mut)]">
          الأعلى تقييماً: {TOP_RATED.n} ({arDec(TOP_RATED.rate)}) · الأقوى ثباتاً: {LONGEST.n} (
          {arN(LONGEST.pf)}٪)
        </p>
      </section>

      <div className="mx-auto max-w-6xl px-4">
        <div className="rounded-2xl border border-[var(--line)] bg-black/25 p-3">
          <div className="relative">
            <input
              type="search"
              value={state.term}
              onChange={(e) => update('term', e.target.value)}
              placeholder="ابحث بالاسم أو الدار أو النوتة…"
              aria-label="بحث"
              className="w-full rounded-xl border border-[var(--line)] bg-black/25 px-4 py-2.5 pl-10 text-sm outline-none placeholder:text-[var(--mut)] focus:border-[var(--gold)]"
            />
            {state.term && (
              <button
                onClick={() => update('term', '')}
                aria-label="مسح البحث"
                className="absolute inset-y-0 left-3 my-auto h-5 w-5 rounded-full text-sm text-[var(--mut)] hover:text-[var(--ink)]"
              >
                ✕
              </button>
            )}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <select
              value={state.sortMode}
              onChange={(e) => update('sortMode', e.target.value as SortMode)}
              aria-label="الترتيب"
              className={SELECT_CLS}
            >
              {SORTS.map((o) => (
                <option key={o.v} value={o.v}>
                  ↕ {o.l}
                </option>
              ))}
            </select>
            <select
              value={state.curBrand}
              onChange={(e) => update('curBrand', e.target.value)}
              aria-label="الدار"
              className={SELECT_CLS}
            >
              <option value="all">كل الدور</option>
              {BRANDS.map((b) => (
                <option key={b} value={b}>
                  {BRAND_AR[b]}
                </option>
              ))}
            </select>
            <select
              value={state.curNote}
              onChange={(e) => update('curNote', e.target.value)}
              aria-label="النوتة"
              className={SELECT_CLS}
            >
              <option value="all">كل النوتات</option>
              {NOTE_OPTIONS.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            <button
              onClick={() => update('blindOnly', !state.blindOnly)}
              aria-pressed={state.blindOnly}
              className={
                'rounded-lg border px-3 py-2 text-sm transition-colors ' +
                (state.blindOnly
                  ? 'border-[var(--gold)] bg-[var(--gold)] font-bold text-[#171009]'
                  : 'border-[var(--line)] text-[var(--mut)] hover:text-[var(--ink)]')
              }
            >
              👁 الشراء الأعمى فقط
            </button>
            <button
              onClick={() => update('favOnly', !state.favOnly)}
              aria-pressed={state.favOnly}
              className={
                'rounded-lg border px-3 py-2 text-sm transition-colors ' +
                (state.favOnly
                  ? 'border-rose-400/60 bg-rose-400/15 font-bold text-rose-300'
                  : 'border-[var(--line)] text-[var(--mut)] hover:text-[var(--ink)]')
              }
            >
              ♥ المفضلة ({arN(count)})
            </button>
          </div>

          {pills.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {pills.map((pill) => (
                <button
                  key={pill.label}
                  onClick={pill.clear}
                  className="rounded-full border border-[var(--gold)]/40 bg-[var(--gold)]/10 px-3 py-1 text-xs text-[var(--gold)] transition-colors hover:bg-[var(--gold)]/20"
                >
                  {pill.label} ✕
                </button>
              ))}
              <button
                onClick={reset}
                className="text-xs text-[var(--mut)] underline underline-offset-4 hover:text-[var(--ink)]"
              >
                مسح الكل
              </button>
            </div>
          )}

          <div className="mt-3 flex flex-wrap gap-2">
            <Chip active={state.curCat === 'all'} onClick={() => update('curCat', 'all')}>
              الكل
            </Chip>
            {CAT_KEYS.map((k) => (
              <Chip key={k} active={state.curCat === k} onClick={() => update('curCat', k)}>
                <span
                  aria-hidden
                  className="size-2 rounded-full"
                  style={{ background: CATS[k].c }}
                />
                {CATS[k].n}
              </Chip>
            ))}
          </div>

          <p className="mt-3 text-sm text-[var(--mut)]">
            يعرض {arN(visible.length)} من {arN(TOTAL)} عطر ✓
          </p>
        </div>
      </div>

      <main id="main" className="mx-auto max-w-6xl space-y-10 px-4 py-8">
        {sections.map((sec) => (
          <section key={sec.key} id={`sec-${sec.key}`}>
            <div className="mb-2 flex items-center gap-2 border-b border-[var(--line)] pb-2">
              <span
                aria-hidden
                className="size-3 rounded-full"
                style={{ background: sec.cat.c }}
              />
              <h2 className="text-xl font-bold">{sec.cat.n}</h2>
              <span className="text-sm text-[var(--mut)]">({arN(sec.idxs.length)} عطر)</span>
            </div>
            <p className="mb-4 text-sm text-[var(--mut)]">{sec.cat.d}</p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {sec.idxs.map((i) => (
                <PerfumeCard
                  key={i}
                  p={PERFUMES[i]}
                  isFav={favs.has(i)}
                  onToggle={() => toggle(i)}
                />
              ))}
            </div>
          </section>
        ))}

        {visible.length === 0 && (
          <div
            id="empty"
            className="rounded-2xl border border-dashed border-[var(--line)] py-16 text-center"
          >
            <p className="text-lg font-bold">لا توجد نتائج مطابقة</p>
            <p className="mt-1 text-sm text-[var(--mut)]">
              جرّب تعديل البحث أو إزالة بعض الفلاتر.
            </p>
            <button
              onClick={reset}
              className="mt-4 rounded-full bg-[var(--gold)] px-5 py-2 text-sm font-bold text-[#171009] transition-opacity hover:opacity-90"
            >
              مسح كل الفلاتر
            </button>
          </div>
        )}
      </main>

      <footer className="border-t border-[var(--line)] py-8 text-center text-sm text-[var(--mut)]">
        بديل عطر ٢ — دليل غير تجاري لمحبي العطور · الأسعار والتقييمات استرشادية
      </footer>
    </>
  );
}
