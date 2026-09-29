'use client';

import { Languages } from 'lucide-react';

// BRIEF §7: every locale, each named in itself. The choice is remembered, so
// `/` sends the visitor to it next time, over the browser's language.
export function LanguageSwitch({
  locale,
  locales,
  names,
  label,
  className = '',
}: {
  locale: string;
  locales: readonly string[];
  names: Record<string, string>;
  label: string;
  className?: string;
}) {
  return (
    // The caller sets the display (it differs between the bar and the menu).
    <label className={`relative items-center ${className}`}>
      <span className="sr-only">{label}</span>
      <Languages aria-hidden="true" className="pointer-events-none absolute left-3 size-5" />
      <select
        value={locale}
        onChange={(e) => {
          const next = e.target.value;
          try {
            localStorage.setItem('locale', next);
          } catch {
            // Storage blocked: the switch still goes there.
          }
          location.assign(
            location.pathname.replace(/^\/[a-z]{2}(?=\/|$)/, `/${next}`) + location.hash,
          );
        }}
        className="min-h-12 cursor-pointer appearance-none rounded-full border-2 border-line bg-card py-2 pr-4 pl-10 font-semibold"
      >
        {locales.map((l) => (
          <option key={l} value={l} lang={l}>
            {names[l] ?? l}
          </option>
        ))}
      </select>
    </label>
  );
}
