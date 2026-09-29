import { ChevronDown } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { DeviceFrame } from '@/components/ui/DeviceFrame';
import { Mark } from '@/components/ui/Mark';
import { Screen } from '@/components/ui/Screen';
import { SnapCarousel } from '@/components/ui/SnapCarousel';
import { StoreBadges } from '@/components/ui/StoreBadges';

// BRIEF §3.9: a snap gallery of real screens, each with its caption; a
// tablet view on large screens.
const GALLERY = [
  'welcome',
  'placement',
  'learn',
  'step-detail',
  'word-detail',
  'compare',
  'search',
  'progress',
] as const;

export async function Gallery({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'gallery' });
  return (
    <section
      id="screens"
      aria-labelledby="screens-title"
      className="overflow-x-clip py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="font-semibold text-link">{t('eyebrow')}</p>
        <h2
          id="screens-title"
          className="mt-2 text-4xl leading-tight font-extrabold tracking-[-0.02em] sm:text-5xl"
        >
          {t('title')}
        </h2>
        <figure className="mt-12 hidden lg:block">
          <DeviceFrame kind="tablet" className="mx-auto w-full max-w-3xl">
            <Screen id="today-tablet" locale={locale} sizes="768px" />
          </DeviceFrame>
          <figcaption className="mt-6 text-center font-semibold text-muted">
            {t('tablet')}
          </figcaption>
        </figure>
      </div>
      <SnapCarousel
        className="mt-10"
        label={t('carousel')}
        itemLabel={t('item')}
        prev={t('prev')}
        next={t('next')}
        buttons
      >
        {GALLERY.map((id) => (
          <figure key={id} className="w-56 sm:w-64">
            <DeviceFrame className="w-full">
              <Screen id={id} locale={locale} theme="auto" sizes="256px" />
            </DeviceFrame>
            <figcaption className="mt-5 text-center font-semibold">
              {t(`captions.${id}`)}
            </figcaption>
          </figure>
        ))}
      </SnapCarousel>
    </section>
  );
}

// BRIEF §3.10: answers only from BRIEF §4. "Is it free?" waits for the owner
// (BRIEF §10, 2). Native <details>: no JS, and the browser does the rest.
const FAQ = ['internet', 'android', 'iphone', 'data', 'exams'] as const;

export async function Faq({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'faq' });
  return (
    <section id="faq" aria-labelledby="faq-title" className="bg-well py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <p className="font-semibold text-link">{t('eyebrow')}</p>
        <h2
          id="faq-title"
          className="mt-2 text-4xl leading-tight font-extrabold tracking-[-0.02em] sm:text-5xl"
        >
          {t('title')}
        </h2>
        <div className="mt-10 grid gap-4">
          {FAQ.map((key) => (
            <details key={key} className="faq card group">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-6 py-4 text-lg font-bold [&::-webkit-details-marker]:hidden">
                {t(`${key}.q`)}
                <ChevronDown
                  aria-hidden="true"
                  className="shrink-0 transition-transform duration-200 group-open:rotate-180"
                />
              </summary>
              <p className="px-6 pb-5 text-lg text-muted">{t(`${key}.a`)}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

// BRIEF §3.11: the big Lagoon band where "Get the app" lands.
export async function FinalCta({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'cta' });
  return (
    <section
      id="get"
      aria-labelledby="get-title"
      className="on-lagoon bg-lagoon py-20 text-ink sm:py-28"
    >
      <div className="mx-auto grid max-w-6xl justify-items-center gap-8 px-4 text-center sm:px-6">
        <div className="flex items-center gap-4" aria-hidden="true">
          <Mark className="size-16 sm:size-20" />
          <span className="text-5xl leading-none font-extrabold tracking-[-0.02em] sm:text-6xl">
            Sogda
          </span>
        </div>
        <h2
          id="get-title"
          className="max-w-3xl text-4xl leading-tight font-extrabold tracking-[-0.02em] text-balance sm:text-5xl"
        >
          {t('title')}
        </h2>
        <StoreBadges locale={locale} className="justify-center" />
      </div>
    </section>
  );
}
