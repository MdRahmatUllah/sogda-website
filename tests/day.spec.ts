import { expect, test } from '@playwright/test';
import { gotoReady } from './ready';

const TITLES = [
  "Today's plan is ready",
  "Revise what's due",
  'Learn a few new words',
  'The grammar topic of the week',
  'Sentences from words you know',
  'Day complete 🎉',
];

test.describe('A day with Sogda (BRIEF §3.2)', () => {
  test('the beats, in order, under their heading', async ({ page }) => {
    await page.goto('/en');
    const day = page.locator('#day');
    await expect(day.getByRole('heading', { level: 2 })).toHaveText(
      "Open the app, see today's plan, do it, done.",
    );
    await expect(day.getByRole('heading', { level: 3 })).toHaveText(TITLES);
  });

  test.describe('wide, with motion', () => {
    test.use({ reducedMotion: 'no-preference', viewport: { width: 1440, height: 900 } });

    test('the sticky phone shows the beat in view, and the ring fills', async ({ page }) => {
      await gotoReady(page, '/en');
      const stage = page.locator('#day [data-active]');
      const screens = page.locator('#day .day-screen');
      await expect(screens).toHaveCount(6);
      for (const i of [3, 5, 1]) {
        await page
          .locator(`[data-beat="${i}"]`)
          .evaluate((e) => e.scrollIntoView({ block: 'center' }));
        await expect(stage).toHaveAttribute('data-active', String(i));
        await expect
          .poll(() => screens.nth(i).evaluate((e) => getComputedStyle(e).opacity))
          .toBe('1');
        await expect
          .poll(() => screens.nth((i + 1) % 6).evaluate((e) => getComputedStyle(e).opacity))
          .toBe('0');
      }
      const offset = () =>
        page.locator('.day-ring-fill').evaluate((e) => getComputedStyle(e).strokeDashoffset);
      await page.locator('[data-beat="5"]').evaluate((e) => e.scrollIntoView({ block: 'center' }));
      await expect.poll(offset).toMatch(/^0(px|%)?$/);
    });
  });

  test('on a phone, each beat carries its own phone', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/en');
    await expect(page.locator('#day .day-screen').first()).toBeHidden();
    for (let i = 0; i < 6; i++) {
      await expect(page.locator(`[data-beat="${i}"] img`).first()).toBeAttached();
    }
    await page.locator('[data-beat="2"]').scrollIntoViewIfNeeded();
    await expect(page.locator('[data-beat="2"] img').first()).toBeVisible();
  });

  test('reduced motion, wide: a still grid of the six screens', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/en');
    await expect(page.locator('#day .day-screen').first()).toBeHidden();
    const cols = await page
      .locator('#day ol')
      .evaluate((e) => getComputedStyle(e).gridTemplateColumns.split(' ').length);
    expect(cols).toBe(3);
    await page.locator('[data-beat="4"]').scrollIntoViewIfNeeded();
    await expect(page.locator('[data-beat="4"] img').first()).toBeVisible();
  });
});
