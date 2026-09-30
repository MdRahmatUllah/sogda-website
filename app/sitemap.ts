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

// The chooser at / (the x-default, #63), every home page, then every content
// page in each locale it exists in (#68), each naming its other languages and
// its default (BRIEF §9). The legal pages stay out: the same bilingual text in
// every locale, each copy canonical to German (#58).
export default function sitemap(): MetadataRoute.Sitemap {
  const modified = lastModified();
  const chooser = site.url; // no slash, as Next writes it in every page's hreflang
  const entries = (urls: string[], languages: Record<string, string>) =>
    urls.map((url) => ({ url, lastModified: modified, alternates: { languages } }));
  const homes = Object.fromEntries(routing.locales.map((l) => [l, `${site.url}/${l}`]));
  return [
    ...entries([chooser, ...Object.values(homes)], { ...homes, 'x-default': chooser }),
    ...pages
      .filter((p) => !p.gallery)
      .flatMap((p) => {
        const urls = Object.fromEntries(
          p.locales.map((l) => [l, `${site.url}${pagePath(l, p.slug)}`]),
        );
        const fallback = p.locales.includes(routing.defaultLocale)
          ? routing.defaultLocale
          : p.locales[0]!;
        return entries(Object.values(urls), { ...urls, 'x-default': urls[fallback]! });
      }),
  ];
}
