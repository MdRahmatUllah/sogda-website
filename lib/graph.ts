import { getTranslations } from 'next-intl/server';
import { factArgs, facts } from '@/i18n/facts';
import { routing } from '@/i18n/routing';
import { site } from '@/site.config';

// The site's schema.org graph shares node ids across pages (MASTER-PLAN
// W1-c): a page refers to the app, the site and the publisher by @id. #60
// puts those three nodes on every page; the content pages point at them.
export const ids = {
  org: `${site.url}/#org`,
  website: `${site.url}/#website`,
  app: `${site.url}/#app`,
} as const;

export type Faq = { q: string; a: string };

// The app's screens the graph names, from the site's own set (English until
// W2's per-locale screens, #66).
const SCREENSHOTS = ['today-light', 'learn-light', 'exam-results-light', 'progress-light'];

/** The nodes every page carries (#60), in the page's language: the publisher
 * (O5: the brand itself), the site, and the app. No offers or rating until
 * they're real (BRIEF); the Play link once there is one (#45). */
export async function siteNodes(locale: string): Promise<Record<string, unknown>[]> {
  const meta = await getTranslations({ locale, namespace: 'meta' });
  const journey = await getTranslations({ locale, namespace: 'journey' });
  const hero = await getTranslations({ locale, namespace: 'hero' });
  const play = site.playStoreUrl;
  return [
    {
      '@type': 'Organization',
      '@id': ids.org,
      name: 'Sogda',
      url: site.url,
      logo: { '@type': 'ImageObject', url: `${site.url}/icon-512.png`, width: 512, height: 512 },
      // ponytail: the GitHub repo joins sameAs only if the owner agrees (O11, #56).
      ...(play ? { sameAs: [play] } : {}),
    },
    {
      '@type': 'WebSite',
      '@id': ids.website,
      name: 'Sogda',
      url: site.url,
      inLanguage: routing.locales,
      publisher: { '@id': ids.org },
    },
    {
      '@type': 'MobileApplication',
      '@id': ids.app,
      name: 'Sogda',
      alternateName: 'Sogda: German A1–C2',
      description: meta('description'),
      url: `${site.url}/${locale}`,
      inLanguage: locale,
      operatingSystem: 'ANDROID',
      applicationCategory: 'EducationalApplication',
      applicationSubCategory: 'Language learning',
      // No availableLanguage: schema.org has none for an app (the validator
      // flags it); the languages are in the description and the pages.
      softwareVersion: facts.app.version,
      featureList: [
        journey('facts.words', factArgs),
        journey('facts.grammar', factArgs),
        hero('facts.steps', factArgs),
        journey('facts.exams', factArgs),
        hero('facts.offline'),
      ],
      image: `${site.url}/og/${locale}.png`,
      screenshot: SCREENSHOTS.map((s) => `${site.url}/screens/${s}-1080.webp`),
      publisher: { '@id': ids.org },
      author: { '@id': ids.org },
      ...(play ? { installUrl: play, downloadUrl: play } : {}),
    },
  ];
}

/** The FAQ a page shows, as a FAQPage node. */
export function faqPage(
  id: string,
  locale: string,
  faq: Faq[],
  extra: Record<string, unknown> = {},
) {
  return {
    '@type': 'FAQPage',
    '@id': id,
    inLanguage: locale,
    ...extra,
    mainEntity: faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

/** A content page's own nodes: the WebPage about the app, its breadcrumb
 * trail (the locale's home, then the page) and, if it has one, its FAQ. */
export function pageGraph({
  url,
  locale,
  title,
  description,
  crumbs,
  faq,
}: {
  url: string;
  locale: string;
  title: string;
  description: string;
  crumbs: { name: string; url: string }[];
  faq: Faq[];
}) {
  const nodes: Record<string, unknown>[] = [
    {
      '@type': 'WebPage',
      '@id': `${url}#webpage`,
      url,
      name: title,
      description,
      inLanguage: locale,
      isPartOf: { '@id': ids.website },
      about: { '@id': ids.app },
      breadcrumb: { '@id': `${url}#breadcrumb` },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${url}#breadcrumb`,
      itemListElement: crumbs.map((c, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: c.name,
        item: c.url,
      })),
    },
  ];
  if (faq.length) {
    nodes.push(faqPage(`${url}#faq`, locale, faq, { isPartOf: { '@id': `${url}#webpage` } }));
  }
  return { '@context': 'https://schema.org', '@graph': nodes };
}

/** JSON-LD as a script's text: our own data, with `<` escaped so nothing in
 * it can close the script. */
export function jsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
