import { execSync } from 'node:child_process';
import type { MetadataRoute } from 'next';
import { pages } from '@/content/pages';
import { routing } from '@/i18n/routing';
import { pagePath } from '@/lib/page';
import { site } from '@/site.config';

export const dynamic = 'force-static';

// When the site last changed: the commit being built. Vercel builds only
// main, and main changes only with a release (#58), so the date is honest.
function lastModified(): Date {
  try {
    return new Date(execSync('git log -1 --format=%cI', { encoding: 'utf8' }).trim());
  } catch {
    return new Date(); // no git history (a tarball build): the build itself
  }
}

// Every home page, each naming its other languages and the default (BRIEF §9),
// then every content page in the locales it exists in (#68). The legal pages
// stay out: the same bilingual text in every locale, each copy canonical to
// the German one (#58).
export default function sitemap(): MetadataRoute.Sitemap {
  const modified = lastModified();
  const languages = {
    ...Object.fromEntries(routing.locales.map((l) => [l, `${site.url}/${l}`])),
    'x-default': `${site.url}/${routing.defaultLocale}`,
  };
  const home = routing.locales.map((locale) => ({
    url: `${site.url}/${locale}`,
    lastModified: modified,
    alternates: { languages },
  }));
  const content = pages
    .filter((p) => !p.gallery)
    .flatMap((p) => {
      const url = (l: string) => `${site.url}${pagePath(l, p.slug)}`;
      const languages = {
        ...Object.fromEntries(p.locales.map((l) => [l, url(l)])),
        'x-default': url(p.locales.includes('en') ? 'en' : p.locales[0]!),
      };
      return p.locales.map((locale) => ({
        url: url(locale),
        lastModified: modified,
        alternates: { languages },
      }));
    });
  return [...home, ...content];
}
