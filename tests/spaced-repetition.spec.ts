import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';

// #73: the spaced-repetition page. Every number is the app's scheduler as
// facts.json exports it (DeutschPlan #1182), in the page's own digits, and
// none is the home page's 1 → 3 → 8 → 21, one review's four choices (#103).
const facts = JSON.parse(readFileSync('content/facts.json', 'utf8'));
const { fsrs } = facts;
const LOCALES = ['en', 'de', 'pl', 'ru', 'bn'];

for (const locale of LOCALES) {
  test.describe(`/${locale}/spaced-repetition`, () => {
    const n = (x: number) => new Intl.NumberFormat(locale).format(x);
    const pct = (x: number) => new Intl.NumberFormat(locale, { style: 'percent' }).format(x);

    test('its description fits a search result: 160 characters at most (#121)', async ({
      page,
    }) => {
      await page.goto(`/${locale}/spaced-repetition`);
      const description = await page.locator('meta[name="description"]').getAttribute('content');
      expect(description!.length).toBeLessThanOrEqual(160);
    });

    test('its answer states the target and the Good chain', async ({ page }) => {
      await page.goto(`/${locale}/spaced-repetition`);
      const answer = (await page.locator('[data-answer]').textContent())!;
      expect(answer).toContain(fsrs.version);
      expect(answer).toContain(pct(fsrs.retention.default));
      for (const days of fsrs.good_days.slice(0, 4))
        expect(answer, String(days)).toContain(n(days));
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    });

    test('lists the four first gaps, the chain, the target range and the plan', async ({
      page,
    }) => {
      await page.goto(`/${locale}/spaced-repetition`);
      const main = page.locator('main');
      const gaps = main.locator('section[aria-labelledby="s-gaps"] li');
      await expect(gaps).toHaveCount(4);
      for (const [i, r] of ['again', 'hard', 'good', 'easy'].entries()) {
        await expect(gaps.nth(i)).toContainText(n(fsrs.first_days[r]));
      }
      // "More than a year" is only true while the chain's last gap is.
      expect(fsrs.good_days.at(-1)).toBeGreaterThan(365);
      await expect(main.locator('section[aria-labelledby="s-chain"]')).toContainText(
        n(fsrs.good_days.at(-1)),
      );
      for (const x of [fsrs.retention.min, fsrs.retention.max]) {
        await expect(main.locator('section[aria-labelledby="s-what"]')).toContainText(pct(x));
      }
      await expect(main.locator('section[aria-labelledby="s-plan"]')).toContainText(
        n(fsrs.plan.revise),
      );
      await expect(main.locator('section[aria-labelledby="s-plan"]')).toContainText(
        n(fsrs.plan.new),
      );
    });

    test('its FAQ is in the graph, and it never gives the home page’s gaps', async ({ page }) => {
      await page.goto(`/${locale}/spaced-repetition`);
      const graphs = await page.locator('script[type="application/ld+json"]').allTextContents();
      const faq = graphs
        .flatMap((g) => {
          const d = JSON.parse(g);
          return d['@graph'] ?? [d];
        })
        .find((node: { '@type'?: string }) => node['@type'] === 'FAQPage');
      expect(faq?.mainEntity).toHaveLength(4);
      const text = (await page.locator('main').textContent())!;
      expect(text).not.toContain(`${n(3)}, ${n(8)}`);
      if (locale === 'en') expect(text).not.toMatch(/three weeks|\b21 days\b/);
    });
  });
}

test('/en/spaced-repetition names its other languages', async ({ page }) => {
  await page.goto('/en/spaced-repetition');
  for (const l of LOCALES) {
    await expect(page.locator(`link[rel="alternate"][hreflang="${l}"]`)).toHaveAttribute(
      'href',
      `https://www.sogda.de/${l}/spaced-repetition`,
    );
  }
});
