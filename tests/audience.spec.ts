import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';

// The audience pages: "Learn German in Bangla" (#69, bn and en) and «немецкий с
// нуля» / «niemiecki od podstaw» (#75, ru and pl). Every number and word from
// content/facts.json; each page says honestly in which language its grammar is.
const facts = JSON.parse(readFileSync('content/facts.json', 'utf8'));
const LOCALES = ['en', 'de', 'pl', 'ru', 'bn'];
const PAGES = [
  {
    slug: 'learn-german-in-bangla',
    grammar: { bn: 'ইংরেজিতে', en: 'in English' } as Record<string, string>,
  },
  {
    slug: 'learn-german-from-scratch',
    grammar: { ru: 'на русском', pl: 'po polsku' } as Record<string, string>,
  },
];

for (const { slug, grammar } of PAGES) {
  const locales = Object.keys(grammar);
  for (const locale of locales) {
    test(`/${locale}/${slug}: the facts, the grammar's language, and the Germany words`, async ({
      page,
    }) => {
      const res = await page.goto(`/${locale}/${slug}`);
      expect(res?.status()).toBe(200);
      const n = new Intl.NumberFormat(locale);
      const answer = page.locator('[data-answer]');
      await expect(answer).toContainText(n.format(facts.totals.words));
      await expect(answer).toContainText(n.format(facts.totals.grammar_topics));
      // Where the grammar rules are: English for Bangla, the page's own
      // language for Russian and Polish (BRIEF §4).
      await expect(page.locator('#s-meanings ~ p').nth(1)).toContainText(grammar[locale]!);
      const terms = page.locator('dt[lang="de"]');
      await expect(terms).toHaveCount(facts.featured.length);
      const anmeldung = facts.featured.find((w: { german: string }) => w.german === 'Anmeldung');
      const first = page.locator('dd').first();
      await expect(first).toContainText(anmeldung.meaning[locale]);
      await expect(first).toContainText(anmeldung.guide[locale]);
      await expect(first).toContainText(anmeldung.step);
      const alternates = await page
        .locator('link[rel="alternate"][hreflang]')
        .evaluateAll((links) => links.map((l) => l.getAttribute('hreflang')));
      expect(alternates.sort()).toEqual([...locales, 'x-default'].sort());
    });
  }

  test(`/${slug} exists only in ${locales.join(' and ')}`, async ({ request }) => {
    for (const locale of LOCALES.filter((l) => !locales.includes(l))) {
      expect((await request.get(`/${locale}/${slug}`)).status()).toBe(404);
    }
  });
}
