import { expect, type Page } from '@playwright/test';

/** Go to [path] and wait until the page's JS has hydrated it: it arrives
 * after load (scripts/defer-hydration.mjs), and only then do the theme
 * toggle, the menu's link handler and the pause button work. */
export async function gotoReady(page: Page, path: string) {
  await page.goto(path);
  await expect(page.locator('html')).toHaveAttribute('data-hydrated', '');
}
