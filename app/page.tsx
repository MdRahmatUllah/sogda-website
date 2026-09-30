import { readFileSync } from 'node:fs';
import { LANGUAGE_NAMES } from '@/components/ui/Footer';
import { Mark } from '@/components/ui/Mark';
import { routing } from '@/i18n/routing';
import { site } from '@/site.config';

// `/` (BRIEF §7, #63): the site's x-default, a small page any crawler can
// index. Browsers never see it: vercel.json sends every request that carries
// Accept-Language to its language (307, `?from=root`), and the locale page's
// head script honours a remembered pick. Only a visitor with no
// Accept-Language (a crawler) lands here, and picks.
// ponytail: the phone's own sans-serif, as the 404 (next/font's faces don't
// reach pages outside the locale layout in a static export).
const messages = Object.fromEntries(
  routing.locales.map((l) => [
    l,
    JSON.parse(readFileSync(`messages/${l}.json`, 'utf8')) as {
      meta: { title: string; description: string };
      hero: { headline: string };
    },
  ]),
);
const en = messages[routing.defaultLocale]!;

export default function RootPage() {
  return (
    <html lang={routing.defaultLocale}>
      <head>
        <title>{en.meta.title}</title>
        <meta name="description" content={en.meta.description} />
        <link rel="canonical" href={site.url} />
        {routing.locales.map((l) => (
          <link key={l} rel="alternate" hrefLang={l} href={`${site.url}/${l}`} />
        ))}
        <link rel="alternate" hrefLang="x-default" href={site.url} />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className="grid min-h-dvh place-items-center bg-bg p-6 font-[system-ui,sans-serif] text-fg">
        <main className="grid w-full max-w-xl justify-items-center gap-6 text-center">
          <Mark className="size-16" />
          <h1 className="text-3xl font-extrabold tracking-[-0.02em]">{en.meta.title}</h1>
          <p className="text-lg text-muted">{en.meta.description}</p>
          <ul className="grid w-full gap-3">
            {routing.locales.map((l) => (
              <li key={l}>
                <a
                  href={`/${l}`}
                  hrefLang={l}
                  lang={l}
                  className="card flex min-h-14 flex-col items-start px-5 py-3 text-left"
                >
                  <span className="text-lg font-extrabold">{LANGUAGE_NAMES[l] ?? l}</span>
                  <span className="text-muted">{messages[l]!.hero.headline}</span>
                </a>
              </li>
            ))}
          </ul>
        </main>
      </body>
    </html>
  );
}
