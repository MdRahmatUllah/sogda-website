import { expect, test } from '@playwright/test';
import { gotoReady } from './ready';

const STEPS = [
  'A1.1',
  'A1.2',
  'A2.1',
  'A2.2',
  'B1.1',
  'B1.2',
  'B2.1',
  'B2.2',
  'C1.1',
  'C1.2',
  'C2.1',
  'C2.2',
];

test.describe('It remembers for you (BRIEF §3.3)', () => {
  test('the message, the curve with its revisions, and the word card', async ({ page }) => {
    await page.goto('/en');
    const memory = page.locator('#memory');
    await expect(memory.getByRole('heading', { level: 2 })).toHaveText(
      "Each word comes back just before you'd forget it.",
    );
    await expect(memory.getByRole('img', { name: /forgetting curve/ })).toBeVisible();
    await expect(memory.locator('.memory-dot')).toHaveCount(5);
    for (const gap of ['1 day', '3 days', '8 days', '21 days']) {
      await expect(memory.getByText(gap, { exact: true })).toBeAttached();
    }
    await expect(memory.getByText('Termin')).toBeVisible();
    await expect(memory.getByText('appointment')).toBeVisible();
    await expect(memory.locator('.memory-chip')).toHaveText(['1 d', '3 d', '8 d', '21 d']);
  });

  test('reduced motion: the curve is drawn and the revisions are there', async ({ page }) => {
    await gotoReady(page, '/en');
    const offset = await page
      .locator('.memory-curve')
      .evaluate((e) => getComputedStyle(e).strokeDashoffset);
    expect(offset).toMatch(/^0(px|%)?$/);
    await expect(page.locator('.memory-chip').last()).toHaveCSS('opacity', '1');
  });

  test.describe('with motion', () => {
    test.use({ reducedMotion: 'no-preference' });

    test('waits out of view, then draws the curve and pops in the revisions', async ({ page }) => {
      await gotoReady(page, '/en');
      const curve = page.locator('.memory-curve');
      await expect
        .poll(() => curve.evaluate((e) => getComputedStyle(e).strokeDashoffset))
        .toMatch(/^1(px)?$/);
      await expect(page.locator('.memory-chip').last()).toHaveCSS('opacity', '0');
      await page.locator('#memory figure').scrollIntoViewIfNeeded();
      await expect
        .poll(() => curve.evaluate((e) => getComputedStyle(e).strokeDashoffset), { timeout: 8000 })
        .toMatch(/^0(px|%)?$/);
      await expect(page.locator('.memory-chip').last()).toHaveCSS('opacity', '1', {
        timeout: 8000,
      });
    });
  });
});

test.describe('The journey (BRIEF §3.4)', () => {
  test('12 stations, the level names, the facts and the placement line', async ({ page }) => {
    await page.goto('/en');
    const journey = page.locator('#journey');
    await expect(journey.getByRole('heading', { level: 2 })).toHaveText(
      '12 steps from your first “Hallo” to C2.',
    );
    await expect(journey.locator('.journey-station')).toHaveCount(12);
    await expect(journey.locator('.journey-chip-text')).toHaveText(STEPS);
    for (const level of [
      'A1 · Anfänger',
      'A2 · Grundstufe',
      'B1 · Mittelstufe',
      'B2',
      'C1',
      'C2',
    ]) {
      await expect(journey.locator('text', { hasText: level }).first()).toBeAttached();
    }
    for (const fact of ['5,069 words', '182 grammar topics', 'Three mock exams for every step']) {
      await expect(journey.getByText(fact)).toBeVisible();
    }
    await expect(
      journey.getByText('A short placement check starts you at the right step'),
    ).toBeVisible();
  });

  test('reduced motion: the road is travelled, every station lit', async ({ page }) => {
    await gotoReady(page, '/en');
    await expect(page.locator('.journey-station[data-lit]')).toHaveCount(12);
    await expect(page.locator('#journey-count')).toHaveText('5,069');
  });

  test.describe('with motion', () => {
    test.use({ reducedMotion: 'no-preference' });

    test('the traveller follows the scroll, lighting the stations it reaches', async ({ page }) => {
      await gotoReady(page, '/en');
      // The script starts the road once its section is within a screen of the
      // view (it measures nothing at load, #22). There, the road's top is
      // still below the traveller's line: back at the start.
      await page.evaluate(() => {
        const section = document.getElementById('journey')!;
        scrollTo(0, section.getBoundingClientRect().top + scrollY - innerHeight - 10);
      });
      await expect(page.locator('.journey-station[data-lit]')).toHaveCount(1);
      await expect(page.locator('#journey-count')).toHaveText('0');
      // Halfway down the road: about half the stations. Sections around the
      // road render as it scrolls (content-visibility), moving it, so align
      // the road's middle on the traveller's line until the layout settles.
      const lit = page.locator('.journey-station[data-lit]');
      const alignHalfway = async () => {
        await page.evaluate(() => {
          const road = document.getElementById('journey-road') as unknown as SVGPathElement;
          const box = road.ownerSVGElement!.getBoundingClientRect();
          scrollBy(0, box.top + box.height / 2 - innerHeight * 0.7);
        });
        await page.waitForTimeout(150);
        return lit.count();
      };
      await page.locator('#journey svg').scrollIntoViewIfNeeded();
      await expect.poll(alignHalfway).toBeGreaterThanOrEqual(5);
      expect(await alignHalfway()).toBeLessThanOrEqual(8);
      // Past the end: the whole road.
      await page.locator('footer').scrollIntoViewIfNeeded();
      await expect(page.locator('.journey-station[data-lit]')).toHaveCount(12);
      await expect(page.locator('#journey-count')).toHaveText('5,069');
    });
  });
});
