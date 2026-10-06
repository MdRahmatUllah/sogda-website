import { chromium } from '../sogda-website/node_modules/@playwright/test/index.mjs';
import { mkdirSync } from 'node:fs';
mkdirSync('68', { recursive: true });
const b = await chromium.launch();
for (const [locale, w] of [['en', 390], ['bn', 390], ['en', 1280]]) {
  const p = await b.newPage({ viewport: { width: w, height: 800 } });
  await p.goto(`http://localhost:4175/${locale}/template-sample`);
  await p.addStyleTag({ content: 'main>section,body>footer{content-visibility:visible!important}' });
  await p.locator('details').first().evaluate((d) => (d.open = true));
  await p.waitForTimeout(600);
  await p.screenshot({ path: `68/${locale}-${w}.png`, fullPage: true });
  console.log(locale, w, await p.evaluate(() => document.body.scrollHeight));
  await p.close();
}
await b.close();
