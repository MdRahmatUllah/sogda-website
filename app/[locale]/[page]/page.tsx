import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { ContentPage } from '@/components/page/ContentPage';
import { findPage, pagesIn } from '@/content/pages';
import { pageMetadata } from '@/lib/page';

type Props = { params: Promise<{ locale: string; page: string }> };

// Every content page, only in the locales it exists in (content/pages.ts).
// Static export: anything else is the 404.
export const dynamicParams = false;

export function generateStaticParams({ params }: { params: { locale: string } }) {
  return pagesIn(params.locale).map((p) => ({ page: p.slug }));
}

async function resolve(params: Props['params']) {
  const { locale, page } = await params;
  const entry = findPage(page);
  if (!entry || !entry.locales.includes(locale)) notFound();
  return { locale, entry, content: await entry.content(locale) };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, entry, content } = await resolve(params);
  return pageMetadata(content, { locale, ...entry });
}

export default async function Page({ params }: Props) {
  const { locale, entry, content } = await resolve(params);
  setRequestLocale(locale);
  return <ContentPage locale={locale} entry={entry} content={content} />;
}
