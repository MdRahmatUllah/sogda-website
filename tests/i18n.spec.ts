import { expect, test } from '@playwright/test';
import { routing } from '../i18n/routing';
import { gotoReady } from './ready';

// BRIEF §7: the site's languages are the app's (en, bn today); `/` goes to
// the visitor's language, English by default; the choice is remembered.
test.describe('/ picks the language', () => {
  for (const [browser, expected] of [
    ['bn-BD', 'bn'],
    ['de-DE', 'de'],
    ['fr-FR', 'en'],
    ['en-US', 'en'],
  ] as const) {
    test.describe(`a ${browser} browser`, () => {
      test.use({ locale: browser });
      test(`goes to /${expected}`, async ({ page }) => {
        await page.goto('/');
        await expect(page).toHaveURL(new RegExp(`/${expected}$`));
        await expect(page.locator('html')).toHaveAttribute('lang', expected);
      });
    });
  }

  test.describe('a remembered choice', () => {
    test.use({ locale: 'en-US' });
    test('wins over the browser', async ({ page }) => {
      await page.goto('/en');
      await page.evaluate(() => localStorage.setItem('locale', 'bn'));
      await page.goto('/');
      await expect(page).toHaveURL(/\/bn$/);
    });
  });
});

test('the header switch changes the language and remembers it', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await gotoReady(page, '/en');
  const bar = page.locator('header > div').first();
  await bar.getByRole('button', { name: 'Language: English' }).click();
  const menu = page.locator('#language-menu');
  await expect(menu).toBeVisible();
  await expect(menu.getByRole('link')).toHaveText(['English', 'Deutsch', 'বাংলা']);
  await expect(menu.getByRole('link', { name: 'English' })).toHaveAttribute('aria-current', 'true');
  await menu.getByRole('link', { name: 'বাংলা' }).click();
  await expect(page).toHaveURL(/\/bn$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'bn');
  expect(await page.evaluate(() => localStorage.getItem('locale'))).toBe('bn');
  await expect(
    page.locator('header > div').first().getByRole('button', { name: /বাংলা/ }),
  ).toBeVisible();
});

test('the switch keeps the page: from an Impressum to the same Impressum', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await gotoReady(page, '/en/impressum');
  await page
    .locator('header > div')
    .first()
    .getByRole('button', { name: /Language/ })
    .click();
  await page.locator('#language-menu').getByRole('link', { name: 'Deutsch' }).click();
  await expect(page).toHaveURL(/\/de\/impressum$/);
});

test('on a phone the languages are in the menu', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await gotoReady(page, '/en');
  const bar = page.locator('header > div').first();
  await expect(bar.getByRole('button', { name: /Language/ })).toBeHidden();
  await page.getByRole('button', { name: 'Menu' }).click();
  await expect(page.locator('#menu').getByRole('navigation', { name: 'Language' })).toBeVisible();
  await expect(page.locator('#menu').getByRole('link', { name: 'Deutsch' })).toBeVisible();
});

test('a page loads only the fonts its own text needs', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  const fonts: string[] = [];
  page.on('request', (r) => r.resourceType() === 'font' && fonts.push(r.url()));
  await page.goto('/en');
  await page.waitForLoadState('networkidle');
  // Inter only: the Bangla (and any other script's) font waits until a page,
  // or an opened language menu, shows that script.
  expect(fonts).toHaveLength(1);
});

test('every page names its other languages (hreflang, x-default → /en)', async ({ page }) => {
  for (const locale of routing.locales) {
    await page.goto(`/${locale}`);
    for (const lang of routing.locales) {
      await expect(page.locator(`link[rel="alternate"][hreflang="${lang}"]`)).toHaveAttribute(
        'href',
        new RegExp(`/${lang}$`),
      );
    }
    await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute(
      'href',
      /\/en$/,
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      new RegExp(`/${locale}$`),
    );
  }
});

test('the Bangla page: Bangla copy, Bangla digits, Bangla alt text', async ({ page }) => {
  await page.goto('/bn');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'জার্মান শিখুন, প্রতিদিন একটু একটু করে।',
  );
  await expect(page.locator('#journey').getByText('৫,০৬৯টি শব্দ')).toBeVisible();
  await expect(page.locator('#hero .hero-screen img').first()).toHaveAttribute('alt', /আজকের পাতা/);
  await expect(page.locator('#day [data-beat="0"] span').first()).toHaveText('১');
  await expect(page.getByText('শিগগিরই Google Play-তে আসছে').first()).toBeVisible();
});
