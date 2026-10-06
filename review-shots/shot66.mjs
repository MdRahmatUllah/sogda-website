import { chromium } from '../sogda-website/node_modules/@playwright/test/index.mjs';
import { mkdirSync } from 'node:fs';
mkdirSync('66', { recursive: true });
const b = await chromium.launch();
for (const locale of ['pl', 'en', 'ru']) {
  const p = await b.newPage({ viewport: { width: 1280, height: 860 }, reducedMotion: 'reduce' });
  await p.goto(`http://localhost:4175/${locale}`);
  await p.waitForTimeout(800);
  await p.locator('#hero').screenshot({ path: `66/${locale}-hero.png` });
  await p.close();
}
await b.close();
