import type { Metadata, Viewport } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { bengali, inter, interCyrillic } from '@/app/fonts';
import { Footer } from '@/components/ui/Footer';
import { Header } from '@/components/ui/Header';
import { routing } from '@/i18n/routing';
import { site } from '@/site.config';

type Props = { children: ReactNode; params: Promise<{ locale: string }> };

const OG_LOCALE: Record<string, string> = {
  en: 'en_US',
  de: 'de_DE',
  pl: 'pl_PL',
  ru: 'ru_RU',
  bn: 'bn_BD',
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Omit<Props, 'children'>): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return {
    metadataBase: new URL(site.url),
    title: t('title'),
    description: t('description'),
    icons: {
      icon: [
        { url: '/favicon.svg', type: 'image/svg+xml' },
        { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      ],
      apple: '/apple-touch-icon.png',
    },
    manifest: '/manifest.webmanifest',
    // Sharing (BRIEF §9): the per-locale card from scripts/og.mjs.
    openGraph: {
      type: 'website',
      siteName: 'Sogda',
      title: t('title'),
      description: t('description'),
      url: `/${locale}`,
      locale: OG_LOCALE[locale] ?? locale,
      images: [{ url: `/og/${locale}.png`, width: 1200, height: 630, alt: t('title') }],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
      images: [`/og/${locale}.png`],
    },
    // Every language's version of the page, and English for everyone else.
    alternates: {
      canonical: `/${locale}`,
      languages: {
        ...Object.fromEntries(routing.locales.map((l) => [l, `/${l}`])),
        'x-default': `/${routing.defaultLocale}`,
      },
    },
  };
}

export const viewport: Viewport = {
  themeColor: '#00C2B2',
};

// Before first paint: the visitor's remembered theme, so a dark pick never
// flashes light. Without JS, or with nothing stored, the system's wins (CSS).
const themeScript = `try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}`;

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'header' });
  return (
    <html
      lang={locale}
      className={`${inter.variable} ${interCyrillic.variable} ${bengali.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {/* The page's only JS; Next's own is stripped after the build (#22). */}
        <script src="/site.js" defer />
      </head>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only z-[60] rounded-full bg-sun px-5 py-3 font-bold text-ink focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          {t('skip')}
        </a>
        <Header locale={locale} />
        <div className="flex-1">{children}</div>
        <Footer locale={locale} />
      </body>
    </html>
  );
}
