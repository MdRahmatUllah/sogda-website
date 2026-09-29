import { expect, test } from '@playwright/test';
import { gotoReady } from './ready';

test.describe('Practise and test yourself (BRIEF §3.5)', () => {
  test('three real screens: an article quiz, a listening exam, a result', async ({ page }) => {
    await page.goto('/en');
    const practice = page.locator('#practice');
    await expect(practice.getByRole('heading', { level: 2 })).toBeVisible();
    await expect(practice.getByText('Quizzes in every direction')).toBeVisible();
    await expect(practice.getByText('Three mock exams for every step')).toBeVisible();
    const shots = practice.getByRole('img');
    await expect(shots).toHaveCount(3);
    await expect(shots.nth(0)).toHaveAttribute('alt', /article quiz/);
    await expect(shots.nth(2)).toHaveAttribute('alt', /mock exam result/);
  });

  test('on a phone: a carousel with dots and arrow keys', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoReady(page, '/en');
    const practice = page.locator('#practice');
    const dots = practice.getByRole('button', { name: /Screen \d of 3/ });
    await expect(dots).toHaveCount(3);
    await expect(dots.nth(0)).toHaveAttribute('aria-current', 'true');
    await dots.nth(2).click();
    await expect(dots.nth(2)).toHaveAttribute('aria-current', 'true');
    await practice.getByRole('list', { name: 'Quiz and exam screens' }).focus();
    await page.keyboard.press('ArrowLeft');
    await expect(dots.nth(1)).toHaveAttribute('aria-current', 'true');
  });

  test('wide: a fan, with no dots', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/en');
    const practice = page.locator('#practice');
    await expect(practice.getByRole('button', { name: /Screen \d of 3/ }).first()).toBeHidden();
    await practice.locator('.practice-fan').scrollIntoViewIfNeeded();
    for (const i of [0, 1, 2])
      await expect(practice.getByRole('img').nth(i)).toBeInViewport({ ratio: 0 });
    const rotate = await practice
      .locator('.practice-fan > li')
      .first()
      .evaluate((e) => getComputedStyle(e).transform);
    expect(rotate).not.toBe('none');
  });
});

test.describe('The feature grid (BRIEF §3.6)', () => {
  test('eight features, each with a title and a line', async ({ page }) => {
    await page.goto('/en');
    const cards = page.locator('#features .feature-card');
    await expect(cards).toHaveCount(8);
    await expect(cards.getByRole('heading', { level: 3 })).toHaveText([
      'Offline, always',
      'Private by design',
      'Hear every word',
      'Compare near-synonyms',
      'Add your own words',
      'A home-screen widget',
      'A reminder only when it’s due',
      'Your pace',
    ]);
  });
});

test.describe('Three looks (BRIEF §3.7)', () => {
  test('a radio group switches the phone between light, dark and glass', async ({ page }) => {
    await page.goto('/en');
    const looks = page.locator('#looks');
    const screen = (look: string) => looks.locator(`.look-screen[data-look="${look}"]`);
    const opacity = (look: string) => screen(look).evaluate((e) => getComputedStyle(e).opacity);
    await expect(looks.getByRole('radio', { name: 'Light' })).toBeChecked();
    await expect.poll(() => opacity('light')).toBe('1');
    await expect.poll(() => opacity('dark')).toBe('0');
    await looks.getByText('Dark', { exact: true }).click();
    await expect(looks.getByRole('radio', { name: 'Dark' })).toBeChecked();
    await expect.poll(() => opacity('dark')).toBe('1');
    await expect.poll(() => opacity('light')).toBe('0');
    // The keyboard moves through the group.
    await looks.getByRole('radio', { name: 'Dark' }).focus();
    await page.keyboard.press('ArrowRight');
    await expect(looks.getByRole('radio', { name: 'Glass' })).toBeChecked();
    await expect.poll(() => opacity('glass')).toBe('1');
    await expect(looks.getByText('Text at 200 %')).toBeVisible();
  });
});

test.describe('In your language (BRIEF §3.8)', () => {
  test('der Termin in English and Bangla, Russian and Polish soon', async ({ page }) => {
    await page.goto('/en');
    const card = page.locator('#languages .card');
    await expect(card.getByText('appointment')).toBeVisible();
    await expect(card.locator('dd[lang="bn"]')).toHaveText('অ্যাপয়েন্টমেন্ট / নির্ধারিত সময়');
    await expect(card.locator('[lang="bn"]', { hasText: '/টের্মিন/' })).toBeVisible();
    await expect(card.locator('[lang="ru"]')).toHaveText('Русский');
    await expect(card.locator('[lang="pl"]')).toHaveText('Polski');
    await expect(card.getByText('· soon')).toHaveCount(2);
  });
});

// CLAUDE.md, Hard rules: no claim that BRIEF §4 doesn't list.
test('the page makes no claim the owner hasn’t given', async ({ page }) => {
  await page.goto('/en');
  const text = await page.locator('body').innerText();
  expect(text).not.toMatch(
    /\bfree\b|no ads|ad-free|rating|testimonial|downloads?\b.*\d|official (goethe|telc)|partner/i,
  );
});
