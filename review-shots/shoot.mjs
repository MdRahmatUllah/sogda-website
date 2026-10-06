// Screenshots for a PR: node shoot.mjs <dir> <path>#<selector> ... (the site on :4173).
import { chromium } from '../sogda-website/node_modules/@playwright/test/index.mjs';
import { mkdirSync } from 'node:fs';

const [dir, ...shots] = process.argv.slice(2);
mkdirSync(dir, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.emulateMedia({ reducedMotion: 'reduce' });
for (const shot of shots) {
  const [path, selector] = shot.split('|');
  await page.goto(`http://localhost:4173/${path}`);
  const el = page.locator(selector).first();
  await el.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  const name = `${dir}/${path.replace(/\//g, '')}-${selector.replace(/[^a-z]/gi, '')}.png`;
  await el.screenshot({ path: name });
  console.log(name);
}
await browser.close();
