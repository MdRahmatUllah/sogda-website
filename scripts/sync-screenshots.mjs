// `pnpm sync:screens`: the app's real screens (BRIEF §6, #66). For every
// screen and theme in content/screenshots.json, take the app's own store
// capture where one exists (its Play screenshots, shot from the release APK),
// else the golden, and write AVIF + WebP at several widths into
// public/screens, plus a tiny blur placeholder into
// content/screens.generated.json.
//
// - The store sets are per language: English (light, dark), Polish, Russian
//   and Bangla (light). A screen with a capture in another language gets its
//   own variant (`<id>-<theme>@pl`), which the site shows on that locale;
//   every other locale shows the default. A set can skip a capture that's out
//   of date.
// - content/screens.source.json records the store sets' app commit and its
//   site-facts `content_version`, so tests/facts.spec.ts can fail screens
//   shot from other content than content/facts.json's (#61).
// - A store capture (1:2) is extended at the top and bottom, repeating its
//   edge rows (the status and navigation bars), to the goldens' 1170:2532, so
//   every device frame keeps one shape whatever it shows.
// - Every file name carries a hash of its source image, so a screen that
//   changes gets a new URL and /screens can be cached for good (vercel.json).
//
// Unchanged sources are skipped: a second run changes nothing.
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import sharp from 'sharp';

const CONFIG = 'content/screenshots.json';
const GENERATED = 'content/screens.generated.json';
const SOURCE = 'content/screens.source.json';
const OUT = 'public/screens';
const WIDTHS = { phone: [360, 540, 720, 1080], tablet: [720, 1080, 1440, 2048] };
const PHONE = { width: 1170, height: 2532 }; // the goldens' phone
const RAW = 'https://raw.githubusercontent.com/MdRahmatUllah/DeutschPlan';

const { ref, store, screens } = JSON.parse(readFileSync(CONFIG, 'utf8'));
const previous = existsSync(GENERATED) ? JSON.parse(readFileSync(GENERATED, 'utf8')) : {};
const generated = {};
mkdirSync(OUT, { recursive: true });

async function download(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

/** The store capture for a screen, theme and language, or null. */
function storeSource(screen, theme, lang) {
  const set = store.sets[lang];
  const dir = set?.[theme];
  if (!screen.store || !dir || set.skip?.includes(screen.store)) return null;
  return {
    source: `store:${dir}/${screen.store}.png`,
    ref: store.ref,
    url: `${RAW}/${store.ref}/docs/05-dev-guide/store/${dir}/${screen.store}.png`,
  };
}

let built = 0;
async function build(key, device, src) {
  const base = key.replace('@', '-');
  const was = previous[key];
  if (
    was?.source === src.source &&
    was.ref === src.ref &&
    was.widths.every(
      (w) =>
        existsSync(`${OUT}/${base}-${w}.${was.hash}.avif`) &&
        existsSync(`${OUT}/${base}-${w}.${was.hash}.webp`),
    )
  ) {
    generated[key] = was;
    return;
  }
  let png = await download(src.url);
  const hash = createHash('sha256').update(png).digest('hex').slice(0, 8);
  if (src.source.startsWith('store:') && device === 'phone') {
    const { width, height } = await sharp(png).metadata();
    const target = Math.round((width * PHONE.height) / PHONE.width);
    const top = Math.floor((target - height) / 2);
    if (top > 0) {
      png = await sharp(png)
        .extend({ top, bottom: target - height - top, extendWith: 'copy' })
        .png()
        .toBuffer();
    }
  }
  const { width, height } = await sharp(png).metadata();
  for (const w of WIDTHS[device]) {
    const resized = sharp(png).resize({ width: w });
    writeFileSync(
      `${OUT}/${base}-${w}.${hash}.avif`,
      await resized.clone().avif({ quality: 55, effort: 6 }).toBuffer(),
    );
    writeFileSync(
      `${OUT}/${base}-${w}.${hash}.webp`,
      await resized.clone().webp({ quality: 78 }).toBuffer(),
    );
  }
  const blur = await sharp(png).resize({ width: 16 }).webp({ quality: 40 }).toBuffer();
  generated[key] = {
    source: src.source,
    ref: src.ref,
    base,
    hash,
    width,
    height,
    widths: WIDTHS[device],
    placeholder: `data:image/webp;base64,${blur.toString('base64')}`,
  };
  built++;
}

for (const screen of screens) {
  const device = screen.device ?? 'phone';
  for (const theme of screen.themes) {
    const key = `${screen.id}-${theme}`;
    const golden = `${screen.golden}_${theme}_${device}.png`;
    await build(
      key,
      device,
      storeSource(screen, theme, 'en') ?? {
        source: `golden:${golden}`,
        ref,
        url: `${RAW}/${ref}/app/test/golden/goldens/${golden}`,
      },
    );
    for (const lang of Object.keys(store.sets).filter((l) => l !== 'en')) {
      const src = storeSource(screen, theme, lang);
      if (src) await build(`${key}@${lang}`, device, src);
    }
  }
}

// Outputs of screens no longer listed, or of an older source, go.
const keep = new Set(
  Object.values(generated).flatMap((g) =>
    g.widths.flatMap((w) => [`${g.base}-${w}.${g.hash}.avif`, `${g.base}-${w}.${g.hash}.webp`]),
  ),
);
for (const f of readdirSync(OUT)) if (!keep.has(f)) rmSync(`${OUT}/${f}`);

const facts = JSON.parse(
  (await download(`${RAW}/${store.ref}/docs/05-dev-guide/site-facts.json`)).toString('utf8'),
);
const sorted = Object.fromEntries(Object.entries(generated).sort(([a], [b]) => a.localeCompare(b)));
writeFileSync(GENERATED, `${JSON.stringify(sorted, null, 2)}\n`);
const source = { app_ref: store.ref, content_version: facts.content_version };
writeFileSync(SOURCE, `${JSON.stringify(source, null, 2)}\n`);
console.log(
  `screens: ${built} built, ${Object.keys(generated).length - built} unchanged (goldens at ${ref.slice(0, 8)}, store sets at ${store.ref.slice(0, 8)})`,
);
