import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import type { ReactNode } from 'react';
import legal from '@/content/legal.json';
import { OG_LOCALE } from '@/i18n/routing';

type Key = Exclude<keyof typeof legal, '$comment'>;

/** One of the owner's details, or a visible placeholder until it's given. */
export function Detail({ k, label }: { k: Key; label: string }) {
  const value = legal[k];
  if (value) return <>{value}</>;
  return (
    <mark className="rounded bg-sun px-1.5 text-ink" data-placeholder={k}>
      [{label}]
    </mark>
  );
}

export const hasVatId = Boolean(legal.vatId);

const SLUG = { impressum: 'impressum', privacy: 'datenschutz' } as const;

/** A legal page's own title, description and share card (#58). Every locale's
 * copy is the same bilingual text, so all point their canonical at /de. A
 * page's `openGraph` replaces the layout's, hence the whole card here. */
export async function legalMetadata(locale: string, page: keyof typeof SLUG): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'legal' });
  const title = `${t(page)} — Sogda`;
  const description = t(`${page}Description`);
  return {
    title,
    description,
    alternates: { canonical: `/de/${SLUG[page]}` },
    openGraph: {
      type: 'website',
      siteName: 'Sogda',
      title,
      description,
      url: `/${locale}/${SLUG[page]}`,
      locale: OG_LOCALE[locale] ?? locale,
      images: [{ url: `/og/${locale}.png`, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [`/og/${locale}.png`] },
  };
}

/** A legal page (BRIEF §8): the German text is binding, the English follows
 * as a translation; the chrome around them speaks the page's language. */
export async function LegalPage({
  locale,
  title,
  german,
  english,
}: {
  locale: string;
  title: 'impressum' | 'privacy';
  german: ReactNode;
  english: ReactNode;
}) {
  const t = await getTranslations({ locale, namespace: 'legal' });
  return (
    <main id="main" className="legal mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-4xl font-extrabold tracking-[-0.02em]">{t(title)}</h1>
      <p className="mt-4 text-muted">{t('binding')}</p>
      <article lang="de" className="mt-10">
        {german}
      </article>
      <hr className="my-12 border-t-2 border-line" />
      <article lang="en">
        <p className="text-sm font-bold tracking-wide text-muted uppercase">{t('translation')}</p>
        {english}
      </article>
      <p className="mt-12">
        <a className="font-semibold text-link underline underline-offset-4" href={`/${locale}`}>
          {t('back')}
        </a>
      </p>
    </main>
  );
}
