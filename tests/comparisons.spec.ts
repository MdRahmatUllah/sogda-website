import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';

const facts = JSON.parse(readFileSync('content/facts.json', 'utf8'));

// #74: fair comparisons, features only. en and de for now; the other
// locales have no such page, so neither hreflang nor the switch offers one.
const SLUGS = ['sogda-vs-anki', 'sogda-vs-duolingo'];
const LOCALES = ['en', 'de'];

for (const slug of SLUGS) {
  for (const locale of LOCALES) {
    test(`/${locale}/${slug}: answer first with the facts, both ways, its sources, no prices, axe-clean`, async ({
      page,
    }) => {
      await page.goto(`/${locale}/${slug}`);
      const url = `https://www.sogda.de/${locale}/${slug}`;
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', url);
      for (const l of LOCALES) {
        await expect(page.locator(`link[rel="alternate"][hreflang="${l}"]`)).toHaveAttribute(
          'href',
          `https://www.sogda.de/${l}/${slug}`,
        );
      }
      await expect(page.locator('link[rel="alternate"][hreflang="pl"]')).toHaveCount(0);
      const description = await page.locator('meta[name="description"]').getAttribute('content');
      expect(description!.length).toBeLessThanOrEqual(160);

      const main = page.locator('main#main');
      const answer = main.locator('h1 + p[data-answer]');
      await expect(answer).toContainText(new Intl.NumberFormat(locale).format(facts.totals.words));
      const text = await main.innerText();
      expect(text).not.toMatch(/[{}]/);
      // "Choose X if…" both ways, and where the other product's facts come from.
      expect(
        await main.locator('section[aria-labelledby^="s-"] ul').count(),
      ).toBeGreaterThanOrEqual(2);
      await expect(main.locator('#s-sources')).toBeVisible();
      // Features only: no price, rating or "free" (BRIEF).
      expect(text).not.toMatch(/€|\$|\bfree\b|\bkostenlos|\bgratis|\brating|★/i);

      const graph = JSON.parse(
        (await main.locator('script[type="application/ld+json"]').textContent())!,
      )['@graph'] as { '@type': string; mainEntity?: unknown[] }[];
      expect(graph.find((g) => g['@type'] === 'FAQPage')!.mainEntity).toHaveLength(
        await main.locator('details').count(),
      );

      const { violations } = await new AxeBuilder({ page }).analyze();
      expect(violations.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
    });
  }

  test(`/${slug} doesn't exist in pl, ru or bn yet`, async ({ request }) => {
    for (const l of ['pl', 'ru', 'bn'])
      expect((await request.get(`/${l}/${slug}`)).status()).toBe(404);
  });
}
