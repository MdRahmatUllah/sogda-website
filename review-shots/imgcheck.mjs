// Which images on a live page never load: node imgcheck.mjs <path> <width>x<height> [reduce|no-preference]
import { chromium } from '../sogda-website/node_modules/@playwright/test/index.mjs';

const [path, size, motion = 'reduce'] = process.argv.slice(2);
const [width, height] = size.split('x').map(Number);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width, height }, reducedMotion: motion });
await page.goto(`https://www.sogda.de/${path}`, { waitUntil: 'networkidle' });
// Scroll slowly through the whole page, pausing so lazy images can load.
const total = await page.evaluate(() => document.body.scrollHeight);
for (let y = 0; y < total; y += height / 2) {
  await page.evaluate((y) => scrollTo(0, y), y);
  await page.waitForTimeout(400);
}
await page.waitForTimeout(2000);
const report = await page.evaluate(() =>
  [...document.images].map((img) => {
    const hidden = !img.offsetParent && getComputedStyle(img).position !== 'fixed';
    const sec = img.closest('section')?.id ?? '-';
    return {
      sec,
      file: (img.currentSrc || img.src).split('/').pop(),
      loaded: img.complete && img.naturalWidth > 0,
      hidden,
      alt: img.alt.slice(0, 40),
    };
  }),
);
const notLoaded = report.filter((r) => !r.loaded && !r.hidden);
console.log(`images ${report.length}, visible but not loaded ${notLoaded.length}`);
for (const r of notLoaded) console.log('  NOT LOADED', r.sec, r.file, '|', r.alt);
const hiddenLoaded = report.filter((r) => r.loaded && r.hidden);
console.log(`hidden but downloaded: ${hiddenLoaded.length}`);
for (const r of hiddenLoaded) console.log('  hidden+loaded', r.sec, r.file);
await browser.close();
