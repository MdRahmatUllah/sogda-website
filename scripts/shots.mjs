// PR screenshots (CLAUDE.md, "Every PR shows itself"), from the static build:
//   node scripts/shots.mjs <outDir> [path ...]      (default path: /en)
// Writes <name>-<width>-<scheme>.png at 390, 768 and 1440 px, light and dark,
// full page. Serve out/ first (`pnpm start`).
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const [outDir = 'shots', ...paths] = process.argv.slice(2);
mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch();
for (const path of paths.length ? paths : ['/en']) {
  for (const colorScheme of ['light', 'dark']) {
    for (const width of [390, 768, 1440]) {
      const page = await browser.newPage({
        viewport: { width, height: 900 },
        colorScheme,
        reducedMotion: 'reduce',
      });
      await page.goto(`http://localhost:${process.env.PW_PORT ?? 4173}${path}`, {
        waitUntil: 'networkidle',
      });
      const name = path.replace(/^\/|\/$/g, '').replaceAll('/', '_') || 'root';
      await page.screenshot({
        path: `${outDir}/${name}-${width}-${colorScheme}.png`,
        fullPage: true,
      });
      await page.close();
    }
  }
}
await browser.close();
