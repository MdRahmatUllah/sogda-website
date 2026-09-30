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

// Every home page, then every content page in each locale it exists in (#68),
// each naming its other languages and the default (BRIEF §9). The legal pages
// stay out: the same bilingual text in every locale, canonical to German (#58).
export default function sitemap(): MetadataRoute.Sitemap {
  const modified = lastModified();
  const entries = (locales: readonly string[], path: (l: string) => string) => {
    const languages: Record<string, string> = Object.fromEntries(
      locales.map((l) => [l, `${site.url}${path(l)}`]),
    );
    const fallback = locales.includes(routing.defaultLocale) ? routing.defaultLocale : locales[0]!;
    languages['x-default'] = `${site.url}${path(fallback)}`;
    return locales.map((l) => ({
      url: `${site.url}${path(l)}`,
      lastModified: modified,
      alternates: { languages },
    }));
  };
  return [
    ...entries(routing.locales, (l) => `/${l}`),
    ...pages
      .filter((p) => !p.gallery)
      .flatMap((p) => entries(p.locales, (l) => pagePath(l, p.slug))),
  ];
}
