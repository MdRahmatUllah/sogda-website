// Everything the owner decides that the page depends on (BRIEF §10).
export const site = {
  url: 'https://sogda.de',
  /** The Google Play listing; null until the owner shares it (BRIEF §10, 1). */
  playStoreUrl: null as string | null,
  /** 'coming-soon' until the app is listed on the App Store. */
  appStore: 'coming-soon' as const,
  /** The contact address; null until the owner gives one (BRIEF §10, 4). */
  contactEmail: null as string | null,
};
