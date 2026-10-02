import { getTranslations } from 'next-intl/server';
import { factArgs, facts } from '@/i18n/facts';

// BRIEF §3.4: the Silk Road as the course, 12 stations from A1.1 to C2.2,
// winding down the page; a traveller (the Sun tile's colour) follows the
// scroll and lights each station it passes. The finished road is the markup
// (no JS, reduced motion); public/site.js takes it back to the start and
// follows the scroll.
const STEPS = facts.steps.map((step) => step.code);
// The app's own level names (learn_screen.dart); B2, C1 and C2 have none.
const LEVEL_NAMES: Record<string, string> = { A1: 'Anfänger', A2: 'Grundstufe', B1: 'Mittelstufe' };

const W = 400;
const STATIONS = STEPS.map((step, i) => ({
  step,
  x: i % 2 === 0 ? 96 : 304,
  y: 70 + i * 104,
}));
const H = STATIONS.at(-1)!.y + 70;
const f = (n: number) => Number(n.toFixed(1));

/** A smooth road through every station (Catmull-Rom, as cubic Béziers). */
function road() {
  const p = [STATIONS[0]!, ...STATIONS, STATIONS.at(-1)!];
  let d = `M ${p[1]!.x} ${p[1]!.y}`;
  for (let i = 1; i < p.length - 2; i++) {
    const [a, b, c, e] = [p[i - 1]!, p[i]!, p[i + 1]!, p[i + 2]!];
    d += ` C ${f(b.x + (c.x - a.x) / 6)} ${f(b.y + (c.y - a.y) / 6)}, ${f(c.x - (e.x - b.x) / 6)} ${f(c.y - (e.y - b.y) / 6)}, ${c.x} ${c.y}`;
  }
  return d;
}

/** Where each station sits along the road, 0-1 (by chord length: close enough). */
function stops() {
  const lengths = STATIONS.slice(1).map((s, i) =>
    Math.hypot(s.x - STATIONS[i]!.x, s.y - STATIONS[i]!.y),
  );
  const total = lengths.reduce((a, b) => a + b, 0);
  let run = 0;
  return [0, ...lengths.map((l) => (run += l) / total)];
}

export async function Journey({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'journey' });
  const at = stops();
  return (
    <section id="journey" aria-labelledby="journey-title" className="py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="font-semibold text-link">{t('eyebrow')}</p>
          <h2
            id="journey-title"
            className="mt-2 text-4xl leading-tight font-extrabold tracking-[-0.02em] sm:text-5xl"
          >
            {t('title', factArgs)}
          </h2>
          <ul className="mt-8 grid gap-3 text-lg">
            {(['words', 'grammar', 'exams'] as const).map((k) => (
              <li key={k} className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="size-3 rounded-full border-2 border-ink bg-sun"
                />
                {t(`facts.${k}`, factArgs)}
              </li>
            ))}
          </ul>
          <p aria-hidden="true" className="card mt-8 inline-flex items-baseline gap-2 px-5 py-3">
            <span
              id="journey-count"
              data-total={facts.totals.words}
              className="text-3xl font-extrabold tabular-nums"
            >
              {new Intl.NumberFormat(locale).format(facts.totals.words)}
            </span>
            <span className="text-muted">{t('counter')}</span>
          </p>
          <p className="mt-8 max-w-md text-lg">{t('placement')}</p>
        </div>
        <div className="relative mx-auto w-full max-w-md">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="w-full"
            role="img"
            aria-label={t('road', factArgs)}
          >
            <path
              id="journey-road"
              d={road()}
              fill="none"
              stroke="var(--color-ink)"
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray="0.1 16"
              transform="translate(2 2)"
            />
            <path
              d={road()}
              fill="none"
              stroke="var(--color-sun)"
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray="0.1 16"
            />
            {STATIONS.map((s, i) => {
              const level = s.step.slice(0, 2);
              const starts = i % 2 === 0;
              const label = starts
                ? `${level}${LEVEL_NAMES[level] ? ` · ${LEVEL_NAMES[level]}` : ''}`
                : null;
              const right = s.x < W / 2;
              return (
                <g
                  key={s.step}
                  data-station
                  data-at={f(at[i]!)}
                  data-lit=""
                  className="journey-station"
                >
                  {label && (
                    <text
                      x={right ? s.x + 150 : s.x - 150}
                      y={s.y + 5}
                      fontSize="15"
                      fontWeight="700"
                      textAnchor="middle"
                      fill="var(--muted)"
                      lang="de"
                      // SVG has no translate attribute: Chrome's class (#139).
                      className="notranslate"
                    >
                      {label}
                    </text>
                  )}
                  <circle
                    className="journey-dot"
                    cx={s.x}
                    cy={s.y}
                    r="15"
                    stroke="var(--line)"
                    strokeWidth="2.5"
                  />
                  <g transform={`translate(${right ? s.x + 24 : s.x - 24 - 58} ${s.y - 14})`}>
                    <rect
                      className="journey-chip"
                      width="58"
                      height="28"
                      rx="8"
                      stroke="var(--line)"
                      strokeWidth="2"
                    />
                    <text
                      className="journey-chip-text"
                      x="29"
                      y="19"
                      fontSize="14"
                      fontWeight="800"
                      textAnchor="middle"
                    >
                      {s.step}
                    </text>
                  </g>
                </g>
              );
            })}
            <circle
              id="journey-traveller"
              cx="0"
              cy="0"
              r="11"
              fill="var(--color-sun)"
              stroke="var(--color-ink)"
              strokeWidth="3"
              transform={`translate(${STATIONS.at(-1)!.x} ${STATIONS.at(-1)!.y})`}
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
