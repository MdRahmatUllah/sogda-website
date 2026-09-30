'use client';

import { ChevronDown, Languages } from 'lucide-react';
import type { MouseEvent } from 'react';

type Props = {
  locale: string;
  locales: readonly string[];
  names: Record<string, string>;
  label: string;
  className?: string;
};

// BRIEF §7: every locale, each named in itself; the choice is remembered, so
// `/` sends the visitor to it next time, over the browser's language.
//
// Links, not a <select>: a closed select still lays out every option, so each
// script's font (Bangla: 70 KB, Cyrillic) would load on every page. A link list
// in a native popover (or in the closed phone menu) is laid out, and its fonts
// fetched, only when it opens. Without JS the links still go to each home page.
function go(e: MouseEvent<HTMLElement>) {
  const link = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[hreflang]');
  if (!link) return;
  const next = link.hreflang;
  e.preventDefault();
  try {
    localStorage.setItem('locale', next);
  } catch {
    // Storage blocked: the link still goes there.
  }
  location.assign(location.pathname.replace(/^\/[a-z]{2}(?=\/|$)/, `/${next}`) + location.hash);
}

function Links({ locale, locales, names, className = '' }: Omit<Props, 'label'>) {
  return (
    <ul className={className} onClick={go}>
      {locales.map((l) => (
        <li key={l}>
          <a
            href={`/${l}`}
            lang={l}
            hrefLang={l}
            aria-current={l === locale ? 'true' : undefined}
            className="flex min-h-12 items-center rounded-xl px-4 font-semibold hover:bg-well aria-[current]:bg-well"
          >
            {names[l] ?? l}
          </a>
        </li>
      ))}
    </ul>
  );
}

/** The header bar's switch: a button and a popover of links. */
export function LanguageSwitch({ locale, locales, names, label, className = '' }: Props) {
  return (
    <div className={className}>
      <button
        type="button"
        popoverTarget="language-menu"
        className="inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-line bg-card px-4 font-semibold"
      >
        <Languages aria-hidden="true" className="size-5" />
        <span className="sr-only">{label}: </span>
        <span lang={locale}>{names[locale] ?? locale}</span>
        <ChevronDown aria-hidden="true" className="size-4" />
      </button>
      <nav
        id="language-menu"
        popover="auto"
        aria-label={label}
        className="card fixed inset-auto top-[4.25rem] right-[max(1rem,calc((100vw-72rem)/2+1.5rem))] m-0 w-48 p-2 text-fg"
      >
        <Links locale={locale} locales={locales} names={names} />
      </nav>
    </div>
  );
}

/** The phone menu's switch: the same links, laid out only when the menu opens. */
export function LanguageList({ locale, locales, names, label }: Props) {
  return (
    <nav aria-label={label} className="mt-4 border-t-2 border-line pt-4">
      <Links locale={locale} locales={locales} names={names} className="grid gap-1" />
    </nav>
  );
}
