// `pnpm og`: the Open Graph / Twitter image per locale (BRIEF §9), and per
// content page (#68), 1200 × 630:
// the mark, the kicker and the headline in the site's own fonts, and the
// real Today screen in a phone. Rendered with the e2e tests' Chromium and
// committed to public/og/, as the screenshots are (Vercel's build has no
// browser). Re-run when the headline, the brand or the screenshots change.
import { chromium } from '@playwright/test';
import { mkdirSync, readFileSync, readdirSync } from 'node:fs';

const facts = JSON.parse(readFileSync('content/facts.json', 'utf8'));
const b64 = (path) => readFileSync(path).toString('base64');
const inter = b64('app/fonts/inter-latin.woff2');
const cyrillic = b64('app/fonts/inter-cyrillic.woff2');
const bengali = b64('app/fonts/noto-sans-bengali.woff2');
// The Today screen by its hashed name (#66); per-locale cards are #67.
const today = JSON.parse(readFileSync('content/screens.generated.json', 'utf8'))['today-light'];
const screen = b64(`public/screens/${today.base}-720.${today.hash}.webp`);
const mark = readFileSync('public/brand/icon-road-full.svg', 'utf8').replace(
  'width="108" height="108"',
  'width="120" height="120"',
);

const html = (kicker, headline) => `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Inter;src:url(data:font/woff2;base64,${inter}) format('woff2');font-weight:400 800}
@font-face{font-family:InterCyr;src:url(data:font/woff2;base64,${cyrillic}) format('woff2');font-weight:400 800;unicode-range:U+0400-045F}
@font-face{font-family:Bengali;src:url(data:font/woff2;base64,${bengali}) format('woff2');font-weight:400 700}
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;background:#00C2B2;color:#15121F;font-family:InterCyr,Inter,Bengali,sans-serif;overflow:hidden;position:relative}
.text{position:absolute;left:72px;top:72px;width:640px}
.mark svg{border-radius:26px;display:block}
.kicker{margin-top:24px;font-size:30px;font-weight:600}
h1{margin-top:12px;font-size:64px;line-height:1.05;font-weight:800;letter-spacing:-0.025em;display:-webkit-box;-webkit-line-clamp:4;-webkit-box-orient:vertical;overflow:hidden}
.url{position:absolute;left:72px;bottom:56px;font-size:26px;font-weight:700}
.phone{position:absolute;right:96px;top:64px;width:300px;padding:12px;background:#15121F;border-radius:44px;box-shadow:10px 10px 0 #FFC61A;transform:rotate(4deg)}
.phone img{display:block;width:100%;border-radius:34px}
</style></head><body>
<div class="text"><div class="mark">${mark}</div><p class="kicker">${kicker}</p><h1>${headline}</h1></div>
<p class="url">sogda.de</p>
<div class="phone"><img src="data:image/webp;base64,${screen}"></div>
</body></html>`;

mkdirSync('public/og', { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
const card = async (kicker, headline, path) => {
  await page.setContent(html(kicker, headline));
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path });
  console.log(`og: ${path}`);
};
// `pnpm og levels` renders only the level pages' cards, so the others' PNGs
// aren't rewritten byte for byte.
const onlyLevels = process.argv[2] === 'levels';
for (const file of readdirSync('messages')) {
  const locale = file.replace(/\.json$/, '');
  const m = JSON.parse(readFileSync(`messages/${file}`, 'utf8'));
  if (!onlyLevels) {
    await card(m.hero.kicker, m.hero.headline, `public/og/${locale}.png`);
    // Each content page kept in messages (`pages.<slug>`, #68) gets its own
    // card; lib/page.ts uses it when it's there, else the locale's.
    for (const [slug, p] of Object.entries(m.pages ?? {})) {
      mkdirSync(`public/og/${locale}`, { recursive: true });
      await card(p.eyebrow ?? p.name, p.h1, `public/og/${locale}/${slug}.png`);
    }
  }
  // The level pages (#72): a card per step, from the `levelPages` messages and
  // content/facts.json. Their eyebrow and H1 take only simple arguments. The
  // slug is content/levels.ts's levelSlug (A1.1 → a1-1).
  if (m.levelPages) {
    const n = (x) => new Intl.NumberFormat(locale).format(x);
    for (const s of facts.steps) {
      const values = { step: s.code, level: s.level, ord: n(s.ord), steps: n(facts.totals.steps) };
      const fill = (text) => text.replace(/\{(\w+)(?:, number)?\}/g, (_, key) => values[key]);
      const slug = s.code.toLowerCase().replace('.', '-');
      mkdirSync(`public/og/${locale}`, { recursive: true });
      await card(
        fill(m.levelPages.eyebrow),
        fill(m.levelPages.h1),
        `public/og/${locale}/${slug}.png`,
      );
    }
  }
}
await browser.close();
