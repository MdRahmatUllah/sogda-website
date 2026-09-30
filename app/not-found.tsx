import { LANGUAGE_NAMES } from '@/components/ui/Footer';
import { Logo } from '@/components/ui/Logo';
import { routing } from '@/i18n/routing';

// One 404.html serves every path (static export), so it can't know the
// visitor's language: it names the site and offers every home page, each
// language in itself (#58).
// ponytail: the phone's own sans-serif, not Inter. The static export leaves
// next/font's @font-face rules out of the 404, and pulling them in through the
// root layout cost every page its font preload. Inter here needs that fixed
// upstream, or @font-face rules of our own.
export default function NotFound() {
  return (
    <html lang={routing.defaultLocale}>
      <head>
        <title>Page not found — Sogda</title>
      </head>
      <body className="grid min-h-dvh place-items-center bg-bg p-6 text-center font-[system-ui,sans-serif] text-fg">
        <main className="grid justify-items-center gap-6">
          <Logo locale={routing.defaultLocale} label="Sogda, home" />
          <h1 className="text-3xl font-extrabold">Page not found</h1>
          <nav aria-label="Sogda in your language">
            <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 font-semibold">
              {routing.locales.map((l) => (
                <li key={l}>
                  <a
                    className="inline-flex min-h-12 items-center underline-offset-4 hover:underline"
                    href={`/${l}`}
                    lang={l}
                    hrefLang={l}
                  >
                    {LANGUAGE_NAMES[l] ?? l}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </main>
      </body>
    </html>
  );
}
