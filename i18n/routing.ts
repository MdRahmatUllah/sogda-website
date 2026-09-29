import { defineRouting } from 'next-intl/routing';

// The website speaks the app's languages (BRIEF §7). Adding one is this list
// plus messages/<code>.json.
export const routing = defineRouting({
  locales: ['en', 'bn'],
  defaultLocale: 'en',
});

export type Locale = (typeof routing.locales)[number];
