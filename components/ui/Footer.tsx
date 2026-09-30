import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { site } from '@/site.config';

// Each language named in itself (BRIEF §7).
export const LANGUAGE_NAMES: Record<string, string> = {
  en: 'English',
  de: 'Deutsch',
  bn: 'বাংলা',
  pl: 'Polski',
  ru: 'Русский',
};

export async function Footer({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'footer' });
  const link = 'underline-offset-4 hover:underline';
  return (
    <footer className="border-t-2 border-line bg-bg">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 text-sm sm:px-6">
        <nav aria-label={t('impressum')}>
          <ul className="flex flex-wrap gap-x-6 gap-y-3 font-semibold">
            <li>
              <a className={link} href={`/${locale}/impressum`}>
                {t('impressum')}
              </a>
            </li>
            <li>
              <a className={link} href={`/${locale}/datenschutz`}>
                {t('privacy')}
              </a>
            </li>
            {site.contactEmail && (
              <li>
                <a className={link} href={`mailto:${site.contactEmail}`}>
                  {t('contact')}
                </a>
              </li>
            )}
          </ul>
        </nav>
        {routing.locales.length > 1 && (
          <nav aria-label={t('languages')}>
            <ul className="flex flex-wrap gap-x-6 gap-y-3">
              {routing.locales.map((l) => (
                <li key={l}>
                  <a
                    className={link}
                    href={`/${l}`}
                    lang={l}
                    hrefLang={l}
                    aria-current={l === locale ? 'page' : undefined}
                  >
                    {LANGUAGE_NAMES[l] ?? l}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
        <p className="text-muted">{t('trademark')}</p>
        <p className="text-muted">{t('copyright', { year: new Date().getFullYear() })}</p>
      </div>
    </footer>
  );
}
