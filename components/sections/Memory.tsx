import { getTranslations } from 'next-intl/server';
import type { CSSProperties } from 'react';
import { Reveal } from '@/components/ui/Reveal';
import { factArgs, facts } from '@/i18n/facts';

// BRIEF §3.3, in plain language, no maths on the page: memory fades after a
// word is learned; each revision lifts it back up and it fades more slowly,
// so the gaps grow. The gaps are the app's own schedule (#103): Good after
// Good on each due day, from content/facts.json (DeutschPlan #1182). The
// curve's shape is an illustration; its gaps are data.
const GAPS = facts.fsrs.good_days.slice(0, 4);
const REVIEWS = GAPS.reduce((days, gap) => [...days, days.at(-1)! + gap], [0]); // learned, then four revisions
const DIPS = [0.55, 0.65, 0.75, 0.85]; // how far memory has faded by each
const END = REVIEWS.at(-1)! * 1.3;
const DRAW_S = 2.4; // the curve's draw time; the dots keep pace with it

const x = (day: number) => 48 + 560 * Math.sqrt(day / END);
// Memory from 45 % to full fills the chart's height.
const y = (r: number) => 40 + 216 * ((1 - r) / 0.55);
const f = (n: number) => Number(n.toFixed(1));

function curve() {
  const parts: string[] = [`M ${f(x(0))} ${f(y(1))}`];
  const segment = (from: number, to: number, dip: number) => {
    for (let s = 1; s <= 16; s++) {
      const t = ((to - from) * s) / 16;
      parts.push(`L ${f(x(from + t))} ${f(y(dip ** (t / (to - from))))}`);
    }
  };
  REVIEWS.slice(1).forEach((day, k) => {
    segment(REVIEWS[k]!, day, DIPS[k]!);
    parts.push(`L ${f(x(day))} ${f(y(1))}`); // the revision lifts it back up
  });
  segment(REVIEWS.at(-1)!, END, 0.92);
  return parts.join(' ');
}

export async function Memory({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'memory' });
  const n = new Intl.NumberFormat(locale);
  // A dot appears as the drawing curve reaches it.
  const at = (day: number) => `${((x(day) - x(0)) / (x(END) - x(0))) * DRAW_S}s`;
  return (
    <section id="memory" aria-labelledby="memory-title" className="bg-well py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.2fr] lg:items-center">
        <div>
          <p className="font-semibold text-link">{t('eyebrow')}</p>
          <h2
            id="memory-title"
            className="mt-2 text-4xl leading-tight font-extrabold tracking-[-0.02em] sm:text-5xl"
          >
            {t('title')}
          </h2>
          <p className="mt-5 max-w-xl text-lg text-muted">{t('body', factArgs)}</p>
        </div>
        <Reveal className="grid gap-6">
          <figure className="card p-4 sm:p-6">
            <svg
              viewBox="0 0 640 320"
              role="img"
              aria-label={t('chart', factArgs)}
              className="w-full"
            >
              <line x1="48" y1="266" x2="620" y2="266" stroke="var(--line)" strokeWidth="2" />
              <line x1="48" y1="30" x2="48" y2="266" stroke="var(--line)" strokeWidth="2" />
              <text x="30" y="266" fontSize="20" fill="var(--muted)" transform="rotate(-90 30 266)">
                {t('axisMemory')}
              </text>
              <text x="620" y="296" fontSize="20" fill="var(--muted)" textAnchor="end">
                {t('axisTime')}
              </text>
              <path
                className="memory-curve"
                d={curve()}
                pathLength={1}
                fill="none"
                stroke="var(--color-lagoon)"
                strokeWidth="5"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              {REVIEWS.map((day, k) => (
                <g key={day} className="memory-dot" style={{ '--at': at(day) } as CSSProperties}>
                  <circle
                    cx={f(x(day))}
                    cy={f(y(1))}
                    r="9"
                    fill={k === 0 ? 'var(--card)' : 'var(--color-sun)'}
                    stroke="var(--color-ink)"
                    strokeWidth="2.5"
                  />
                  {k > 0 && (
                    <text
                      x={f((x(day) + x(REVIEWS[k - 1]!)) / 2)}
                      y={f(y(1)) - 18}
                      fontSize="22"
                      fontWeight="700"
                      textAnchor="middle"
                      fill="var(--fg)"
                    >
                      {/* The first gap names its unit and the rest are numbers, as the
                          copy says them ("4 days, then 15, …"): four full labels don't
                          fit between the first dots (#135). */}
                      {k === 1 ? t('gap', { days: GAPS[0]! }) : n.format(GAPS[k - 1]!)}
                    </text>
                  )}
                </g>
              ))}
            </svg>
          </figure>
          <div className="memory-card card mx-auto flex w-full max-w-sm flex-wrap items-center justify-between gap-x-5 gap-y-3 p-5">
            <div className="min-w-0">
              <p className="text-2xl font-extrabold" lang="de" translate="no">
                <span className="text-der">der</span> Termin
              </p>
              <p className="text-muted">{t('meaning')}</p>
            </div>
            <ol className="flex gap-1.5" aria-label={t('revisions', factArgs)}>
              {GAPS.map((g, k) => (
                <li
                  key={g}
                  className="memory-chip grid h-11 min-w-11 place-items-center rounded-full border-2 border-line bg-sun px-2 text-xs font-bold whitespace-nowrap text-ink"
                  style={{ '--at': at(REVIEWS[k + 1]!) } as CSSProperties}
                >
                  {t('gapShort', { days: g })}
                </li>
              ))}
            </ol>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
