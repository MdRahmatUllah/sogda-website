import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';

// #71: the mock exams page. Every number is a fact from content/facts.json, in
// the page's own digits; the paper and the levels come from it; the page never
// says Sogda's papers follow the Goethe and telc sections (#81: those exams
// have a reading part, and Sogda's papers don't).
const facts = JSON.parse(readFileSync('content/facts.json', 'utf8'));
const LOCALES = ['en', 'de', 'pl', 'ru', 'bn'];

for (const locale of LOCALES) {
  test.describe(`/${locale}/mock-exams`, () => {
    test('states the facts: 36 mock exams, 3 a step, 40 questions and 48 points', async ({
      page,
    }) => {
      await page.goto(`/${locale}/mock-exams`);
      const n = (x: number) => new Intl.NumberFormat(locale).format(x);
      // The answer itself: a hard-coded number there must not hide behind the
      // same fact elsewhere on the page.
      const answer = await page.locator('[data-answer]').textContent();
      for (const x of [
        facts.totals.mock_exams,
        facts.totals.mock_exams_per_step,
        facts.totals.steps,
        facts.mock_exam.questions,
        facts.mock_exam.points,
      ]) {
        expect(answer, String(x)).toContain(n(x));
      }
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    });

    test('lists every section of the paper and every level with its exams', async ({ page }) => {
      await page.goto(`/${locale}/mock-exams`);
      const main = page.locator('main');
      for (const level of facts.levels) {
        await expect(main.getByText(level.exam_target, { exact: false }).first()).toBeVisible();
      }
      const n = (x: number) => new Intl.NumberFormat(locale).format(x);
      for (const [level, words] of Object.entries(facts.mock_exam.writing_min_words)) {
        await expect(
          main.locator('li', { hasText: new RegExp(`^${level}:`) }).first(),
        ).toContainText(n(words as number));
      }
      const sections = facts.mock_exam.sections.length;
      // The paper's list, then the levels' list.
      expect(await main.locator('ul li').count()).toBeGreaterThanOrEqual(
        sections + facts.levels.length,
      );
    });

    test('its FAQ is in the graph, and it never claims the exams’ sections', async ({ page }) => {
      await page.goto(`/${locale}/mock-exams`);
      const graphs = await page.locator('script[type="application/ld+json"]').allTextContents();
      const faq = graphs
        .flatMap((g) => {
          const d = JSON.parse(g);
          return d['@graph'] ?? [d];
        })
        .find((node: { '@type'?: string }) => node['@type'] === 'FAQPage');
      expect(faq?.mainEntity).toHaveLength(4);
      if (locale === 'en') {
        const text = (await page.locator('main').textContent())!;
        expect(text).not.toMatch(/follow(s)? (the|their) (Goethe|sections)/i);
        expect(text).toMatch(/no reading/i);
      }
    });
  });
}

test('/en/mock-exams names its other languages', async ({ page }) => {
  await page.goto('/en/mock-exams');
  for (const l of LOCALES) {
    await expect(page.locator(`link[rel="alternate"][hreflang="${l}"]`)).toHaveAttribute(
      'href',
      `https://www.sogda.de/${l}/mock-exams`,
    );
  }
});
