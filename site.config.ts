import legal from './content/legal.json';

// Everything the owner decides that the page depends on (BRIEF §10).
export const site = {
  /** The canonical host. Vercel's domain settings make www.sogda.de the
   * primary (sogda.de redirects to it), so canonicals, hreflang, the sitemap
   * and the share cards use it too (#13). If sogda.de is ever made primary,
   * this one line changes. */
  url: 'https://www.sogda.de',
  /** The Google Play listing; null until the owner shares it (BRIEF §10, 1). */
  playStoreUrl: null as string | null,
  /** 'coming-soon' until the app is listed on the App Store. */
  appStore: 'coming-soon' as const,
  /** The contact address; null until the owner gives one (BRIEF §10, 4).
   * It is the Impressum's (content/legal.json). */
  contactEmail: legal.email as string | null,
};
