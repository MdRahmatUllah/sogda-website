import { getTranslations } from 'next-intl/server';
import { factArgs } from '@/i18n/facts';
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
};

// The template's own sample: every part of a page, filled with copy the site
// already has (and every locale has reviewed), so it adds no new text.
async function sample(locale: string): Promise<PageContent> {
  const t = await getTranslations({ locale });
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
  // Sogda in brief (#70): the press and AI-answer fact sheet.
  {
    slug: 'about',
    locales: routing.locales,
    content: (l) => contentFromMessages(l, 'about', factArgs),
  },
  { slug: 'template-sample', locales: routing.locales, content: sample, gallery: true },
];

const galleryBuild = process.env.NODE_ENV !== 'production' || Boolean(process.env.SOGDA_GALLERY);
const real = PAGES.filter((p) => !p.gallery);

/** The pages this build has. */
// ponytail: a static export refuses a dynamic route with no pages, so until
// the first real page lands the sample stands in: noindex, in no sitemap, and
// linked from nowhere. The first real entry above retires it on its own.
export const pages = galleryBuild || real.length === 0 ? PAGES : real;

/** The pages that exist in a locale, in registry order. */
export const pagesIn = (locale: string) => pages.filter((p) => p.locales.includes(locale));

export const findPage = (slug: string) => pages.find((p) => p.slug === slug);
