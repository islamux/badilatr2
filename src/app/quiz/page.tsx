'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { arN } from '@/lib/arabic';
import { questions } from '@/lib/quiz/questions';
import { profileName, getResults, type QuizResult } from '@/lib/quiz/scoring';
import { initCatalogData } from '@/lib/catalog/init';

const DATA = initCatalogData();

export default function QuizPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<(string | string[] | null)[]>(
    () => []
  );
  const [results, setResults] = useState<QuizResult[] | null>(null);

  const current = step < questions.length ? questions[step] : null;
  const chosen = current
    ? (answers[step] ?? (current.multi ? [] : null))
    : null;

  const canNext = current
    ? current.multi
      ? Array.isArray(chosen) && chosen.length > 0
      : chosen !== null
    : false;

  const selectOption = useCallback(
    (value: string) => {
      if (!current) return;
      setAnswers((prev) => {
        const next = [...prev];
        if (current.multi) {
          const arr = (Array.isArray(next[step]) ? next[step] : []) as string[];
          const idx = arr.indexOf(value);
          if (idx > -1) {
            arr.splice(idx, 1);
          } else if (arr.length < (current.max ?? 2)) {
            arr.push(value);
          }
          next[step] = arr;
        } else {
          next[step] = value;
        }
        return next;
      });
    },
    [current, step]
  );

  const goNext = useCallback(() => {
    if (!canNext) return;
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setResults(getResults(DATA, answers as (string | string[])[]));
    }
  }, [canNext, step, answers]);

  const goPrev = useCallback(() => {
    if (step > 0) setStep(step - 1);
  }, [step]);

  const restart = useCallback(() => {
    setStep(0);
    setAnswers([]);
    setResults(null);
  }, []);

  if (results) {
    const name = profileName(answers as (string | string[])[]);
    return (
      <div className="mx-auto max-w-[720px] px-5 py-10" dir="rtl">
        <div className="mb-6 flex items-center gap-3">
          <Link
            href="/"
            className="rounded-lg border border-[var(--line)] px-3 py-1.5 text-sm text-[var(--mut)] hover:border-[var(--gold)] hover:text-[var(--ink)]"
          >
            العودة للعطور
          </Link>
        </div>

        <div className="mb-8 text-center">
          <p className="text-sm text-[var(--gold)]">بصمتك العطرية</p>
          <h1 className="mt-2 font-['Aref_Ruqaa',serif] text-3xl font-bold">
            {name}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[var(--mut)]">
            هذه النتائج مبنية على اختياراتك وتُحسب محلياً داخل الصفحة.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {results.map((r, n) => (
            <div
              key={r.index}
              className="flex items-center gap-3 rounded-xl border border-[var(--line)] bg-black/20 p-4"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--gold)]/15 text-sm font-bold text-[var(--gold)]">
                {arN(n + 1)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold">{r.perfume.n}</p>
                <p className="truncate text-xs text-[var(--mut)]">
                  {r.perfume.en} · {r.perfume.bar}
                </p>
                <p className="mt-1 text-xs text-[var(--teal)]">
                  {r.reasons.join(' · ')}
                </p>
              </div>
              <span className="shrink-0 rounded-lg bg-[var(--gold)]/10 px-2.5 py-1 text-sm font-bold text-[var(--gold)]">
                {arN(r.score)}٪
              </span>
              <Link
                href={`/#p-${r.index}`}
                className="shrink-0 rounded-lg border border-[var(--gold)]/30 px-3 py-1.5 text-xs text-[var(--gold)] hover:bg-[var(--gold)]/10"
              >
                شاهده
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center gap-3">
          <button
            onClick={restart}
            className="rounded-lg border border-[var(--line)] px-4 py-2 text-sm text-[var(--mut)] hover:border-[var(--gold)] hover:text-[var(--ink)]"
          >
            إعادة الاختبار
          </button>
          <Link
            href="/"
            className="rounded-lg bg-[var(--gold)] px-4 py-2 text-sm font-bold text-[#171009] hover:bg-[var(--gold)]/80"
          >
            العودة للعطور
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[720px] px-5 py-10" dir="rtl">
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/"
          className="rounded-lg border border-[var(--line)] px-3 py-1.5 text-sm text-[var(--mut)] hover:border-[var(--gold)] hover:text-[var(--ink)]"
        >
          العودة للعطور
        </Link>
        <span className="text-sm text-[var(--mut)]">
          السؤال {arN(step + 1)} من {arN(questions.length)}
        </span>
      </div>

      {/* Progress bar */}
      <div className="mb-8 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-l from-[var(--gold)] to-[var(--teal)] transition-all duration-300"
          style={{ width: `${((step + 1) / questions.length) * 100}%` }}
        />
      </div>

      {current && (
        <>
          <p className="mb-1 text-sm text-[var(--gold)]">بصمتك العطرية</p>
          <h1 className="mb-2 font-['Aref_Ruqaa',serif] text-2xl font-bold">
            {current.title}
          </h1>
          <p className="mb-6 text-sm text-[var(--mut)]">
            {current.description}
          </p>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {current.options.map((opt) => {
              const selected = Array.isArray(chosen)
                ? chosen.includes(opt.value)
                : chosen === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => selectOption(opt.value)}
                  className={
                    'flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-colors ' +
                    (selected
                      ? 'border-[var(--gold)] bg-[var(--gold)]/10 text-[var(--gold)]'
                      : 'border-[var(--line)] bg-black/20 text-[var(--mut)] hover:border-[var(--gold)]/50')
                  }
                >
                  <span className="text-2xl">{opt.icon}</span>
                  <span className="text-sm font-bold">{opt.label}</span>
                  {current.multi && (
                    <span className="text-[10px] text-[var(--mut)]">
                      اختر{current.max && current.max > 1 ? ' حتى ' + arN(current.max) : ''}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-8 flex justify-between">
            <button
              onClick={goPrev}
              className={
                'rounded-lg border border-[var(--line)] px-4 py-2 text-sm text-[var(--mut)] hover:border-[var(--gold)] hover:text-[var(--ink)] ' +
                (step === 0 ? 'invisible' : '')
              }
            >
              السابق
            </button>
            <button
              onClick={goNext}
              disabled={!canNext}
              className="rounded-lg bg-[var(--gold)] px-4 py-2 text-sm font-bold text-[#171009] hover:bg-[var(--gold)]/80 disabled:opacity-40"
            >
              {step === questions.length - 1
                ? 'اكتشف نتيجتي'
                : 'التالي ←'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
