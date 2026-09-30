import { expect, test } from '@playwright/test';
import { routing } from '../i18n/routing';

// #12: the checks behind the quality gate that the section tests don't make.
for (const locale of routing.locales) {
  test(`/${locale}: the keyboard reaches everything, with a visible focus`, async ({
    page,
    browserName,
  }) => {
    // WebKit on desktop tabs only to form controls unless the OS says
    // otherwise (Safari's own setting); its links are covered in Chromium and
    // Firefox.
    test.skip(browserName === 'webkit', 'Safari tabs to links only with its setting on');
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(`/${locale}`);
    await expect(page.locator('html')).toHaveAttribute('data-hydrated', '', { timeout: 15_000 });
    const seen = new Set<string>();
    for (let i = 0; i < 80; i++) {
      await page.keyboard.press('Tab');
      const focus = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement | null;
        if (!el || el === document.body) return null;
        const s = getComputedStyle(el);
        const r = el.getBoundingClientRect();
        return {
          id: `${el.tagName} ${el.getAttribute('href') ?? el.getAttribute('aria-label') ?? el.textContent?.trim().slice(0, 30)}`,
          ring: s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) >= 2,
          visible: r.width > 0 && r.height > 0,
          footer: !!el.closest('footer'),
        };
      });
      if (!focus) continue;
      expect(focus.visible, focus.id).toBe(true);
      expect(focus.ring, `${focus.id} has no visible focus ring`).toBe(true);
      seen.add(focus.id);
      if (focus.footer) break;
    }
    // The skip link, the header, the hero's pause button, the carousels, the
    // look switch, the FAQ and the footer: well over twenty stops.
    expect(seen.size).toBeGreaterThan(20);
  });

  test.describe(`/${locale} with JavaScript off`, () => {
    test.use({ javaScriptEnabled: false });
    test('every section reads, and the screens load', async ({ page }) => {
      await page.goto(`/${locale}`);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      const sections = page.locator('main > section');
      expect(await sections.count()).toBeGreaterThanOrEqual(9);
      for (const heading of await page.getByRole('heading', { level: 2 }).all()) {
        await heading.scrollIntoViewIfNeeded();
        await expect(heading).toBeVisible();
      }
      const hero = page.locator('#hero .hero-screen img').first();
      await expect
        .poll(() => hero.evaluate((i: HTMLImageElement) => i.naturalWidth))
        .toBeGreaterThan(0);
    });
  });
}

test.describe('/ with JavaScript off', () => {
  test.use({ javaScriptEnabled: false });
  test('lands on English', async ({ page }) => {
    await page.goto('/');
    // The meta refresh navigates after goto resolves; under a full parallel
    // run WebKit took over 5 s to commit it (#12).
    await expect(page).toHaveURL(/\/en$/, { timeout: 15_000 });
  });
});
