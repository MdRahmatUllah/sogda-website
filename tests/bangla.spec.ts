import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';

// #69: "Learn German in Bangla", in bn and en, every number and word from
// content/facts.json.
const facts = JSON.parse(readFileSync('content/facts.json', 'utf8'));
const PATH = 'learn-german-in-bangla';

for (const locale of ['bn', 'en'] as const) {
  test(`/${locale}/${PATH}: the facts, the honest line, and the Germany words`, async ({
    page,
  }) => {
    const res = await page.goto(`/${locale}/${PATH}`);
    expect(res?.status()).toBe(200);
    const n = new Intl.NumberFormat(locale);
    const answer = page.locator('[data-answer]');
    await expect(answer).toContainText(n.format(facts.totals.words));
    await expect(answer).toContainText(n.format(facts.totals.grammar_topics));
    // Grammar and examples are English for a Bangla learner: the page says so.
    await expect(page.locator('#s-meanings ~ p').nth(1)).toContainText(
      locale === 'bn' ? 'ইংরেজিতে' : 'in English',
    );
    const terms = page.locator('dt[lang="de"]');
    await expect(terms).toHaveCount(facts.featured.length);
    const anmeldung = facts.featured.find((w: { german: string }) => w.german === 'Anmeldung');
    await expect(page.locator('dd').first()).toContainText(
      locale === 'bn' ? anmeldung.meaning.bn : anmeldung.meaning.en,
    );
    await expect(page.locator('dd').first()).toContainText(anmeldung.step);
    const alternates = await page
      .locator('link[rel="alternate"][hreflang]')
      .evaluateAll((links) => links.map((l) => l.getAttribute('hreflang')));
    expect(alternates.sort()).toEqual(['bn', 'en', 'x-default']);
  });
}

test('the page exists only in bn and en', async ({ request }) => {
  for (const locale of ['de', 'pl', 'ru']) {
    expect((await request.get(`/${locale}/${PATH}`)).status()).toBe(404);
  }
});
