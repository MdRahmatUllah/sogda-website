import { getTranslations } from 'next-intl/server';
import { BANGLA_LOCALES, banglaPage } from '@/content/bangla';
import { LEVEL_LOCALES, levelPage, levelSlug } from '@/content/levels';
import { factArgs, facts } from '@/i18n/facts';
import { routing } from '@/i18n/routing';
import { contentFromMessages, type PageContent } from '@/lib/page';

// Every content page (MASTER-PLAN W3, #68): its URL segment, the locales it
// exists in (hreflang and the sitemap cover only these), and its copy per
// locale. A new page is one entry here, usually with
// `content: (l) => contentFromMessages(l, '<slug>')` and a `pages.<slug>`
// namespace in each of its locales' messages.
export type PageEntry = {
  /** The URL segment: /<locale>/<slug>. ASCII, the same in every locale. */
  slug: string;
  locales: readonly string[];
  content: (locale: string) => Promise<PageContent>;
  /** Built only in `pnpm dev` or with SOGDA_GALLERY=1, never indexed. */
  gallery?: boolean;
  /** Pages of one series (the 12 levels): the footer links only the first. */
  series?: string;
};

// The template's own sample: every part of a page, filled with copy the site
// already has (and every locale has reviewed), so it adds no new text.
async function sample(locale: string): Promise<PageContent> {
  const tr = await getTranslations({ locale });
  // Every message may take any fact as an ICU argument (#61).
  const t = (key: string) => tr(key, factArgs);
  return {
    title: `${t('nav.day')} — Sogda`,
    description: t('meta.description'),
    name: t('nav.day'),
    eyebrow: t('day.eyebrow'),
    h1: t('day.title'),
    answer: t('hero.subline'),
    sections: [
      { id: 'plan', heading: t('day.plan.title'), paragraphs: [t('day.plan.body')] },
      { id: 'revise', heading: t('day.revise.title'), paragraphs: [t('day.revise.body')] },
      {
        id: 'memory',
        heading: t('memory.title'),
        paragraphs: [t('memory.body')],
        list: [t('journey.facts.words'), t('journey.facts.grammar'), t('journey.facts.exams')],
      },
    ],
    faq: (['internet', 'exams'] as const).map((k) => ({ q: t(`faq.${k}.q`), a: t(`faq.${k}.a`) })),
  };
}

const PAGES: PageEntry[] = [
  // Fair comparisons, features only (#74): en and de first; pl, ru and bn
  // join after their native drafts.
  ...['sogda-vs-anki', 'sogda-vs-duolingo'].map((slug) => ({
    slug,
    locales: ['en', 'de'],
    content: (l: string) => contentFromMessages(l, slug),
  })),
  { slug: 'template-sample', locales: routing.locales, content: sample, gallery: true },
  // Sogda in brief (#70): the press and AI-answer fact sheet.
  { slug: 'about', locales: routing.locales, content: (l) => contentFromMessages(l, 'about') },
  // #69: the first audience page, for Bangla speakers.
  { slug: 'learn-german-in-bangla', locales: BANGLA_LOCALES, content: banglaPage },
  // #72: a page per step, A1.1 … C2.2, from content/facts.json.
  ...facts.steps.map((s) => ({
    slug: levelSlug(s.code),
    locales: LEVEL_LOCALES,
    series: 'levels',
    content: (locale: string) => levelPage(locale, s.code),
  })),
];

const galleryBuild = process.env.NODE_ENV !== 'production' || Boolean(process.env.SOGDA_GALLERY);
const real = PAGES.filter((p) => !p.gallery);

/** The pages this build has. */
// ponytail: a static export refuses a locale with no pages under [page], so in
// a locale that has no real page yet (/de, while the level pages skip it, #72)
// the sample stands in: noindex, in no sitemap, and linked from nowhere. A
// real page in that locale retires it there on its own.
const bare = routing.locales.filter((l) => !real.some((p) => p.locales.includes(l)));
export const pages: PageEntry[] = galleryBuild
  ? PAGES
  : [
      ...real,
      ...PAGES.filter((p) => p.gallery && bare.length > 0).map((p) => ({ ...p, locales: bare })),
    ];

/** The pages that exist in a locale, in registry order. */
export const pagesIn = (locale: string) => pages.filter((p) => p.locales.includes(locale));

export const findPage = (slug: string) => pages.find((p) => p.slug === slug);
