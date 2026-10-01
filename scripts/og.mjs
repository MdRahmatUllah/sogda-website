// `pnpm og`: the Open Graph / Twitter image per locale (BRIEF §9), and per
// content page (#68), 1200 × 630:
// the mark, the kicker, the headline and a fact strip in the site's own
// fonts, and the app's Today screen in the locale's own language (#66, #67)
// in a phone. Rendered with the e2e tests' Chromium and committed to
// public/og/, as the screenshots are (Vercel's build has no browser). Re-run
// when the headline, the facts, the brand or the screenshots change.
//
// Each card's inputs (its text, its screen, this template and the files it
// embeds) are hashed into content/og.generated.json. `node scripts/og.mjs
// check` recomputes them without a browser and fails on any card drawn from
// older inputs (#131), which is how stale cards slipped in before (#130).
import { chromium } from '@playwright/test';
import { createTranslator } from 'next-intl';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';

const b64 = (path) => readFileSync(path).toString('base64');
const inter = b64('app/fonts/inter-latin.woff2');
const cyrillic = b64('app/fonts/inter-cyrillic.woff2');
const bengali = b64('app/fonts/noto-sans-bengali.woff2');
// Each locale's Today screen by its hashed name (#66): its own store capture
// where the app has one (pl, ru), else the default.
const screens = JSON.parse(readFileSync('content/screens.generated.json', 'utf8'));
const todayFor = (locale) => {
  const s = screens[`today-light@${locale}`] ?? screens['today-light'];
  return `public/screens/${s.base}-720.${s.hash}.webp`;
};
// The facts as ICU arguments, as i18n/facts.ts gives them to the pages (#61).
const facts = JSON.parse(readFileSync('content/facts.json', 'utf8'));
const factArgs = {
  words: facts.totals.words,
  topics: facts.totals.grammar_topics,
  steps: facts.totals.steps,
  mocks: facts.totals.mock_exams,
  mocksPerStep: facts.totals.mock_exams_per_step,
  android: facts.app.min_android,
};
const mark = readFileSync('public/brand/icon-road-full.svg', 'utf8').replace(
  'width="108" height="108"',
  'width="120" height="120"',
);
const escape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

const html = ({
  kicker,
  headline,
  strip,
  screen,
  lang,
}) => `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><style>
@font-face{font-family:Inter;src:url(data:font/woff2;base64,${inter}) format('woff2');font-weight:400 800}
@font-face{font-family:InterCyr;src:url(data:font/woff2;base64,${cyrillic}) format('woff2');font-weight:400 800;unicode-range:U+0400-045F}
@font-face{font-family:Bengali;src:url(data:font/woff2;base64,${bengali}) format('woff2');font-weight:400 700}
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;background:#00C2B2;color:#15121F;font-family:InterCyr,Inter,Bengali,sans-serif;overflow:hidden;position:relative}
.text{position:absolute;left:72px;top:56px;width:660px}
.mark svg{border-radius:22px;display:block}
.kicker{margin-top:26px;font-size:28px;font-weight:600}
h1{margin-top:10px;font-size:58px;line-height:1.06;font-weight:800;letter-spacing:-0.025em;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
.facts{margin-top:22px;display:flex;flex-wrap:wrap;gap:10px}
.facts span{background:#FFF8EE;border:2px solid #15121F;border-radius:999px;padding:6px 16px;font-size:22px;font-weight:700;box-shadow:3px 3px 0 #15121F}
.url{position:absolute;left:72px;bottom:40px;font-size:26px;font-weight:700}
.phone{position:absolute;right:96px;top:64px;width:300px;padding:12px;background:#15121F;border-radius:44px;box-shadow:10px 10px 0 #FFC61A;transform:rotate(4deg)}
.phone img{display:block;width:100%;border-radius:34px}
</style></head><body>
<div class="text"><div class="mark">${mark}</div><p class="kicker">${escape(kicker)}</p><h1>${escape(headline)}</h1>
<p class="facts">${strip.map((f) => `<span>${escape(f)}</span>`).join('')}</p></div>
<p class="url">sogda.de</p>
<div class="phone"><img src="data:image/webp;base64,${screen}"></div>
</body></html>`;

// Every card: where it goes and what it draws.
const cards = [];
for (const file of readdirSync('messages')) {
  const locale = file.replace(/\.json$/, '');
  const m = JSON.parse(readFileSync(`messages/${file}`, 'utf8'));
  const t = createTranslator({ locale, messages: m });
  // The hero's own fact chips (#62), already reviewed in every locale, with
  // the numbers from facts.json (#67): no new copy on the cards.
  const strip = [
    t('journey.facts.words', factArgs),
    t('hero.facts.steps', factArgs),
    t('hero.facts.offline', factArgs),
  ];
  const screen = todayFor(locale);
  const add = (kicker, headline, path, level = false) =>
    cards.push({ path, level, screen, inputs: { kicker, headline, strip, lang: locale, screen } });
  add(m.hero.kicker, m.hero.headline, `public/og/${locale}.png`);
  // Each content page kept in messages (`pages.<slug>`, #68) gets its own
  // card; lib/page.ts uses it when it's there, else the locale's.
  for (const [slug, p] of Object.entries(m.pages ?? {}))
    add(p.eyebrow ?? p.name, p.h1, `public/og/${locale}/${slug}.png`);
  // The level pages (#72): a card per step, from the `levelPages` messages and
  // content/facts.json. Their eyebrow and H1 take only simple arguments. The
  // slug is content/levels.ts's levelSlug (A1.1 → a1-1).
  if (m.levelPages) {
    const n = (x) => new Intl.NumberFormat(locale).format(x);
    for (const s of facts.steps) {
      const values = { step: s.code, level: s.level, ord: n(s.ord), steps: n(facts.totals.steps) };
      const fill = (text) => text.replace(/\{(\w+)(?:, number)?\}/g, (_, key) => values[key]);
      const slug = s.code.toLowerCase().replace('.', '-');
      add(
        fill(m.levelPages.eyebrow),
        fill(m.levelPages.h1),
        `public/og/${locale}/${slug}.png`,
        true,
      );
    }
  }
}

// A card's hash: its inputs, plus what every card shares (this template and
// the files it embeds), so a change to either marks the card stale.
const shared = createHash('sha256');
for (const f of [
  'scripts/og.mjs',
  'app/fonts/inter-latin.woff2',
  'app/fonts/inter-cyrillic.woff2',
  'app/fonts/noto-sans-bengali.woff2',
  'public/brand/icon-road-full.svg',
])
  shared.update(readFileSync(f));
const base = shared.digest('hex');
const hashOf = (c) =>
  createHash('sha256').update(base).update(JSON.stringify(c.inputs)).digest('hex').slice(0, 16);

const GENERATED = 'content/og.generated.json';
const recorded = existsSync(GENERATED) ? JSON.parse(readFileSync(GENERATED, 'utf8')) : {};
const mode = process.argv[2];

if (mode === 'check') {
  const stale = cards.filter((c) => recorded[c.path] !== hashOf(c) || !existsSync(c.path));
  if (stale.length) {
    console.error(
      `og: ${stale.length} card(s) drawn from older inputs; run \`pnpm og\`:\n` +
        stale.map((c) => `  ${c.path}`).join('\n'),
    );
    process.exit(1);
  }
  console.log(`og: all ${cards.length} cards match their inputs`);
} else {
  // `pnpm og levels` renders only the level pages' cards, so the others' PNGs
  // aren't rewritten byte for byte. A full run records only today's cards.
  const todo = mode === 'levels' ? cards.filter((c) => c.level) : cards;
  const next = mode === 'levels' ? { ...recorded } : {};
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  for (const c of todo) {
    mkdirSync(c.path.slice(0, c.path.lastIndexOf('/')), { recursive: true });
    await page.setContent(html({ ...c.inputs, screen: b64(c.screen) }));
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: c.path });
    next[c.path] = hashOf(c);
    console.log(`og: ${c.path}`);
  }
  await browser.close();
  const sorted = Object.fromEntries(Object.entries(next).sort(([a], [b]) => a.localeCompare(b)));
  writeFileSync(GENERATED, `${JSON.stringify(sorted, null, 2)}\n`);
}
