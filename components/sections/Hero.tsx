import { getTranslations } from 'next-intl/server';
import { DeviceFrame } from '@/components/ui/DeviceFrame';
import { Mark } from '@/components/ui/Mark';
import { Screen } from '@/components/ui/Screen';
import { StoreBadges } from '@/components/ui/StoreBadges';
import { TERMIN } from './Features';
import { HeroPause } from './HeroPause';

// #62: the gaps a new word comes back after, as the Memory section shows them
// (1 day → 3 → 8 → 21, the app's own Again/Hard/Good/Easy intervals).
const GAPS = [1, 3, 8, 21];

// The front phone's loop (BRIEF §3.1): Today, a card's front, its back (the
// meaning appears), a quiz. 3 s each; globals.css times the cross-fade.
const LOOP = ['today', 'study-front', 'study-back', 'quiz-articles'] as const;

// The Silk Road across the band (the brand's dotted route: Sun dots with an
// Ink shadow), drawn on load through a mask whose solid stroke unrolls. Wide
// screens get a route across; narrow ones, where the band stacks, one that
// winds down it.
const WIDE = 'M -40 640 C 160 560, 300 700, 520 600 S 820 360, 1040 420 S 1320 260, 1480 120';
const NARROW = 'M -40 590 C 90 540, 170 660, 300 610 S 440 640, 400 820 S 240 1080, 330 1260';

function Route({
  id,
  d,
  viewBox,
  className,
}: {
  id: string;
  d: string;
  viewBox: string;
  className: string;
}) {
  return (
    <svg
      className={`pointer-events-none absolute inset-0 size-full ${className}`}
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <mask id={id} maskUnits="userSpaceOnUse">
        <path
          className="route-draw"
          d={d}
          pathLength={1}
          fill="none"
          stroke="#fff"
          strokeWidth="40"
        />
      </mask>
      <g mask={`url(#${id})`} fill="none" strokeLinecap="round" strokeWidth="9">
        <path d={d} stroke="#15121F" strokeDasharray="0.1 24" transform="translate(3 3)" />
        <path d={d} stroke="#FFC61A" strokeDasharray="0.1 24" />
      </g>
    </svg>
  );
}

export async function Hero({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'hero' });
  const journey = await getTranslations({ locale, namespace: 'journey' });
  const memory = await getTranslations({ locale, namespace: 'memory' });
  // #62: the product in the first screen. The facts are the journey's own
  // strings (one wording per locale); the card shows der Termin in the
  // visitor's meaning language, English where the app has none (de).
  const facts = [
    journey('facts.words'),
    journey('facts.grammar'),
    t('facts.steps'),
    journey('facts.exams'),
    t('facts.offline'),
  ];
  const word = TERMIN.find((w) => w.lang === locale) ?? TERMIN[0];
  return (
    <section id="hero" className="on-lagoon relative overflow-hidden bg-lagoon text-ink">
      <Route id="route-wide" d={WIDE} viewBox="0 0 1440 720" className="hidden md:block" />
      <Route id="route-narrow" d={NARROW} viewBox="0 0 400 1200" className="md:hidden" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pt-6 pb-16 sm:px-6 sm:pt-10 lg:grid-cols-[1.15fr_1fr] lg:gap-8 lg:py-20">
        <div>
          <Mark road flip className="size-12 sm:size-20" />
          <p className="mt-4 text-lg font-semibold sm:mt-6">{t('kicker')}</p>
          <h1 className="mt-2 text-[clamp(2.4rem,7vw,4.5rem)] leading-[1.02] font-extrabold tracking-[-0.025em] text-balance">
            {t('headline')}
          </h1>
          <p className="mt-5 max-w-xl text-lg sm:text-xl">{t('subline')}</p>
          <ul aria-label={t('facts.label')} className="mt-5 flex max-w-xl flex-wrap gap-2">
            {facts.map((fact) => (
              <li
                key={fact}
                className="rounded-full border-2 border-ink bg-paper px-3 py-1 text-sm font-semibold text-ink"
              >
                {fact}
              </li>
            ))}
          </ul>
          <figure className="hero-word card mt-5 flex text-fg max-w-sm flex-wrap items-center justify-between gap-x-5 gap-y-3 p-4">
            <figcaption className="sr-only">{t('card.label')}</figcaption>
            <div className="min-w-0">
              <p className="text-xs font-bold text-muted">A1.1</p>
              <p className="text-2xl font-extrabold" lang="de">
                <span className="text-der">der</span> Termin
              </p>
              <p lang={word.lang}>
                <span className="font-semibold">{word.meaning}</span>{' '}
                <span className="text-muted">/{word.say}/</span>
              </p>
            </div>
            <ol className="flex gap-1.5" aria-label={memory('revisions')}>
              {GAPS.map((g) => (
                <li
                  key={g}
                  className="grid h-10 min-w-10 place-items-center rounded-full border-2 border-line bg-sun px-2 text-xs font-bold whitespace-nowrap text-ink"
                >
                  {memory('gapShort', { days: g })}
                </li>
              ))}
            </ol>
          </figure>
          <div className="mt-6">
            <StoreBadges locale={locale} />
          </div>
        </div>
        <div className="hero-phones relative mx-auto w-[min(68vw,18.5rem)] lg:mr-8 lg:w-[19rem]">
          <DeviceFrame className="absolute top-[6%] -left-[42%] w-[82%] -rotate-[9deg]">
            <Screen id="study-front" locale={locale} sizes="(min-width: 1024px) 250px, 56vw" />
          </DeviceFrame>
          <div className="hero-float relative">
            <DeviceFrame className="w-full">
              {LOOP.map((id, i) => (
                <div
                  key={id}
                  className={`hero-screen absolute inset-0 ${i === 0 ? '' : 'hero-screen-later'}`}
                >
                  <Screen
                    id={id}
                    locale={locale}
                    priority={i === 0}
                    sizes="(min-width: 1024px) 304px, 68vw"
                  />
                </div>
              ))}
            </DeviceFrame>
            <HeroPause pause={t('pause')} play={t('play')} />
          </div>
        </div>
      </div>
    </section>
  );
}
