// `pnpm sync:screens`: the app's real screens (BRIEF §6). For every screen and
// theme in content/screenshots.json, download the golden at the pinned app
// ref and write AVIF + WebP at several widths into public/screens, plus a
// tiny blur placeholder into content/screens.generated.json.
//
// A pinned ref never changes, so a screen already built from the same ref and
// golden is skipped: a second run changes nothing. Bump the ref, and every
// screen is rebuilt.
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import sharp from 'sharp';

const CONFIG = 'content/screenshots.json';
const GENERATED = 'content/screens.generated.json';
const OUT = 'public/screens';
const WIDTHS = { phone: [360, 540, 720, 1080], tablet: [720, 1080, 1440, 2048] };

const { ref, screens } = JSON.parse(readFileSync(CONFIG, 'utf8'));
const previous = existsSync(GENERATED) ? JSON.parse(readFileSync(GENERATED, 'utf8')) : {};
const generated = {};
mkdirSync(OUT, { recursive: true });

let built = 0;
for (const screen of screens) {
  const device = screen.device ?? 'phone';
  for (const theme of screen.themes) {
    const key = `${screen.id}-${theme}`;
    const golden = `${screen.golden}_${theme}_${device}.png`;
    const files = WIDTHS[device].flatMap((w) => [`${key}-${w}.avif`, `${key}-${w}.webp`]);
    const was = previous[key];
    if (
      was?.ref === ref &&
      was.golden === golden &&
      files.every((f) => existsSync(`${OUT}/${f}`))
    ) {
      generated[key] = was;
      continue;
    }
    const url = `https://raw.githubusercontent.com/MdRahmatUllah/DeutschPlan/${ref}/app/test/golden/goldens/${golden}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${golden}: HTTP ${res.status}`);
    const png = Buffer.from(await res.arrayBuffer());
    const { width, height } = await sharp(png).metadata();
    for (const w of WIDTHS[device]) {
      const resized = sharp(png).resize({ width: w });
      writeFileSync(
        `${OUT}/${key}-${w}.avif`,
        await resized.clone().avif({ quality: 55, effort: 6 }).toBuffer(),
      );
      writeFileSync(
        `${OUT}/${key}-${w}.webp`,
        await resized.clone().webp({ quality: 78 }).toBuffer(),
      );
    }
    const blur = await sharp(png).resize({ width: 16 }).webp({ quality: 40 }).toBuffer();
    generated[key] = {
      ref,
      golden,
      width,
      height,
      widths: WIDTHS[device],
      placeholder: `data:image/webp;base64,${blur.toString('base64')}`,
    };
    built++;
  }
}

// Outputs of screens no longer listed go.
const keep = new Set(
  Object.entries(generated).flatMap(([key, g]) =>
    g.widths.flatMap((w) => [`${key}-${w}.avif`, `${key}-${w}.webp`]),
  ),
);
for (const f of readdirSync(OUT)) if (!keep.has(f)) rmSync(`${OUT}/${f}`);

const sorted = Object.fromEntries(Object.entries(generated).sort(([a], [b]) => a.localeCompare(b)));
writeFileSync(GENERATED, `${JSON.stringify(sorted, null, 2)}\n`);
console.log(
  `screens: ${built} built, ${Object.keys(generated).length - built} unchanged, at ${ref.slice(0, 8)}`,
);
