import { ChevronDown, ChevronRight } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { pagesIn, type PageEntry } from '@/content/pages';
import { jsonLd, pageGraph, siteNodes } from '@/lib/graph';
import { absolute, pagePath, type PageContent } from '@/lib/page';
import { StoreBadges } from '@/components/ui/StoreBadges';

// A content page (MASTER-PLAN W3-0, #68). Answer first, then the sections,
// a FAQ, the store, and links onward. Static HTML: no script of its own.
export async function ContentPage({
  locale,
  entry,
  content,
}: {
  locale: string;
  entry: PageEntry;
  content: PageContent;
}) {
  const t = await getTranslations({ locale });
  const url = absolute(pagePath(locale, entry.slug));
  const home = absolute(`/${locale}`);
  const others = pagesIn(locale).filter((p) => p.slug !== entry.slug && !p.gallery);
  const related = await Promise.all(
    others.map(async (p) => ({ slug: p.slug, name: (await p.content(locale)).name })),
  );
  const graph = pageGraph({
    url,
    locale,
    title: content.title,
    description: content.description,
    crumbs: [
      { name: 'Sogda', url: home },
      { name: content.name, url },
    ],
    faq: content.faq,
  });
  // The shared nodes the page's own ones point at (#60).
  graph['@graph'].unshift(...(await siteNodes(locale)));
  return (
    <main id="main" className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(graph) }} />
      <nav aria-label={t('page.breadcrumb')}>
        <ol className="flex flex-wrap items-center gap-1 text-sm font-semibold text-muted">
          <li>
            <a
              href={`/${locale}`}
              className="inline-flex min-h-6 items-center underline-offset-4 hover:underline"
            >
              Sogda
            </a>
          </li>
          <li aria-hidden="true">
            <ChevronRight className="size-4" />
          </li>
          <li>
            <span aria-current="page">{content.name}</span>
          </li>
        </ol>
      </nav>

      <header className="mt-8">
        {content.eyebrow && <p className="font-semibold text-link">{content.eyebrow}</p>}
        <h1 className="mt-2 text-4xl leading-tight font-extrabold tracking-[-0.02em] text-balance sm:text-5xl">
          {content.h1}
        </h1>
        {/* Answer first (#68): the two sentences a search snippet or an AI answer lifts. */}
        <p data-answer="" className="mt-6 text-xl leading-relaxed">
          {content.answer}
        </p>
      </header>

      {content.sections.map((s) => (
        <section key={s.id} aria-labelledby={`s-${s.id}`} className="mt-12">
          <h2 id={`s-${s.id}`} className="text-2xl leading-tight font-extrabold sm:text-3xl">
            {s.heading}
          </h2>
          {s.paragraphs.map((p, i) => (
            <p key={i} className="mt-4 text-lg text-muted">
              {p}
            </p>
          ))}
          {s.list && (
            <ul className="mt-4 grid gap-2 text-lg">
              {s.list.map((item, i) => (
                <li key={i} className="flex gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-2 size-3 shrink-0 rounded-full border-2 border-ink bg-sun"
                  />
                  {item}
                </li>
              ))}
            </ul>
          )}
          {s.terms && (
            <dl className="mt-4 grid gap-x-6 gap-y-2 text-lg sm:grid-cols-[auto_1fr]">
              {s.terms.map((term, i) => (
                <div key={i} className="contents">
                  <dt lang={term.lang} className="font-bold">
                    {term.term}
                  </dt>
                  <dd className="text-muted">{term.detail}</dd>
                </div>
              ))}
            </dl>
          )}
        </section>
      ))}

      {content.faq.length > 0 && (
        <section aria-labelledby="faq-title" className="mt-16">
          <h2 id="faq-title" className="text-2xl leading-tight font-extrabold sm:text-3xl">
            {t('faq.title')}
          </h2>
          <div className="mt-6 grid gap-4">
            {content.faq.map((f, i) => (
              <details key={i} className="faq card group">
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-6 py-4 text-lg font-bold [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <ChevronDown
                    aria-hidden="true"
                    className="shrink-0 transition-transform duration-200 group-open:rotate-180"
                  />
                </summary>
                <p className="px-6 pb-5 text-lg text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      <section aria-labelledby="page-cta" className="card mt-16 p-6 sm:p-8">
        <h2 id="page-cta" className="text-2xl leading-tight font-extrabold">
          {t('cta.title')}
        </h2>
        <StoreBadges locale={locale} qr={false} className="mt-6" />
      </section>

      <nav aria-labelledby="page-related" className="mt-12">
        <h2 id="page-related" className="text-xl font-extrabold">
          {t('page.related')}
        </h2>
        <ul className="mt-4 grid gap-2 font-semibold">
          <li>
            <a
              href={`/${locale}`}
              className="inline-flex min-h-6 items-center text-link underline-offset-4 hover:underline"
            >
              {t('header.home')}
            </a>
          </li>
          {related.map((r) => (
            <li key={r.slug}>
              <a
                href={pagePath(locale, r.slug)}
                className="inline-flex min-h-6 items-center text-link underline-offset-4 hover:underline"
              >
                {r.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </main>
  );
}
