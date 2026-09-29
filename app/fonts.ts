import localFont from 'next/font/local';

// Self-hosted (a Google Fonts request would be a GDPR problem in Germany), and
// subset from the app's own variable fonts (app/assets/fonts in the app repo)
// with fontTools:
//   Inter: wght 400-800, opsz pinned at 14 (the display cut's axis cost
//   23 KB and 0.2 s of LCP); Basic Latin, Latin-1, Latin
//   Extended-A (Polish), punctuation, arrows, ≈ ≠ ≤ ≥; kern liga calt ccmp
//   locl mark mkmk case tnum frac sups.
//   Noto Sans Bengali: wght 400-700, wdth pinned at 100; U+0964-0965,
//   U+0980-09FE, U+200B-200D, U+25CC; every layout feature (Bangla shaping).
// ponytail: Cyrillic isn't in the Inter subset yet; add it with the ru locale.
export const inter = localFont({
  src: './fonts/inter-latin.woff2',
  variable: '--font-inter',
  weight: '400 800',
  display: 'swap',
});

export const bengali = localFont({
  src: './fonts/noto-sans-bengali.woff2',
  variable: '--font-bengali',
  weight: '400 700',
  display: 'swap',
  // Only a page with Bangla on it downloads this.
  preload: false,
  adjustFontFallback: false,
  declarations: [{ prop: 'unicode-range', value: 'U+0964-0965, U+0980-09FE, U+200B-200D, U+25CC' }],
});
