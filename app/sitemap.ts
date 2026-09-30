import { execSync } from 'node:child_process';
import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
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

// The chooser at / (the x-default, #63) and every home page, each naming its
// other languages and the default (BRIEF §9). The legal pages stay out: the
// same bilingual text in every locale, each copy canonical to German (#58).
export default function sitemap(): MetadataRoute.Sitemap {
  const modified = lastModified();
  const chooser = site.url; // no slash, as Next writes it in every page's hreflang
  const languages = {
    ...Object.fromEntries(routing.locales.map((l) => [l, `${site.url}/${l}`])),
    'x-default': chooser,
  };
  return [chooser, ...routing.locales.map((l) => `${site.url}/${l}`)].map((url) => ({
    url,
    lastModified: modified,
    alternates: { languages },
  }));
}
