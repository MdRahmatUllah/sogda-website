// #12: the live site in Android Chrome (emulator-5558, over adb's DevTools
// forward on :9333): paint timings per locale, then the behaviours by touch.
import { chromium } from '../sogda-website/node_modules/@playwright/test/index.mjs';
import { mkdirSync } from 'node:fs';

const dir = process.argv[2] ?? 'android';
mkdirSync(dir, { recursive: true });
const browser = await chromium.connectOverCDP('http://localhost:9333');
const context = browser.contexts()[0];
const page =
  context.pages().find((p) => p.url().includes('sogda.de')) ?? (await context.newPage());
await page.bringToFront();
const errors = [];
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
page.on('pageerror', (e) => errors.push(String(e)));
const cdp = await context.newCDPSession(page);
await cdp.send('Network.enable');
await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });

const vitals = () =>
  page.evaluate(
    () =>
      new Promise((resolve) => {
        const out = {};
        new PerformanceObserver((l) => {
          for (const e of l.getEntries()) out.lcp = Math.round(e.startTime);
        }).observe({ type: 'largest-contentful-paint', buffered: true });
        const fcp = performance.getEntriesByName('first-contentful-paint')[0];
        out.fcp = fcp && Math.round(fcp.startTime);
        const nav = performance.getEntriesByType('navigation')[0];
        out.load = Math.round(nav.loadEventEnd);
        out.html = nav.transferSize;
        out.scripts = [...document.scripts].map((s) => s.src || 'inline').length;
        out.hydrated = document.documentElement.hasAttribute('data-hydrated');
        setTimeout(() => resolve(out), 300);
      }),
  );

for (const locale of ['bn', 'en', 'de', 'pl', 'ru']) {
  await page.goto(`https://www.sogda.de/${locale}`, { waitUntil: 'load' });
  await page.waitForTimeout(1500);
  console.log(locale, JSON.stringify(await vitals()));
}

// Behaviours, by touch, on /bn.
await page.goto('https://www.sogda.de/bn', { waitUntil: 'load' });
await page.locator('html[data-hydrated]').waitFor({ state: 'attached' });
const check = (name, ok) => console.log(`${ok ? 'ok  ' : 'FAIL'}  ${name}`);
await page.locator('button[popovertarget="menu"]').first().click();
check('menu opens', await page.locator('#menu').evaluate((m) => m.matches(':popover-open')));
await page.screenshot({ path: `${dir}/menu.png` });
await page.locator('#menu nav a').first().click();
await page.waitForTimeout(800);
check('a menu link closes it', !(await page.locator('#menu').evaluate((m) => m.matches(':popover-open'))));
const toggle = page.locator('[data-theme-toggle]');
await page.evaluate(() => scrollTo(0, 0));
await toggle.click();
check('theme toggles to dark', (await page.locator('html').getAttribute('data-theme')) === 'dark');
check('its aria-pressed follows', (await toggle.getAttribute('aria-pressed')) === 'true');
await page.screenshot({ path: `${dir}/dark.png` });
await toggle.click();
check('and back to light', (await page.locator('html').getAttribute('data-theme')) === 'light');
await page.evaluate(() => localStorage.removeItem('theme'));
const pause = page.locator('[data-hero-pause]');
await pause.click();
check('the hero pauses', await page.locator('#hero').evaluate((h) => h.hasAttribute('data-paused')));
await pause.click();
const dots = page.locator('#screens [data-dot]');
await page.locator('#screens').scrollIntoViewIfNeeded();
await dots.nth(2).click();
await page.waitForTimeout(1200);
check('a gallery dot moves the carousel', (await dots.nth(2).getAttribute('aria-current')) === 'true');
await page.screenshot({ path: `${dir}/gallery.png` });
check('no console errors', errors.length === 0);
if (errors.length) console.log(errors.join('\n'));
await cdp.send('Network.setCacheDisabled', { cacheDisabled: false });
await browser.close();
