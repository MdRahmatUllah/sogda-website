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
//   Inter Cyrillic: the same axes and features, U+0400-045F, U+0490-0491,
//   U+04B0-04B1, U+2116 (12 KB), a face of its own (below).
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
  // optional, not swap (#116): a face that misses the first ~100 ms is never
  // swapped in on that view, so a long Bangla heading can't re-wrap and shift
  // the page; it's cached for the next one. A preload would fix it too, but
  // costs ~0.5 s of LCP (#110). Android's own Bangla fallback is Noto anyway.
  display: 'optional',
  // Only a page with Bangla on it downloads this.
  preload: false,
  adjustFontFallback: false,
  declarations: [{ prop: 'unicode-range', value: 'U+0964-0965, U+0980-09FE, U+200B-200D, U+25CC' }],
});

// Cyrillic, only where a page shows it (the Russian pages, an opened language
// menu). It comes first in the stack (globals.css) and covers only Cyrillic,
// so Latin text skips it, and Cyrillic never falls to the Latin face's Arial
// fallback while it loads (Inter Latin has no Cyrillic glyphs to offer).
export const interCyrillic = localFont({
  src: './fonts/inter-cyrillic.woff2',
  variable: '--font-inter-cyrillic',
  weight: '400 800',
  display: 'swap',
  preload: false,
  adjustFontFallback: false,
  declarations: [{ prop: 'unicode-range', value: 'U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116' }],
});
