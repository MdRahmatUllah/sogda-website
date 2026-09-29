import { getTranslations } from 'next-intl/server';
import { DeviceFrame } from '@/components/ui/DeviceFrame';
import { Mark } from '@/components/ui/Mark';
import { Screen } from '@/components/ui/Screen';
import { StoreBadges } from '@/components/ui/StoreBadges';
import { HeroPause } from './HeroPause';

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
  return (
    <section id="hero" className="on-lagoon relative overflow-hidden bg-lagoon text-ink">
      <Route id="route-wide" d={WIDE} viewBox="0 0 1440 720" className="hidden md:block" />
      <Route id="route-narrow" d={NARROW} viewBox="0 0 400 1200" className="md:hidden" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pt-10 pb-16 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:gap-8 lg:py-20">
        <div>
          <Mark road flip className="size-16 sm:size-20" />
          <p className="mt-6 text-lg font-semibold">{t('kicker')}</p>
          <h1 className="mt-2 text-[clamp(2.4rem,7vw,4.5rem)] leading-[1.02] font-extrabold tracking-[-0.025em] text-balance">
            {t('headline')}
          </h1>
          <p className="mt-5 max-w-xl text-lg sm:text-xl">{t('subline')}</p>
          <div className="mt-8">
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
