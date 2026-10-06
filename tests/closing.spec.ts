import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { routing } from '../i18n/routing';
import { gotoReady } from './ready';

test.describe('The screens gallery (BRIEF §3.9)', () => {
  test('eight real screens, each captioned and described', async ({ page }) => {
    await page.goto('/en');
    const gallery = page.locator('#screens');
    const items = gallery.locator('li figure');
    await expect(items).toHaveCount(8);
    for (let i = 0; i < 8; i++) {
      await expect(items.nth(i).locator('figcaption')).not.toBeEmpty();
      await expect(items.nth(i).getByRole('img').first()).toHaveAttribute('alt', /.{20,}/);
    }
  });

  test('prev/next buttons, dots and arrow keys move through it', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await gotoReady(page, '/en');
    const gallery = page.locator('#screens');
    const dots = gallery.getByRole('button', { name: /Screen \d of 8/ });
    await expect(dots).toHaveCount(8);
    await gallery.getByRole('list', { name: 'App screens' }).scrollIntoViewIfNeeded();
    const current = () =>
      dots.evaluateAll((all) => all.findIndex((d) => d.getAttribute('aria-current') === 'true'));
    const start = await current();
    await gallery.getByRole('button', { name: 'Next screen' }).click();
    await expect.poll(current).toBe(start + 1);
    await gallery.getByRole('button', { name: 'Previous screen' }).click();
    await expect.poll(current).toBe(start);
    await dots.nth(7).click();
    await expect.poll(current).toBe(7);
    await gallery.getByRole('list', { name: 'App screens' }).focus();
    await page.keyboard.press('ArrowLeft');
    await expect.poll(current).toBe(6);
  });

  test('a tablet view on large screens only', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/en');
    await expect(page.getByText('Today’s plan on a tablet')).toBeVisible();
    await page.setViewportSize({ width: 390, height: 844 });
    await expect(page.getByText('Today’s plan on a tablet')).toBeHidden();
  });
});

test.describe('FAQ (BRIEF §3.10)', () => {
  test('seven questions from the facts, opened and closed by keyboard; no pricing', async ({
    page,
  }) => {
    await page.goto('/en');
    const faq = page.locator('#faq');
    const questions = faq.locator('summary');
    await expect(questions).toHaveText([
      'Do I need internet?',
      'Which Android version do I need?',
      'Is there an iPhone version?',
      'Is my data shared?',
      'Where does my document go?',
      'Is the translation online?',
      'Which exams does it prepare me for?',
    ]);
    const answer = faq.getByText('Android 8.0 or newer.');
    await expect(answer).toBeHidden();
    await questions.nth(1).focus();
    await page.keyboard.press('Enter');
    await expect(answer).toBeVisible();
    await page.keyboard.press('Enter');
    await expect(answer).toBeHidden();
    await expect(faq).not.toContainText(/free|price|cost/i);
  });
});

// v1.2.0 (#143): the natural voice is no longer the only download. Every
// answer about working offline names the other one, Hy-MT2.
test('every "do I need internet" answer names both optional downloads (#143)', () => {
  const paths = [
    ['faq', 'internet', 'a'],
    ['pages', 'about', 'faq', 'offline', 'a'],
    ['pages', 'sogda-vs-duolingo', 'faq', 'offline', 'a'],
    ['pages', 'learn-german-in-bangla', 'faq', 'internet', 'a'],
  ];
  const missing: string[] = [];
  for (const locale of routing.locales) {
    const m = JSON.parse(readFileSync(`messages/${locale}.json`, 'utf8'));
    for (const path of paths) {
      const answer = path.reduce((o, k) => o?.[k], m);
      if (typeof answer === 'string' && !answer.includes('Hy-MT2'))
        missing.push(`${locale}.${path.join('.')}`);
    }
  }
  expect(missing).toEqual([]);
});

test.describe('Final CTA (BRIEF §3.11)', () => {
  test('the Lagoon band is where "Get the app" lands', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/en');
    const cta = page.locator('#get');
    await expect(cta.getByRole('heading', { level: 2 })).toHaveText(
      'Start your road to German today.',
    );
    await expect(cta.getByText('Coming soon to Google Play')).toBeAttached();
    await expect(cta.getByText('Coming soon on iPhone')).toBeAttached();
    await page.locator('header').getByRole('link', { name: 'Get the app' }).click();
    await expect(page).toHaveURL(/#get$/);
    await expect(cta.getByRole('heading', { level: 2 })).toBeInViewport();
  });
});
