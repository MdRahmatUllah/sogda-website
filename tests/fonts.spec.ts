import { expect, test } from '@playwright/test';

// #116: Bangla's face isn't preloaded (#110 measured a preload costing ~0.5 s
// of LCP), so on a slow phone it arrives after the first paint, and it must
// not re-wrap the page when it does. Only that face is held back, 1.5 s.
test.use({ viewport: { width: 412, height: 915 } });

for (const path of ['/bn', '/bn/spaced-repetition', '/bn/about', '/bn/a1-1', '/bn/mock-exams']) {
  test(`${path}: a late Bangla font moves nothing (#116)`, async ({
    page,
    request,
    browserName,
  }) => {
    test.skip(browserName !== 'chromium', 'layout-shift entries are Chromium-only');
    // The Bengali face's file, from the page's inline @font-face rules.
    const html = await (await request.get(path)).text();
    const bengali = html.match(/font-family:bengali;src:url\(([^)]+\.woff2)\)/)?.[1];
    expect(bengali, 'the page declares the Bengali face').toBeTruthy();
    let held = 0;
    await page.route(`**${bengali}`, async (route) => {
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
    expect(held, 'the Bengali face was requested, and held back').toBeGreaterThan(0);
    // /bn's hero also re-wraps when Inter (not Bangla) arrives: #126, within the
    // 0.05 budget until it's fixed; every other page holds to 0.01.
    expect(await page.evaluate(() => (window as unknown as { cls: number }).cls)).toBeLessThan(
      path === '/bn' ? 0.05 : 0.01,
    );
  });
}
