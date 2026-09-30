// `pnpm og`: the Open Graph / Twitter image per locale (BRIEF §9), 1200 × 630:
// the mark, the kicker and the headline in the site's own fonts, and the
// real Today screen in a phone. Rendered with the e2e tests' Chromium and
// committed to public/og/, as the screenshots are (Vercel's build has no
// browser). Re-run when the headline, the brand or the screenshots change.
import { chromium } from '@playwright/test';
import { mkdirSync, readFileSync, readdirSync } from 'node:fs';

const b64 = (path) => readFileSync(path).toString('base64');
const inter = b64('app/fonts/inter-latin.woff2');
const bengali = b64('app/fonts/noto-sans-bengali.woff2');
const screen = b64('public/screens/today-light-720.webp');
const mark = readFileSync('public/brand/icon-road-full.svg', 'utf8').replace(
  'width="108" height="108"',
  'width="150" height="150"',
);

const html = (m) => `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Inter;src:url(data:font/woff2;base64,${inter}) format('woff2');font-weight:400 800}
@font-face{font-family:Bengali;src:url(data:font/woff2;base64,${bengali}) format('woff2');font-weight:400 700}
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;background:#00C2B2;color:#15121F;font-family:Inter,Bengali,sans-serif;overflow:hidden;position:relative}
.text{position:absolute;left:72px;top:72px;width:640px}
.mark svg{border-radius:26px;display:block}
.kicker{margin-top:36px;font-size:30px;font-weight:600}
h1{margin-top:12px;font-size:64px;line-height:1.05;font-weight:800;letter-spacing:-0.025em}
.url{position:absolute;left:72px;bottom:56px;font-size:26px;font-weight:700}
.phone{position:absolute;right:96px;top:64px;width:300px;padding:12px;background:#15121F;border-radius:44px;box-shadow:10px 10px 0 #FFC61A;transform:rotate(4deg)}
.phone img{display:block;width:100%;border-radius:34px}
</style></head><body>
<div class="text"><div class="mark">${mark}</div><p class="kicker">${m.hero.kicker}</p><h1>${m.hero.headline}</h1></div>
<p class="url">sogda.de</p>
<div class="phone"><img src="data:image/webp;base64,${screen}"></div>
</body></html>`;

mkdirSync('public/og', { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
for (const file of readdirSync('messages')) {
  const locale = file.replace(/\.json$/, '');
  await page.setContent(html(JSON.parse(readFileSync(`messages/${file}`, 'utf8'))));
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `public/og/${locale}.png` });
  console.log(`og: public/og/${locale}.png`);
}
await browser.close();
