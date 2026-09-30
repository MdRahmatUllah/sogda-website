import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { site } from '@/site.config';

export const dynamic = 'force-static';

// Every page in every language, each naming its other languages (BRIEF §9).
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ['', '/impressum', '/datenschutz'];
  return pages.flatMap((page) =>
    routing.locales.map((locale) => ({
      url: `${site.url}/${locale}${page}`,
      changeFrequency: 'monthly' as const,
      priority: page ? 0.3 : 1,
      alternates: {
        languages: Object.fromEntries(routing.locales.map((l) => [l, `${site.url}/${l}${page}`])),
      },
    })),
  );
}
