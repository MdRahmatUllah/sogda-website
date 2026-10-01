import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { routing } from '../i18n/routing';

const facts = JSON.parse(readFileSync('content/facts.json', 'utf8'));

// #74: fair comparisons, features only, in every locale.
const SLUGS = ['sogda-vs-anki', 'sogda-vs-duolingo'];

// No price, rating or "free" (BRIEF), in any of the site's languages. FSRS's
// own name, the Free Spaced Repetition Scheduler, is not a price.
const PRICE =
  /€|\$|\bfree\b(?! spaced)|kostenlos|umsonst|gratis|darmo|bezpłatn|бесплатн|рейтинг|বিনামূল্যে|ফ্রি|রেটিং|\brating|★/i;

for (const slug of SLUGS) {
  for (const locale of routing.locales) {
    test(`/${locale}/${slug}: answer first with the facts, both ways, its sources, no prices, axe-clean`, async ({
      page,
    }) => {
      await page.goto(`/${locale}/${slug}`);
      const url = `https://www.sogda.de/${locale}/${slug}`;
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', url);
      for (const l of routing.locales) {
        await expect(page.locator(`link[rel="alternate"][hreflang="${l}"]`)).toHaveAttribute(
          'href',
          `https://www.sogda.de/${l}/${slug}`,
        );
      }
      const description = await page.locator('meta[name="description"]').getAttribute('content');
      expect(description!.length).toBeLessThanOrEqual(160);
      // Search results cut a title at about 60 characters (#120).
      expect((await page.title()).length).toBeLessThanOrEqual(60);

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
      expect(text).not.toMatch(PRICE);

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
}
