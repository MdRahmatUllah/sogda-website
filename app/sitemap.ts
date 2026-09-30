import type { MetadataRoute } from 'next';
import { pages } from '@/content/pages';
import { routing } from '@/i18n/routing';
import { pagePath } from '@/lib/page';
import { site } from '@/site.config';

export const dynamic = 'force-static';

// Every page in every language, each naming its other languages (BRIEF §9),
// then every content page in the locales it exists in (#68).
export default function sitemap(): MetadataRoute.Sitemap {
  const fixed = ['', '/impressum', '/datenschutz'].flatMap((page) =>
    routing.locales.map((locale) => ({
      url: `${site.url}/${locale}${page}`,
      changeFrequency: 'monthly' as const,
      priority: page ? 0.3 : 1,
      alternates: {
        languages: Object.fromEntries(routing.locales.map((l) => [l, `${site.url}/${l}${page}`])),
      },
    })),
  );
  const content = pages
    .filter((p) => !p.gallery)
    .flatMap((p) =>
      p.locales.map((locale) => ({
        url: `${site.url}${pagePath(locale, p.slug)}`,
        changeFrequency: 'monthly' as const,
        priority: 0.8,
        alternates: {
          languages: Object.fromEntries(
            p.locales.map((l) => [l, `${site.url}${pagePath(l, p.slug)}`]),
          ),
        },
      })),
    );
  return [...fixed, ...content];
}
