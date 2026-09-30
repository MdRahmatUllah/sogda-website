import { expect, type Page } from '@playwright/test';

/** Go to [path] and wait until public/site.js has run (it marks the page
 * `data-hydrated`): only then do the theme toggle, the menu's link handler
 * and the pause button work. */
export async function gotoReady(page: Page, path: string) {
  await page.goto(path);
  // A deferred script: under a full parallel run it can take a few seconds.
  await expect(page.locator('html')).toHaveAttribute('data-hydrated', '', { timeout: 15_000 });
}
