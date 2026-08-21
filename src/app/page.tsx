'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { CATS } from '@/data/perfumes';
import { arN, arDec, norm } from '@/lib/arabic';
import { tierOf } from '@/lib/catalog/similarity';
import { buildHaystacks, matches } from '@/lib/catalog/filter';
import { sortBy } from '@/lib/catalog/sort';
import { NOTES_DB, populateNotes, glossaryGroups } from '@/lib/catalog/notes';
import { OCCS, OCC_ICON, OCC_LABEL } from '@/lib/catalog/occasions';
import { initCatalogData } from '@/lib/catalog/init';
import type { Perfume, SortMode } from '@/domain/types';
import { useCatalogState } from '@/hooks/useCatalogState';
import { useFavorites } from '@/hooks/useFavorites';
import { BottleBig, BottleMini } from '@/components/catalog/Bottle';

const PERFUMES = initCatalogData();
populateNotes(PERFUMES);

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
  { v: 'pf', l: 'الأطول ثباتاً' },
  { v: 'ps', l: 'الأقوى فوحاناً' },
  { v: 'price', l: 'السعر (الأرخص أولاً)' },
  { v: 'name', l: 'أبجدياً (أ‑ي)' },
];

const TOP_RATED = PERFUMES.reduce((a, b) => (b.rate > a.rate ? b : a));
const LONGEST = PERFUMES.reduce((a, b) => (b.pf > a.pf ? b : a));
const TOP_SILLAGE = PERFUMES.reduce((a, b) => (b.ps > a.ps ? b : a));
const ALT_COUNT = new Set(PERFUMES.map((d) => d.an)).size;

function bottleCode(br: string): string {
  return (
    (br
      .split(/\s+/)
      .map((w) => w[0])
      .join('')
      .replace(/[^a-zA-Z]/g, '')
      .slice(0, 2)
      .toUpperCase()) || '•'
  );
}

function meter(label: string, value: number) {
  return (
    <div className="m">
      <span>{label}</span>
      <div className="bar">
        <i style={{ width: `${value}%` }} />
      </div>
      <b>{arN(value)}٪</b>
    </div>
  );
}

function blindTag(bla: boolean) {
  return (
    <div className={'blind ' + (bla ? 'ok' : 'no')}>
      {bla ? '✓ آمن للشراء الأعمى' : '⚠ جرِّبه أولاً'}
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
        'fchip' + (active ? ' on' : '')
      }
    >
      {children}
    </button>
  );
}

function PerfumeCard({
  p,
  idx,
  isFav,
  onToggle,
}: {
  p: Perfume;
  idx: number;
  isFav: boolean;
  onToggle: () => void;
}) {
  const cat = CATS[p.c];
  const v = (idx * 7 + p.en.length) % 5;
  const tier = tierOf(p.sim ?? 75);
  const code = bottleCode(p.br);

  return (
    <article
      id={'p-' + idx}
      className="card in"
      data-cat={p.c}
      style={{ '--c1': cat?.c, '--c2': cat?.c2 } as React.CSSProperties}
    >
      <div className="stage" data-bottle={String(idx)}>
        <span className="rank">{arN(String(idx + 1).padStart(2, '0'))}</span>
        <button
          className={'fav' + (isFav ? ' on' : '')}
          onClick={onToggle}
          title="حفظ في المفضلة"
          aria-label={isFav ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
          aria-pressed={isFav}
        >
          {isFav ? '♥' : '♡'}
        </button>
        <span className="altbadge" title={'البديل: ' + p.an + ' — ' + p.abr}>
          <BottleMini idx={idx} c1={cat?.c ?? '#888'} c2={cat?.c2 ?? '#555'} code={code} variant={v} />
          <span className="abx">
            <b>البديل</b>
            <small>{p.abr}</small>
          </span>
        </span>
        <BottleBig idx={idx} c1={cat?.c ?? '#888'} c2={cat?.c2 ?? '#555'} code={code} variant={v} />
      </div>

      <div className="cbody">
        <div className="who">
          <h3>
            {p.n}
            <small>{p.en}</small>
          </h3>
          <p className="pbrand">
            {p.br} · {p.bar}
            <span className="price">{p.price}</span>
            <span className="rate">★ {arDec(p.rate)}</span>
          </p>
        </div>

        <div className="notes">
          <b>نوتات الأصلي</b>
          <div className="chips">
            {p.notes.map((nt) => (
              <span key={nt} className="chip">
                {nt}
              </span>
            ))}
          </div>
        </div>

        <div className="perf">
          {meter('الثبات', p.pf)}
          {meter('الفوحان', p.ps)}
          {blindTag(p.bla)}
        </div>

        {p.occ && p.occ.length > 0 && (
          <div className="occtags">
            {p.occ.map((o) => (
              <span key={o} className="occtag">
                {OCC_ICON[o]} {OCC_LABEL[o]}
              </span>
            ))}
          </div>
        )}

        <div className="altblock">
          <div className="alt-head">
            <span className="altpill">البديل المقترح</span>
            <b>{p.an}</b>
            <small>
              {p.abr} · {p.abar}
            </small>
            <span
              className={'sim ' + tier.c}
              title="درجة تشابه البديل مع الأصلي"
            >
              {tier.t} <b>{arN(p.sim ?? 75)}٪</b>
            </span>
          </div>
          <div className="chips">
            {p.anotes.map((nt) => (
              <span key={nt} className="chip a">
                {nt}
              </span>
            ))}
          </div>
          <div className="perf alt">
            {meter('ثباته', p.af)}
            {meter('فوحانه', p.as)}
            {blindTag(p.bla)}
          </div>
        </div>
      </div>
    </article>
  );
}

export default function Home() {
  const { state, update, reset } = useCatalogState();
  const { favs, toggle, count } = useFavorites();
  const [notesOpen, setNotesOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const glossary = useMemo(() => glossaryGroups(), []);

  const activeFilterCount =
    (state.blindOnly ? 1 : 0) +
    (state.curBrand !== 'all' ? 1 : 0) +
    (state.sortMode !== 'rank' ? 1 : 0) +
    (state.curOcc !== 'all' ? 1 : 0) +
    (state.curNote !== 'all' ? 1 : 0);

  // Esc closes the filter sheet and the notes encyclopedia
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setPanelOpen(false);
      setNotesOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Deep link from quiz results: scroll to #p-N card
  useEffect(() => {
    if (window.location.hash.startsWith('#p-')) {
      const el = document.getElementById(window.location.hash.slice(1));
      if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300);
    }
  }, []);

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
      CAT_KEYS.map((key, ci) => ({
        key,
        ci,
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
  if (state.curOcc !== 'all')
    pills.push({
      label: OCC_ICON[state.curOcc] + ' ' + (OCC_LABEL[state.curOcc] ?? state.curOcc),
      clear: () => update('curOcc', 'all'),
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
      <header className="top">
        <span className="logo">عَطْـر</span>
        <span className="tag">بديل عطر ٢ · النسخة الرجالية</span>
        <time suppressHydrationWarning className="date">
          {today}
        </time>
      </header>

      <section className="mast">
        <div>
          <p className="kicker">مُصنَّف وفق أعلى التقييمات العالمية</p>
          <h1>
            بديل عطر <span>٢</span>
          </h1>
          <p className="lede">
            نخبة من العطور الرجالية مُقيَّمة، موزّعة على إحدى عشرة عائلة عطرية. بجانب كل قارورة
            أصلية ستجد البديل العربي أو الاقتصادي الموثوق، مع النوتات ونسب الثبات والفوحان لكليهما،
            وحكم نهائي: يُشترى أعمى أم يُجرَّب أولاً؟
          </p>
          <div className="stats">
            {[
              [arN(TOTAL), 'عطر مُقيَّم'],
              [arN(CAT_KEYS.length), 'عائلات عطرية'],
              [arN(ALT_COUNT), 'بديلاً مدروساً'],
              [arN(TOTAL * 2), 'قراءة ثبات وفوحان'],
            ].map(([n, l]) => (
              <div key={l} className="stat">
                <b>{n}</b>
                <span>{l}</span>
              </div>
            ))}
          </div>
          <div className="records">
            <span className="rec">
              🏆 ملك الثبات: <b>{TOP_RATED.n} {arN(TOP_RATED.pf)}٪</b>
            </span>
            <span className="rec">
              💨 أقوى فوحان: <b>{TOP_SILLAGE.n} {arN(TOP_SILLAGE.ps)}٪</b>
            </span>
          </div>
          <p className="legend">
            <span className="blind ok sm">✓ آمن للشراء الأعمى</span>{' '}
            عطر جماهيري مُجمَع عليه &nbsp;·&nbsp;{' '}
            <span className="blind no sm">⚠ جرِّبه أولاً</span>{' '}
            رائحة ذوقية أو سعر مرتفع أو توفر محدود
          </p>
          <Link href="/quiz/" className="discover-btn">
            ✨ اكتشف عطرك المثالي
          </Link>
        </div>
        <div className="mast-vis">
          <span className="ring r1" />
          <span className="ring r2" />
          <BottleBig idx={-1} c1="#d4a24e" c2="#7a4a14" code="عطر" variant={1} />
          {[
            ['عود', '8%', '12%'],
            ['عنبر', '16%', '78%'],
            ['مسك', '62%', '4%'],
            ['زعفران', '78%', '70%'],
            ['فانيليا', '38%', '88%'],
            ['جلد', '4%', '52%'],
            ['برغموت', '86%', '38%'],
          ].map(([name, top, left]) => (
            <span
              key={name}
              className="nchip"
              style={{ top, insetInlineStart: left }}
            >
              {name}
            </span>
          ))}
        </div>
      </section>

      <div className="toolbar">
        <div className="trow">
          <div className={'search' + (state.term ? ' has-q' : '')}>
            <input
              id="q"
              type="text"
              value={state.term}
              onChange={(e) => update('term', e.target.value)}
              placeholder="ابحث عن عطر، بديل، نوتة… مثال: عود، فانيليا، لطافة"
            />
            <button
              className="qclear"
              id="qclear"
              type="button"
              aria-label="مسح البحث"
              onClick={() => update('term', '')}
            >
              ✕
            </button>
          </div>
          <button
            className={'fbadge' + (activeFilterCount > 0 ? ' has-f' : '')}
            id="fbadge"
            type="button"
            aria-haspopup="dialog"
            aria-expanded={panelOpen}
            aria-controls="sec"
            onClick={() => setPanelOpen((v) => !v)}
          >
            <span className="fgear">⚙</span>
            <span className="ftxt">فلترة</span>
            <span className="fdot">{arN(activeFilterCount)}</span>
          </button>
          <div
            className={'fpanel' + (panelOpen ? ' open' : '')}
            id="sec"
            role="dialog"
            aria-label="الفلاتر"
          >
            <div className="fpanel-h">
              <b>الفلاتِر</b>
              <button
                type="button"
                aria-label="إغلاق"
                onClick={() => setPanelOpen(false)}
              >
                ✕
              </button>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                id="blindOnly"
                checked={state.blindOnly}
                onChange={(e) => update('blindOnly', e.target.checked)}
              />
              <span className="sw" /> آمن فقط للشراء الأعمى
            </label>
            <select
              id="sort"
              className="sortsel"
              aria-label="ترتيب العطور"
              value={state.sortMode}
              onChange={(e) => update('sortMode', e.target.value as SortMode)}
            >
              {SORTS.map((o) => (
                <option key={o.v} value={o.v}>
                  {o.l}
                </option>
              ))}
            </select>
            <select
              id="brand"
              className="sortsel"
              aria-label="فلتر بحسب الدار المنتجة"
              value={state.curBrand}
              onChange={(e) => update('curBrand', e.target.value)}
            >
              <option value="all">كل الدور</option>
              {BRANDS.map((b) => (
                <option key={b} value={b}>
                  {BRAND_AR[b]}
                </option>
              ))}
            </select>
            <select
              id="noteselect"
              className="sortsel"
              aria-label="فلتر بحسب النوتة"
              value={state.curNote}
              onChange={(e) => update('curNote', e.target.value)}
            >
              <option value="all">📖 كل النوتات</option>
              {NOTE_OPTIONS.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            <button
              className="notebtn"
              id="notebtn"
              type="button"
              onClick={() => setNotesOpen(true)}
            >
              📖 موسوعة النوتات
            </button>
            <button className="reset" id="reset" type="button" onClick={reset}>
              ↺ إعادة ضبط الفلاتر
            </button>
          </div>
        </div>
        <div className="active">
          {pills.map((pill) => (
            <button
              key={pill.label}
              onClick={pill.clear}
              className="achip"
            >
              {pill.label}
              <i>✕</i>
            </button>
          ))}
        </div>
        <div className="chipbar">
          <div className="chips-row">
            <Chip active={state.curCat === 'all'} onClick={() => update('curCat', 'all')}>
              الكل
            </Chip>
            <Chip active={state.favOnly} onClick={() => update('favOnly', !state.favOnly)}>
              ♥ المفضلة {count > 0 && `(${arN(count)})`}
            </Chip>
            {CAT_KEYS.map((k) => (
              <Chip key={k} active={state.curCat === k} onClick={() => update('curCat', k)}>
                <i style={{ background: CATS[k].c }} />
                {CATS[k].n}
              </Chip>
            ))}
          </div>
          <div className="chips-row" id="occchips">
            {OCCS.map((occ) => (
              <Chip key={occ} active={state.curOcc === occ} onClick={() => update('curOcc', state.curOcc === occ ? 'all' : occ)}>
                <span className="occchip">{OCC_ICON[occ]} {OCC_LABEL[occ]}</span>
              </Chip>
            ))}
          </div>
          <span className="count">
            يعرض {arN(visible.length)} من {arN(TOTAL)} عطر
          </span>
        </div>
      </div>

      <main id="main">
        {sections.map((sec) => (
          <section
            key={sec.key}
            className="sec"
            id={'sec-' + sec.key}
            style={{ '--c1': sec.cat.c, '--c2': sec.cat.c2 } as React.CSSProperties}
          >
            <header className="sech in">
              <span className="secnum">{arN(String(sec.ci + 1).padStart(2, '0'))}</span>
              <div>
                <h2>{sec.cat.n}</h2>
                <p>{sec.cat.d}</p>
              </div>
              <span className="seccount">{arN(sec.idxs.length)} عطور</span>
            </header>
            <div className="grid">
              {sec.idxs.map((i) => (
                <PerfumeCard
                  key={i}
                  p={PERFUMES[i]}
                  idx={i}
                  isFav={favs.has(i)}
                  onToggle={() => toggle(i)}
                />
              ))}
            </div>
          </section>
        ))}

        <div
          id="empty"
          style={{ display: visible.length === 0 ? 'block' : 'none' }}
        >
          <p className="big">لا توجد نتائج</p>
          <p>جرّب كلمة أخرى أو أعد ضبط الفلاتر</p>
          <button
            onClick={reset}
            className="reset"
            style={{ display: 'inline-block', marginTop: 16 }}
          >
            ↺ إعادة ضبط الفلاتر
          </button>
        </div>
      </main>

      <footer>
        <div className="fgrid">
          <div>
            <h4>منهجية التقرير</h4>
            <ul>
              <li>الترتيب وفق خلاصة تقييمات المجتمعات العطرية العالمية والعربية حتى منتصف ٢٠٢٦.</li>
              <li>نسب الثبات والفوحان تقديرية على مقياس ١٠٠ نقطة لتركيز أو دو بارفان، وتختلف حسب البشرة والمناخ.</li>
              <li>البدائل من تجارب المجتمع العطري؛ التشابه يتراوح بين ٧٥–٩٥٪ حسب التركيبة.</li>
            </ul>
          </div>
          <div>
            <h4>قبل أن ترشّ</h4>
            <p>
              القوارير رسوم SVG مولّدة داخل الكود (لا تحتاج إنترنت). إن كنت تشتري عبر الإنترنت لأول مرة
              فابدأ بعينة أو حجم صغير — فالكيمياء الجلدية كلمة الفصل. صُنع بشغف في يوليو ٢٠٢٦.
            </p>
          </div>
        </div>
      </footer>

      {notesOpen && (
        <div className="notemodal open" role="dialog" aria-modal="true" aria-label="موسوعة النوتات" onClick={(e) => {
          if (e.target === e.currentTarget) setNotesOpen(false);
        }}>
          <div className="notemodal-inner">
            <div className="notemodal-head">
              <h3>موسوعة النوتات العطرية</h3>
              <button className="noteclose" type="button" onClick={() => setNotesOpen(false)}>
                ✕
              </button>
            </div>
            <div className="notemodal-body">
              {glossary.map((group) => (
                <div key={group.cat}>
                  <div className="notecat-title">{group.cat}</div>
                  <div className="notegrid">
                    {group.items.map((nt) => (
                      <div
                        key={nt.n}
                        className="note-card"
                        onClick={() => {
                          update('curNote', nt.n);
                          setNotesOpen(false);
                        }}
                      >
                        <div className="note-card-top">
                          <span>{nt.icon}</span>
                          <span className="note-card-name">{nt.n}</span>
                          <span className="note-card-count">{arN(nt.count ?? 0)} عطراً</span>
                        </div>
                        <div className="note-card-desc">{nt.d}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
