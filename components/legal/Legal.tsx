import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import type { ReactNode } from 'react';
import legal from '@/content/legal.json';

type Key = Exclude<keyof typeof legal, '$comment'>;

/** A legal page's own title, description and share text (not the home
 * page's pitch). Every locale carries the same bilingual text, so each copy
 * is canonical to the German one, which alone is in the sitemap (#58). */
export async function legalMetadata(
  locale: string,
  page: 'impressum' | 'datenschutz',
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'legal' });
  const [name, description] =
    page === 'impressum'
      ? [t('impressum'), t('impressumDescription')]
      : [t('privacy'), t('privacyDescription')];
  const title = `${name} — Sogda`;
  const canonical = `/de/${page}`;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical },
    twitter: { title, description },
  };
}

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
