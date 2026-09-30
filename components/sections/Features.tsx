import {
  BellRing,
  CirclePlus,
  Gauge,
  LayoutGrid,
  Scale,
  ShieldCheck,
  Volume2,
  WifiOff,
} from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import type { CSSProperties } from 'react';
import { DeviceFrame } from '@/components/ui/DeviceFrame';
import { Reveal } from '@/components/ui/Reveal';
import { Screen } from '@/components/ui/Screen';
import { SnapCarousel } from '@/components/ui/SnapCarousel';

function Heading({ id, eyebrow, title }: { id: string; eyebrow: string; title: string }) {
  return (
    <>
      <p className="font-semibold text-link">{eyebrow}</p>
      <h2
        id={id}
        className="mt-2 text-4xl leading-tight font-extrabold tracking-[-0.02em] sm:text-5xl"
      >
        {title}
      </h2>
    </>
  );
}

// BRIEF §3.5: quizzes and mock exams, as a fan of three real screens that
// opens as it comes into view (a lifted card on hover); on a phone, a snap
// carousel with dots.
export async function Practice({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'practice' });
  const screens = ['quiz-articles', 'exam-listening', 'exam-results'];
  return (
    <section
      id="practice"
      aria-labelledby="practice-title"
      className="overflow-x-clip bg-well py-20 sm:py-28"
    >
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <div>
          <Heading id="practice-title" eyebrow={t('eyebrow')} title={t('title')} />
          <p className="mt-5 max-w-xl text-lg text-muted">{t('quizzes')}</p>
          <p className="mt-4 max-w-xl text-lg text-muted">{t('exams')}</p>
        </div>
        {/* min-w-0: a grid cell would otherwise grow to the whole row. */}
        <Reveal className="min-w-0">
          <SnapCarousel
            locale={locale}
            label={t('carousel')}
            itemLabel={t('item')}
            wideControls={false}
            wideClassName="practice-fan lg:snap-none lg:justify-center lg:overflow-visible lg:px-0"
          >
            {screens.map((id) => (
              <DeviceFrame key={id} className="w-56 lg:w-48 xl:w-60">
                <Screen id={id} locale={locale} sizes="240px" />
              </DeviceFrame>
            ))}
          </SnapCarousel>
        </Reveal>
      </div>
    </section>
  );
}

// BRIEF §3.6: everything else, one line each (facts from BRIEF §4 only).
const FEATURES = [
  { key: 'offline', Icon: WifiOff },
  { key: 'private', Icon: ShieldCheck },
  { key: 'voice', Icon: Volume2 },
  { key: 'compare', Icon: Scale },
  { key: 'own', Icon: CirclePlus },
  { key: 'widget', Icon: LayoutGrid },
  { key: 'reminder', Icon: BellRing },
  { key: 'pace', Icon: Gauge },
] as const;

export async function FeatureGrid({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'features' });
  return (
    <section id="features" aria-labelledby="features-title" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Heading id="features-title" eyebrow={t('eyebrow')} title={t('title')} />
        <Reveal>
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map(({ key, Icon }, i) => (
              <li key={key} className="feature-card card p-6" style={{ '--i': i } as CSSProperties}>
                <span className="grid size-12 place-items-center rounded-xl border-2 border-ink bg-sun text-ink">
                  <Icon aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-lg font-bold">{t(`${key}.title`)}</h3>
                <p className="mt-2 text-muted">{t(`${key}.body`)}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

// BRIEF §3.7: one phone, three looks. The switch is a native radio group,
// and CSS (:has) shows the chosen screen: no JS. The 200 % card beside it.
const LOOKS = ['light', 'dark', 'glass'] as const;

export async function Looks({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'looks' });
  return (
    <section id="looks" aria-labelledby="looks-title" className="bg-well py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.2fr] lg:items-center">
        {/* min-w-0 on both columns: at 320–390 px the two phones' min-content
            (52vw + 34vw + the gap) widened the grid past the page padding, 11 px
            at 320 (#58). Now the phones' row shrinks them to fit. */}
        <div className="min-w-0">
          <Heading id="looks-title" eyebrow={t('eyebrow')} title={t('title')} />
          <p className="mt-5 max-w-xl text-lg text-muted">{t('body')}</p>
          <fieldset className="mt-8">
            <legend className="sr-only">{t('legend')}</legend>
            <div className="inline-flex rounded-full border-2 border-line bg-card p-1 shadow-hard">
              {LOOKS.map((look) => (
                <label
                  key={look}
                  className="look-option relative grid min-h-12 cursor-pointer place-items-center rounded-full px-3.5 font-semibold sm:px-5"
                >
                  {/* appearance-none: an invisible radio still painted natively
                      held the page's first paint by ~2 s in Chrome on Windows
                      (Lighthouse's LCP 1.7 s → 3.0 s). */}
                  <input
                    type="radio"
                    name="look"
                    value={look}
                    defaultChecked={look === 'light'}
                    className="look-input absolute inset-0 cursor-pointer appearance-none opacity-0"
                  />
                  {t(look)}
                </label>
              ))}
            </div>
          </fieldset>
        </div>
        <div className="flex min-w-0 items-end justify-center gap-6 sm:gap-10">
          <DeviceFrame className="w-[min(52vw,16rem)]">
            {LOOKS.map((look) => (
              <div key={look} data-look={look} className="look-screen absolute inset-0">
                <Screen id="today" locale={locale} theme={look} sizes="256px" />
              </div>
            ))}
          </DeviceFrame>
          <div className="relative">
            <DeviceFrame className="w-[min(34vw,11rem)]">
              <Screen id="study-front-200" locale={locale} sizes="176px" />
            </DeviceFrame>
            <span className="absolute -top-4 -left-4 rounded-full border-2 border-ink bg-sun px-3 py-1 text-sm font-extrabold text-ink shadow-[3px_3px_0_0_var(--color-ink)]">
              {t('large')}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

// BRIEF §3.8: der Termin (A1.1, der) in the four meaning languages, each with
// its pronunciation guide, as the app's A1 workbook has it (English and Bangla
// are in content.db; Russian and Polish ship with app #1100). The lines arrive
// one after another, once.
const TERMIN = [
  { lang: 'en', name: 'English', meaning: 'appointment', say: 'tair-MEEN' },
  { lang: 'bn', name: 'বাংলা', meaning: 'অ্যাপয়েন্টমেন্ট / নির্ধারিত সময়', say: 'টের্মিন' },
  { lang: 'ru', name: 'Русский', meaning: 'запись (к врачу) / встреча', say: 'тэрмИн' },
  { lang: 'pl', name: 'Polski', meaning: 'wizyta / termin', say: 'ter-MIN' },
] as const;

export async function Languages({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'languages' });
  return (
    <section id="languages" aria-labelledby="languages-title" className="py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center">
        <div>
          <Heading id="languages-title" eyebrow={t('eyebrow')} title={t('title')} />
          <p className="mt-5 max-w-xl text-lg text-muted">{t('body')}</p>
        </div>
        <Reveal className="mx-auto w-full max-w-md">
          <div className="card p-6 sm:p-8">
            <p className="text-sm font-bold text-muted">A1.1</p>
            <p className="mt-2 text-4xl font-extrabold" lang="de">
              <span className="text-der">der</span> Termin
            </p>
            <dl className="mt-6 grid gap-4">
              {TERMIN.map(({ lang, name, meaning, say }, i) => (
                <div
                  key={lang}
                  lang={lang}
                  className="lang-line flex items-baseline gap-3"
                  style={{ '--i': i } as CSSProperties}
                >
                  <dt className="w-20 shrink-0 text-sm font-bold text-muted">{name}</dt>
                  <dd>
                    <span className="block text-xl font-semibold">{meaning}</span>
                    <span className="text-muted">/{say}/</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
