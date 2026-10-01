import { expect, test, type Page } from '@playwright/test';

/**
 * The page's cumulative layout shift while the given font files are held back
 * 1.5 s (a slow phone, where they arrive after the first paint), and how many
 * of them it requested.
 */
async function heldCls(page: Page, path: string, files: string[]) {
  let held = 0;
  for (const file of files)
    await page.route(`**${file}`, async (route) => {
      held += 1;
      await new Promise((r) => setTimeout(r, 1500));
      await route.continue();
    });
  await page.addInitScript(() => {
    const w = window as unknown as { cls: number };
    w.cls = 0;
    new PerformanceObserver((list) => {
      for (const e of list.getEntries() as unknown as {
        value: number;
        hadRecentInput: boolean;
      }[])
        if (!e.hadRecentInput) w.cls += e.value;
    }).observe({ type: 'layout-shift', buffered: true });
  });
  await page.goto(path);
  await page.waitForTimeout(3000);
  return { held, cls: await page.evaluate(() => (window as unknown as { cls: number }).cls) };
}

/** A face's file, from the page's inline @font-face rules. */
const faceFiles = (html: string, family: RegExp) =>
  [
    ...html.matchAll(
      new RegExp(`font-family:(?:${family.source});src:url\\(([^)]+\\.woff2)\\)`, 'g'),
    ),
  ].map((m) => m[1]!);

// #116: Bangla's face isn't preloaded (#110 measured a preload costing ~0.5 s
// of LCP), so on a slow phone it arrives after the first paint, and it must
// not re-wrap the page when it does. Only that face is held back.
for (const path of ['/bn', '/bn/spaced-repetition', '/bn/about', '/bn/a1-1', '/bn/mock-exams']) {
  test(`${path}: a late Bangla font moves nothing (#116)`, async ({
    page,
    request,
    browserName,
  }) => {
    test.skip(browserName !== 'chromium', 'layout-shift entries are Chromium-only');
    await page.setViewportSize({ width: 412, height: 915 });
    const files = faceFiles(await (await request.get(path)).text(), /bengali/);
    expect(files.length, 'the page declares the Bengali face').toBeGreaterThan(0);
    const { held, cls } = await heldCls(page, path, files);
    expect(held, 'the Bengali face was requested, and held back').toBeGreaterThan(0);
    expect(cls).toBeLessThan(0.01);
  });
}

// #126: Inter isn't preloaded either (~0.6 s of LCP), and a swap re-wrapped the
// hero when it arrived: /bn moved 0.10 at 360 px, /ru and /pl about 0.03. Each
// home at the common phone widths, with Inter (Latin and Cyrillic) held back.
for (const path of ['/en', '/de', '/pl', '/ru', '/bn']) {
  for (const width of [360, 384, 412]) {
    test(`${path} at ${width} px: a late Inter moves nothing (#126)`, async ({
      page,
      request,
      browserName,
    }) => {
      test.skip(browserName !== 'chromium', 'layout-shift entries are Chromium-only');
      await page.setViewportSize({ width, height: 900 });
      const files = faceFiles(await (await request.get(path)).text(), /inter|interCyrillic/);
      expect(files.length, 'the page declares Inter').toBeGreaterThan(0);
      const { held, cls } = await heldCls(page, path, files);
      expect(held, 'Inter was requested, and held back').toBeGreaterThan(0);
      expect(cls).toBeLessThan(0.01);
    });
  }
}
