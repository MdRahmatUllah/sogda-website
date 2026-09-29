import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const legal = JSON.parse(readFileSync('content/legal.json', 'utf8')) as Record<string, unknown>;
const complete = ['name', 'street', 'postcodeCity', 'email', 'phone'].every((k) => legal[k]);

// BRIEF §8: the Impressum and the privacy policy, German (binding) and
// English, reached from every page's footer.
for (const locale of ['en', 'bn']) {
  test.describe(`/${locale}`, () => {
    for (const [path, heading] of [
      ['impressum', 'Angaben gemäß § 5 DDG'],
      ['datenschutz', '3. Hosting'],
    ] as const) {
      test(`${path}: German then English, axe-clean`, async ({ page }) => {
        await page.goto(`/${locale}`);
        await page.locator(`footer a[href="/${locale}/${path}"]`).click();
        await expect(page).toHaveURL(new RegExp(`/${locale}/${path}$`));
        const german = page.locator('article[lang="de"]');
        const english = page.locator('article[lang="en"]');
        await expect(german.getByRole('heading', { name: heading })).toBeVisible();
        await expect(english).toContainText(/English translation|ইংরেজি অনুবাদ/);
        const { violations } = await new AxeBuilder({ page }).analyze();
        expect(violations.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
      });
    }
  });
}

test('the privacy policy says what the site does, and nothing it doesn’t', async ({ page }) => {
  await page.goto('/en/datenschutz');
  const text = await page.locator('article[lang="en"]').innerText();
  expect(text).toContain('sets no cookies');
  expect(text).toContain('Vercel Inc.');
  expect(text).toContain('localStorage');
  await expect(page.locator('a[href="https://vercel.com/legal/dpa"]').first()).toBeVisible();
});

test.describe('until the owner fills in content/legal.json', () => {
  test.skip(complete, 'the Impressum is complete');

  test('the Impressum shows placeholders, never invented details', async ({ page }) => {
    await page.goto('/en/impressum');
    for (const k of ['name', 'street', 'postcodeCity', 'email', 'phone']) {
      await expect(page.locator(`[data-placeholder="${k}"]`).first()).toBeVisible();
    }
  });

  test('the launch check refuses, naming what is missing', () => {
    let failed = false;
    try {
      execFileSync(process.execPath, ['scripts/check-launch.mjs'], { stdio: 'pipe' });
    } catch (e) {
      failed = true;
      expect(String((e as { stderr: Buffer }).stderr)).toContain('name, street');
    }
    expect(failed).toBe(true);
  });
});
