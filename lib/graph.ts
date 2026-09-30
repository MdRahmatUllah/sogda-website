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
    nodes.push({
      '@type': 'FAQPage',
      '@id': `${url}#faq`,
      inLanguage: locale,
      isPartOf: { '@id': `${url}#webpage` },
      mainEntity: faq.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    });
  }
  return { '@context': 'https://schema.org', '@graph': nodes };
}

/** JSON-LD as a script's text: our own data, with `<` escaped so nothing in
 * it can close the script. */
export function jsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
