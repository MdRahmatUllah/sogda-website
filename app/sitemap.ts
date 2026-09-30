import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { site } from '@/site.config';

export const dynamic = 'force-static';

// Every home page, each naming its other languages and the x-default (BRIEF
// §9). The legal pages stay out: the same text in every locale, canonical to
// /de (#58). lastmod is the build: the one sitemap field Google says it reads.
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const languages = {
    ...Object.fromEntries(routing.locales.map((l) => [l, `${site.url}/${l}`])),
    'x-default': `${site.url}/${routing.defaultLocale}`,
  };
  return routing.locales.map((locale) => ({
    url: `${site.url}/${locale}`,
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: 1,
    alternates: { languages },
  }));
}
