import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { routing } from '../i18n/routing';

const WIDTHS = [320, 360, 390, 414, 768, 1024, 1280, 1440, 1920];

for (const locale of routing.locales) {
  test.describe(`/${locale}`, () => {
    test('renders, with no console errors (a CSP block is one)', async ({ page }) => {
      const errors: string[] = [];
      page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
      page.on('pageerror', (e) => errors.push(e.message));
      await page.goto(`/${locale}`);
      await expect(page.locator('html')).toHaveAttribute('lang', locale);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await page.waitForLoadState('networkidle');
      expect(errors).toEqual([]);
    });

    for (const colorScheme of ['light', 'dark'] as const) {
      test(`axe finds no violations (${colorScheme})`, async ({ page }) => {
        // axe walks the whole long page; Firefox needs more than 30 s for it
        // while the other workers run.
        test.setTimeout(90_000);
        await page.emulateMedia({ colorScheme });
        await page.goto(`/${locale}`);
        const { violations } = await new AxeBuilder({ page }).analyze();
        expect(violations.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
      });
    }

    for (const width of WIDTHS) {
      test(`no horizontal scroll at ${width} px`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(`/${locale}`);
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        );
        expect(overflow).toBe(0);
      });
    }
  });
}

test('/ goes to a locale', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(new RegExp(`/(${routing.locales.join('|')})$`));
});
