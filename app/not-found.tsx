import type { Metadata } from 'next';
import { LANGUAGE_NAMES } from '@/components/ui/Footer';
import { Logo } from '@/components/ui/Logo';
import { routing } from '@/i18n/routing';

// One 404.html serves every locale (static export), so it offers all five home
// pages, each named in its own language. Next adds its own noindex.
//
// ponytail: the system sans, not Inter. The static export doesn't attach the
// fonts' CSS to the root not-found, and importing them in the root layout
// drops Inter's preload from every page (CLS 0.02 on /pl and /bn, #58). The
// 404 keeps the site's colours, logo and layout; Inter needs `global-not-found`
// or a build step that inlines the font CSS, if it's ever worth it.
export const metadata: Metadata = { title: 'Page not found — Sogda' };

export default function NotFound() {
  return (
    <html lang="en">
      <body className="grid min-h-dvh place-items-center bg-bg p-6 text-center font-[ui-sans-serif,system-ui,sans-serif] text-ink">
        <main id="main" className="grid justify-items-center gap-6">
          <Logo locale={routing.defaultLocale} label="Sogda, home" />
          <h1 className="text-4xl font-extrabold tracking-[-0.02em]">Page not found</h1>
          <p className="max-w-md text-lg text-muted">
            This page doesn&rsquo;t exist. Sogda, the offline German course, is one click away:
          </p>
          <nav aria-label="Languages">
            <ul className="flex flex-wrap justify-center gap-3">
              {routing.locales.map((l) => (
                <li key={l}>
                  <a
                    href={`/${l}`}
                    lang={l}
                    hrefLang={l}
                    className="inline-flex min-h-12 items-center rounded-full border-2 border-ink bg-card px-5 font-semibold shadow-hard"
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
