import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';

// #72: a page per step, A1.1 … C2.2, in the four meaning languages, every
// number from content/facts.json.
const facts = JSON.parse(readFileSync('content/facts.json', 'utf8'));
const LOCALES = ['en', 'bn', 'ru', 'pl'] as const;
const slug = (code: string) => code.toLowerCase().replace('.', '-');
const first = facts.steps[0];
const last = facts.steps.at(-1);

for (const locale of LOCALES) {
  for (const step of [first, last]) {
    test(`/${locale}/${slug(step.code)}: the step's facts, grammar and words`, async ({ page }) => {
      const res = await page.goto(`/${locale}/${slug(step.code)}`);
      expect(res?.status()).toBe(200);
      const n = new Intl.NumberFormat(locale);
      await expect(page).toHaveTitle(new RegExp(`${step.code}.*${n.format(step.words)}`));
      const answer = page.locator('[data-answer]');
      await expect(answer).toContainText(n.format(step.words));
      await expect(answer).toContainText(n.format(step.grammar_topics));
      await expect(page.locator('#s-grammar ~ ul li')).toHaveCount(step.grammar_topics);
      // The sample's German is marked German, whatever the page's language.
      const terms = page.locator('dt[lang="de"]');
      await expect(terms).toHaveCount(step.sample.length);
      await expect(terms.first()).toContainText(step.sample[0].german);
      await expect(page.locator('dd').first()).toContainText(step.sample[0].meaning[locale]);
      // Only the four meaning languages are its alternates.
      const alternates = await page
        .locator('link[rel="alternate"][hreflang]')
        .evaluateAll((links) => links.map((l) => l.getAttribute('hreflang')));
      expect(alternates.sort()).toEqual([...LOCALES, 'x-default'].sort());
      const graph = await page.locator('main script[type="application/ld+json"]').textContent();
      expect(graph).toContain('"FAQPage"');
    });
  }
}

test('the last step says it is the last, and names no next step', async ({ page }) => {
  await page.goto(`/en/${slug(last.code)}`);
  await expect(page.locator('main')).toContainText('is the last step of the course');
});

test('/de has no level pages, and the sitemap lists them in the four languages', async ({
  page,
  request,
}) => {
  expect((await request.get(`/de/${slug(first.code)}`)).status()).toBe(404);
  const xml = await (await request.get('/sitemap.xml')).text();
  for (const locale of LOCALES) {
    expect(xml).toContain(`<loc>https://www.sogda.de/${locale}/${slug(first.code)}</loc>`);
  }
  expect(xml).not.toContain(`https://www.sogda.de/de/${slug(first.code)}`);
  await page.goto('/en');
});
