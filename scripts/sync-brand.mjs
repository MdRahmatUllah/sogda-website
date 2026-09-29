// `pnpm sync:brand`: the app's brand kit (BRIEF §5) into public/brand, pinned
// to one app commit so the site never changes by accident, plus the favicons,
// touch icons and web manifest generated from svg/icon-tiles-full.svg.
// Running it twice changes nothing.
import { mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import sharp from 'sharp';

// The app commit that last changed docs/sogda-brand-kit (the kit is in no tag yet).
const REF = '3ebcb0e02205b3913a6c1aae967744b78dd73387';
const BASE = `https://raw.githubusercontent.com/MdRahmatUllah/DeutschPlan/${REF}/docs/sogda-brand-kit`;

const FILES = [
  'svg/icon-tiles-full.svg',
  'svg/icon-tiles-mono.svg',
  'svg/icon-road-full.svg',
  'svg/lockup-horizontal-tiles-light.svg',
  'svg/lockup-horizontal-tiles-dark.svg',
  'svg/lockup-horizontal-road-light.svg',
  'svg/lockup-horizontal-road-dark.svg',
  'svg/lockup-stacked-tiles-light.svg',
  'svg/lockup-stacked-road-light.svg',
  'svg/wordmark-ink.svg',
  'png/play-store-icon-512.png',
];

async function fetchFile(path) {
  const res = await fetch(`${BASE}/${path}`);
  if (!res.ok) throw new Error(`${path}: HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

mkdirSync('public/brand', { recursive: true });
for (const path of FILES) {
  writeFileSync(`public/brand/${path.split('/').pop()}`, await fetchFile(path));
}

// Icons from the master icon: the SVG favicon, PNGs for browsers that want them.
const icon = await fetchFile('svg/icon-tiles-full.svg');
writeFileSync('public/favicon.svg', icon);
for (const [name, size] of [
  ['favicon-32.png', 32],
  ['apple-touch-icon.png', 180],
  ['icon-192.png', 192],
  ['icon-512.png', 512],
]) {
  const png = await sharp(icon, { density: (72 * size) / 108 })
    .resize(size, size)
    .png({ compressionLevel: 9 })
    .toBuffer();
  writeFileSync(`public/${name}`, png);
}
writeFileSync(
  'public/manifest.webmanifest',
  `${JSON.stringify(
    {
      name: 'Sogda',
      short_name: 'Sogda',
      description: 'The road to a new language',
      start_url: '/',
      display: 'browser',
      theme_color: '#00C2B2',
      background_color: '#FFF8EE',
      icons: [
        { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
        { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' },
      ],
    },
    null,
    2,
  )}\n`,
);
// Google's official "Get it on Google Play" badge, unmodified (CLAUDE.md, Hard
// rules), one per site language.
mkdirSync('public/badges', { recursive: true });
const locales = readdirSync('messages').map((f) => f.replace(/\.json$/, ''));
for (const locale of locales) {
  const url = `https://play.google.com/intl/en_us/badges/static/images/badges/${locale}_badge_web_generic.png`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
  writeFileSync(`public/badges/google-play-${locale}.png`, Buffer.from(await res.arrayBuffer()));
}
console.log(
  `brand: ${FILES.length} kit files at ${REF.slice(0, 8)}, icons, manifest, ${locales.length} Play badges`,
);
