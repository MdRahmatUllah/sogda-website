// Smoothness of scroll-linked motion (issue #5's "no dropped frames"):
//   node scripts/frames.mjs <path> <selector> [cpuSlowdown=4] [width=1440] [height=900]
// Scrolls [selector] through the viewport on the static build (:4173), with
// the CPU throttled as DevTools does, and reports frame times from rAF.
import { chromium } from '@playwright/test';

const [path = '/en', selector = '#day', slow = '4', width = '1440', height = '900'] =
  process.argv.slice(2);
const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: Number(width), height: Number(height) },
  reducedMotion: 'no-preference',
});
await page.goto(`http://localhost:${process.env.PW_PORT ?? 4173}${path}`, {
  waitUntil: 'networkidle',
});
await page.locator('html[data-hydrated]').waitFor({ state: 'attached' });
const cdp = await page.context().newCDPSession(page);
await cdp.send('Emulation.setCPUThrottlingRate', { rate: Number(slow) });
const top = await page.locator(selector).evaluate((e) => e.getBoundingClientRect().top + scrollY);
const bottom = await page
  .locator(selector)
  .evaluate((e) => e.getBoundingClientRect().bottom + scrollY);
await page.evaluate((y) => scrollTo(0, y), top - 100);
await page.evaluate(() => {
  window.__frames = [];
  let last = performance.now();
  const tick = (now) => {
    window.__frames.push(now - last);
    last = now;
    if (window.__frames.length < 100000) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
});
for (let y = top; y < bottom; y += 40) {
  await page.mouse.wheel(0, 40);
  await page.waitForTimeout(16);
}
await page.waitForTimeout(500);
const frames = (await page.evaluate(() => window.__frames)).slice(1);
frames.sort((a, b) => a - b);
const pct = (p) => frames[Math.floor((frames.length - 1) * p)].toFixed(1);
const long = frames.filter((f) => f > 50).length;
console.log(
  `frames ${frames.length}: median ${pct(0.5)} ms, p95 ${pct(0.95)} ms, max ${pct(1)} ms, over 50 ms: ${long}`,
);
await browser.close();
