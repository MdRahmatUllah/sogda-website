// A PR's motion GIF (CLAUDE.md, "Every PR shows itself"), from the static
// build served on :4173:
//   node scripts/record.mjs <out.gif> <path> [seconds=6] [width=1280] [height=800] [scroll]
// Records with motion on, then converts with ffmpeg (on PATH). `scroll`
// scrolls down the page while recording, for scroll-linked motion.
import { chromium } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const [out, path = '/en', seconds = '6', width = '1280', height = '800', mode] =
  process.argv.slice(2);
if (!out)
  throw new Error(
    'usage: node scripts/record.mjs <out.gif> <path> [seconds] [width] [height] [scroll]',
  );
const dir = mkdtempSync(join(tmpdir(), 'rec-'));
const size = { width: Number(width), height: Number(height) };
const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: size,
  reducedMotion: 'no-preference',
  recordVideo: { dir, size },
});
const page = await context.newPage();
await page.goto(`http://localhost:4173${path}`);
if (mode === 'scroll') {
  const steps = Number(seconds) * 10;
  for (let i = 0; i < steps; i++) {
    await page.mouse.wheel(0, 60);
    await page.waitForTimeout(100);
  }
} else {
  await page.waitForTimeout(Number(seconds) * 1000);
}
await context.close();
await browser.close();
const video = join(
  dir,
  readdirSync(dir).find((f) => f.endsWith('.webm')),
);
execFileSync('ffmpeg', [
  '-y',
  '-loglevel',
  'error',
  '-i',
  video,
  '-vf',
  `fps=12,scale=${Math.min(Number(width), 720)}:-1:flags=lanczos,split[a][b];[a]palettegen[p];[b][p]paletteuse`,
  out,
]);
console.log(`record: ${out}`);
