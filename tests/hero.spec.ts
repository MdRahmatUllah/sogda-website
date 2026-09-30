import { expect, test } from '@playwright/test';
import { gotoReady } from './ready';

test.describe('hero (BRIEF §3.1)', () => {
  test('the message and the store CTA, before the Play link exists', async ({ page }) => {
    await page.goto('/en');
    const hero = page.locator('#hero');
    await expect(
      hero.getByText('Offline German course app · A1–\u2060C2 · 36 mock exams'),
    ).toBeVisible();
    await expect(hero.getByRole('heading', { level: 1 })).toHaveText(
      'Learn German, one clear day at a time.',
    );
    await expect(hero.getByText('A complete, offline German course from A1 to C2')).toBeVisible();
    await expect(hero.getByText('Coming soon to Google Play')).toBeVisible();
    await expect(hero.getByText('Coming soon on iPhone')).toBeVisible();
    // No Play URL yet: no badge, no QR code.
    await expect(hero.getByRole('img', { name: 'Get it on Google Play' })).toHaveCount(0);
    await expect(hero.getByRole('img', { name: /QR code/ })).toHaveCount(0);
  });

  test("Today is the phone's first screen and loads first; the loop's others wait", async ({
    page,
  }) => {
    await page.goto('/en');
    const screens = page.locator('#hero .hero-screen img');
    await expect(screens).toHaveCount(4);
    await expect(screens.nth(0)).toHaveAttribute('fetchpriority', 'high');
    await expect(screens.nth(0)).toHaveAttribute('loading', 'eager');
    await expect(screens.nth(0)).toHaveAttribute('alt', /Today screen/);
    for (const i of [1, 2, 3]) await expect(screens.nth(i)).toHaveAttribute('loading', 'lazy');
  });

  test('reduced motion: one still screen, Ä on the tile, no pause button', async ({ page }) => {
    await page.goto('/en');
    await expect(page.locator('#hero .hero-screen').nth(0)).toBeVisible();
    for (const i of [1, 2, 3]) await expect(page.locator('#hero .hero-screen').nth(i)).toBeHidden();
    await expect(page.locator('.mark-flip-from')).toBeHidden();
    await expect(page.getByRole('button', { name: 'Pause the animation' })).toBeHidden();
  });

  test('the skip link is the first stop and goes to the content', async ({ page }) => {
    await page.goto('/en');
    await page.keyboard.press('Tab');
    const skip = page.getByRole('link', { name: 'Skip to content' });
    await expect(skip).toBeFocused();
    await expect(skip).toBeVisible();
    await expect(skip).toHaveAttribute('href', '#main');
  });
});

test.describe('hero motion', () => {
  test.use({ reducedMotion: 'no-preference' });

  test('the route draws, the tile flips to Ä, and the loop moves on to the card', async ({
    page,
  }) => {
    await page.goto('/en');
    await expect
      .poll(() =>
        page
          .locator('.route-draw')
          .first()
          .evaluate((p) => getComputedStyle(p).strokeDashoffset),
      )
      .toMatch(/^0(px)?$/);
    await expect
      .poll(() => page.locator('.mark-flip-to').evaluate((p) => getComputedStyle(p).opacity))
      .toBe('1');
    const second = page.locator('#hero .hero-screen').nth(1);
    await expect
      .poll(() => second.evaluate((e) => Number(getComputedStyle(e).opacity)), { timeout: 8000 })
      .toBeGreaterThan(0.9);
  });

  test('the pause button stops the loop and says so; hover pauses it too', async ({ page }) => {
    await gotoReady(page, '/en');
    const playState = () =>
      page
        .locator('#hero .hero-screen')
        .first()
        .evaluate((e) => e.getAnimations()[0]?.playState);
    await expect.poll(playState).toBe('running');
    await page.getByRole('button', { name: 'Pause the animation' }).click();
    await expect(page.locator('#hero')).toHaveAttribute('data-paused', '');
    await expect.poll(playState).toBe('paused');
    await page.getByRole('button', { name: 'Play the animation' }).click();
    // Focus inside the phone pauses it too: move focus and the pointer away.
    await page.getByRole('heading', { level: 1 }).click();
    await expect.poll(playState).toBe('running');
    await page.locator('#hero .hero-phones').hover();
    await expect.poll(playState).toBe('paused');
  });
});
