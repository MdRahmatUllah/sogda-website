import { defineRouting } from 'next-intl/routing';

// The website speaks the app's languages (BRIEF §7). Adding one is this list
// plus messages/<code>.json.
export const routing = defineRouting({
  // The owner's order (2026-09-30): English, German, Polish, Russian, Bangla.
  locales: ['en', 'de', 'pl', 'bn'],
  defaultLocale: 'en',
});

export type Locale = (typeof routing.locales)[number];
