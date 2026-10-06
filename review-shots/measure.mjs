// Widths inside a section at a viewport: node measure.mjs <base> <path> <selector> <width>
import { chromium } from '../sogda-website/node_modules/@playwright/test/index.mjs';

const [base, path, selector, width] = process.argv.slice(2);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: Number(width), height: 700 } });
await page.goto(`${base}/${path}`);
await page.locator(selector).scrollIntoViewIfNeeded();
const rows = await page.locator(selector).evaluate((root) =>
  [root, ...root.querySelectorAll('*')]
    .map((e) => {
      const r = e.getBoundingClientRect();
      return {
        tag: e.tagName.toLowerCase(),
        cls: (e.getAttribute('class') ?? '').slice(0, 60),
        left: Math.round(r.left),
        right: Math.round(r.right),
        width: Math.round(r.width),
        scroll: e.scrollWidth,
        text: (e.childNodes[0]?.nodeType === 3 ? e.textContent : '').trim().slice(0, 30),
      };
    })
    .filter((r) => r.right > Number(innerWidth) - 16 || r.scroll > r.width + 1),
);
for (const r of rows) console.log(JSON.stringify(r));
await browser.close();
