// Screenshots of the live site for an audit: node live.mjs <dir> <width>x<height> <path> [<path> …]
// Full page, reduced motion (the still states), light theme unless ?dark in the path.
import { chromium } from '../sogda-website/node_modules/@playwright/test/index.mjs';
import { mkdirSync } from 'node:fs';

const [dir, size, ...paths] = process.argv.slice(2);
const [width, height] = size.split('x').map(Number);
mkdirSync(dir, { recursive: true });
const browser = await chromium.launch();
for (const raw of paths) {
  const dark = raw.endsWith('?dark');
  const path = raw.replace('?dark', '');
  const page = await browser.newPage({
    viewport: { width, height },
    deviceScaleFactor: 1,
    colorScheme: dark ? 'dark' : 'light',
    reducedMotion: 'reduce',
  });
  await page.goto(`https://www.sogda.de/${path}`, { waitUntil: 'networkidle' });
  // content-visibility skips off-screen sections, even in a full-page capture.
  await page.addStyleTag({ content: 'main>section,body>footer{content-visibility:visible!important}' });
  // Bring every lazy section and image in, then back to the top.
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += innerHeight / 2) {
      scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    scrollTo(0, 0);
  });
  await page.waitForTimeout(800);
  const name = `${dir}/${width}-${path.replace(/\//g, '_') || 'root'}${dark ? '-dark' : ''}.png`;
  await page.screenshot({ path: name, fullPage: true });
  console.log(name, await page.evaluate(() => document.body.scrollHeight));
  await page.close();
}
await browser.close();
