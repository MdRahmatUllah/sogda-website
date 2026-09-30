import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { gotoReady } from './ready';

test.describe('header and footer', () => {
  test('the theme toggle switches to dark, and the pick survives a reload', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await gotoReady(page, '/en');
    const toggle = page.getByRole('button', { name: 'Dark theme' });
    await expect(toggle).toHaveAttribute('aria-pressed', 'false');
    await toggle.click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-hydrated', '');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');
    // The wordmark is live text in the theme's ink.
    const logo = page.getByRole('link', { name: 'Sogda, home' });
    await expect(logo).toHaveCSS('color', 'rgb(244, 241, 255)');
  });

  test('the system dark scheme applies without a pick', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/en');
    const bg = await page.evaluate(
      () => getComputedStyle(document.documentElement).backgroundColor,
    );
    expect(bg).toBe('rgb(19, 17, 29)');
  });

  test('on a phone, the menu opens, and choosing a link closes it', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoReady(page, '/en');
    const menu = page.locator('#menu');
    await expect(menu).toBeHidden();
    await page.getByRole('button', { name: 'Menu' }).click();
    await expect(menu).toBeVisible();
    await menu.getByRole('link', { name: 'Features' }).click();
    await expect(menu).toBeHidden();
    await page.getByRole('button', { name: 'Menu' }).click();
    await page.keyboard.press('Escape');
    await expect(menu).toBeHidden();
  });

  test('wide screens show the section links and Get the app in the bar', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/en');
    const header = page.locator('header');
    await expect(header.getByRole('link', { name: 'How it works' })).toBeVisible();
    await expect(header.getByRole('link', { name: 'Get the app' }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Menu' })).toBeHidden();
  });

  test('the footer has the legal links, 24 px targets, and the trademark line only with the badge', async ({
    page,
  }) => {
    await page.goto('/en');
    const footer = page.locator('footer');
    await expect(footer.getByRole('link', { name: 'Impressum' })).toHaveAttribute(
      'href',
      '/en/impressum',
    );
    await expect(footer.getByRole('link', { name: /Datenschutz/ })).toHaveAttribute(
      'href',
      '/en/datenschutz',
    );
    // WCAG 2.2's target size, 2.5.8 (#58): they were 17 px tall.
    const heights = await footer
      .getByRole('link')
      .evaluateAll((links) => links.map((a) => a.getBoundingClientRect().height));
    for (const height of heights) expect(height).toBeGreaterThanOrEqual(24);
    // Google's trademark line goes with its badge: here while a Play link is
    // on the page, gone while it isn't.
    const line = 'Google Play and the Google Play logo are trademarks of Google LLC.';
    if (await page.locator('a[href*="play.google.com"]').count()) {
      await expect(footer).toContainText(line);
    } else {
      await expect(footer).not.toContainText(line);
    }
  });

  test('the icons and the manifest are linked and served', async ({ page, request }) => {
    await page.goto('/en');
    for (const sel of [
      'link[rel="icon"][type="image/svg+xml"]',
      'link[rel="apple-touch-icon"]',
      'link[rel="manifest"]',
    ]) {
      const href = await page.locator(sel).first().getAttribute('href');
      expect(href, sel).toBeTruthy();
      expect((await request.get(href!)).ok(), href!).toBe(true);
    }
    // /favicon.ico for the crawlers and tools that ask for it unlinked (#58):
    // an ICO header (reserved 0, type 1) with 3 images.
    const ico = await (await request.get('/favicon.ico')).body();
    expect([ico.readUInt16LE(0), ico.readUInt16LE(2), ico.readUInt16LE(4)]).toEqual([0, 1, 3]);
  });
});

// The gallery is only in a SOGDA_GALLERY=1 build (next.config.ts).
test.describe('component gallery', () => {
  test.skip(!process.env.SOGDA_GALLERY, 'build with SOGDA_GALLERY=1');

  test('shows both store states and is axe-clean, light and dark', async ({ page }) => {
    for (const colorScheme of ['light', 'dark'] as const) {
      await page.emulateMedia({ colorScheme });
      await page.goto('/en/gallery');
      await expect(page.getByText('Coming soon to Google Play')).toBeVisible();
      await expect(page.getByRole('img', { name: 'Get it on Google Play' })).toBeVisible();
      await expect(page.getByText('Coming soon on iPhone').first()).toBeVisible();
      const { violations } = await new AxeBuilder({ page }).analyze();
      expect(violations.map((v) => `${colorScheme} ${v.id}: ${v.help}`)).toEqual([]);
    }
  });
});
