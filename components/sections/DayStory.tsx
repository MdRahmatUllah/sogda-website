import { getTranslations } from 'next-intl/server';
import { DeviceFrame } from '@/components/ui/DeviceFrame';
import { Screen } from '@/components/ui/Screen';
import { DayStoryStage } from './DayStoryStage';

// BRIEF §3.2: open the app, see today's plan, do it, done. Each beat has its
// real screen; on wide screens one sticky phone follows the beat in view,
// on narrow ones (and with reduced motion) each beat carries its own phone.
const BEATS = [
  { key: 'plan', screen: 'today' },
  { key: 'revise', screen: 'study-front' },
  { key: 'learn', screen: 'study-back' },
  { key: 'grammar', screen: 'grammar-practice' },
  { key: 'sentences', screen: 'sentences' },
  { key: 'done', screen: 'day-complete' },
] as const;

export async function DayStory({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'day' });
  const phone = (screen: string) => (
    <Screen id={screen} locale={locale} theme="auto" sizes="(min-width: 1024px) 304px, 60vw" />
  );
  return (
    <section id="day" aria-labelledby="day-title" className="py-20 sm:py-28">
      <DayStoryStage steps={BEATS.length}>
        <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-20 motion-reduce:lg:grid-cols-1">
          <div>
            <p className="font-semibold text-link">{t('eyebrow')}</p>
            <h2
              id="day-title"
              className="mt-2 max-w-2xl text-4xl leading-tight font-extrabold tracking-[-0.02em] sm:text-5xl"
            >
              {t('title')}
            </h2>
            <ol className="mt-10 grid gap-16 lg:mt-0 lg:gap-0 motion-reduce:lg:mt-12 motion-reduce:lg:grid-cols-3 motion-reduce:lg:gap-10">
              {BEATS.map((b, i) => (
                <li
                  key={b.key}
                  data-beat={i}
                  className="grid gap-6 lg:min-h-[70vh] lg:content-center motion-reduce:lg:min-h-0 motion-reduce:lg:content-start"
                >
                  <DeviceFrame className="mx-auto w-[min(60vw,15rem)] lg:hidden motion-reduce:lg:block">
                    {phone(b.screen)}
                  </DeviceFrame>
                  <div className="max-w-md">
                    <span className="grid size-10 place-items-center rounded-full border-2 border-line bg-sun font-extrabold text-ink shadow-hard">
                      {new Intl.NumberFormat(locale).format(i + 1)}
                    </span>
                    <h3 className="mt-4 text-2xl font-bold sm:text-3xl">{t(`${b.key}.title`)}</h3>
                    <p className="mt-3 text-lg text-muted">{t(`${b.key}.body`)}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="relative hidden lg:block motion-reduce:lg:hidden">
            <div className="sticky top-24 mx-auto w-[min(100%,calc((100dvh-8rem)*0.43))]">
              <DeviceFrame className="w-full">
                {BEATS.map((b) => (
                  <div key={b.key} className="day-screen absolute inset-0">
                    {phone(b.screen)}
                  </div>
                ))}
              </DeviceFrame>
              <svg
                viewBox="0 0 48 48"
                aria-hidden="true"
                className="day-ring absolute -top-5 -right-5 size-16"
              >
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  fill="var(--card)"
                  stroke="var(--line)"
                  strokeWidth="2"
                />
                <circle cx="24" cy="24" r="14" fill="none" stroke="var(--well)" strokeWidth="6" />
                <circle
                  className="day-ring-fill"
                  cx="24"
                  cy="24"
                  r="14"
                  fill="none"
                  stroke="var(--color-lagoon)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  pathLength={1}
                  transform="rotate(-90 24 24)"
                />
              </svg>
            </div>
          </div>
        </div>
      </DayStoryStage>
    </section>
  );
}
