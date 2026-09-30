import { getTranslations } from 'next-intl/server';
import { FAQ } from '@/components/sections/Closing';
import { factArgs } from '@/i18n/facts';
import { faqPage, ids, jsonLd, siteNodes } from '@/lib/graph';
import { site } from '@/site.config';

// The home page's graph (#60, BRIEF §9): the nodes every page shares (the
// publisher, the site, the app) and the FAQ the page shows.
export async function JsonLd({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'faq' });
  const faq = FAQ.map((k) => ({ q: t(`${k}.q`), a: t(`${k}.a`, factArgs) }));
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      ...(await siteNodes(locale)),
      faqPage(`${site.url}/${locale}#faq`, locale, faq, { about: { '@id': ids.app } }),
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(graph) }} />;
}
