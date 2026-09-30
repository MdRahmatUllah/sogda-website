import { existsSync } from 'node:fs';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { factArgs } from '@/i18n/facts';
import { site } from '@/site.config';
import type { Faq } from './graph';

/** One content page in one language (MASTER-PLAN W3-0, #68). */
export type PageContent = {
  /** `<title>`, and the share card's title. */
  title: string;
  /** The meta description: ~150 characters. */
  description: string;
  /** The page's short name, for breadcrumbs and links to it. */
  name: string;
  /** A line above the H1 (optional). */
  eyebrow?: string;
  h1: string;
  /** Answer first: two self-contained sentences that answer the page's query,
   * with the numbers. AI answers and search snippets lift exactly this. */
  answer: string;
  sections: { id: string; heading: string; paragraphs: string[]; list?: string[] }[];
  faq: Faq[];
};

type Values = Record<string, string | number>;

/**
 * A page's copy from its own messages namespace, `pages.<slug>` (team mode:
 * every page keeps to its namespace). Shape, in each `messages/<locale>.json`:
 *
 *   "pages": { "<slug>": {
 *     "title", "description", "name", "eyebrow"?, "h1", "answer",
 *     "sections": { "<id>": { "heading", "body": { "<p>": "…" }, "list"?: { "<i>": "…" } } },
 *     "faq": { "<id>": { "q", "a" } }
 *   } }
 *
 * Sections, paragraphs and questions keep the file's order. `values` fills
 * ICU arguments such as `{words}`: by default every fact in content/facts.json
 * (`factArgs`, #61), so a page never writes a number itself.
 */
export async function contentFromMessages(
  locale: string,
  slug: string,
  values: Values = factArgs,
): Promise<PageContent> {
  const t = await getTranslations({ locale, namespace: `pages.${slug}` });
  const keys = (path: string) => Object.keys((t.raw(path) as object | undefined) ?? {});
  return {
    title: t('title', values),
    description: t('description', values),
    name: t('name', values),
    eyebrow: t.has('eyebrow') ? t('eyebrow', values) : undefined,
    h1: t('h1', values),
    answer: t('answer', values),
    sections: keys('sections').map((id) => ({
      id,
      heading: t(`sections.${id}.heading`, values),
      paragraphs: keys(`sections.${id}.body`).map((p) => t(`sections.${id}.body.${p}`, values)),
      list: t.has(`sections.${id}.list`)
        ? keys(`sections.${id}.list`).map((i) => t(`sections.${id}.list.${i}`, values))
        : undefined,
    })),
    faq: t.has('faq')
      ? keys('faq').map((id) => ({ q: t(`faq.${id}.q`, values), a: t(`faq.${id}.a`, values) }))
      : [],
  };
}

/** The page's path in a locale. */
export const pagePath = (locale: string, slug: string) => `/${locale}/${slug}`;

/** Its own title, description, canonical, hreflang across the locales it
 * exists in, and share card: the page's own if `pnpm og` made one, else the
 * locale's. */
export function pageMetadata(
  content: PageContent,
  {
    locale,
    slug,
    locales,
    gallery,
  }: { locale: string; slug: string; locales: readonly string[]; gallery?: boolean },
): Metadata {
  const path = pagePath(locale, slug);
  const card = existsSync(`public/og/${locale}/${slug}.png`)
    ? `/og/${locale}/${slug}.png`
    : `/og/${locale}.png`;
  const languages: Record<string, string> = Object.fromEntries(
    locales.map((l) => [l, pagePath(l, slug)]),
  );
  languages['x-default'] = pagePath(locales.includes('en') ? 'en' : locales[0]!, slug);
  return {
    title: content.title,
    description: content.description,
    ...(gallery ? { robots: { index: false } } : {}),
    alternates: { canonical: path, languages },
    openGraph: {
      title: content.title,
      description: content.description,
      url: path,
      images: [{ url: card, width: 1200, height: 630, alt: content.title }],
    },
    twitter: { title: content.title, description: content.description, images: [card] },
  };
}

export const absolute = (path: string) => `${site.url}${path}`;
