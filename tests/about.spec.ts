import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { routing } from '../i18n/routing';
import { gotoReady } from './ready';

const facts = JSON.parse(readFileSync('content/facts.json', 'utf8'));

// Sogda in brief (#70): the fact sheet press and AI answers quote. The first
// real content page, so it also carries the template's checks (#68) in the
// production build, where the sample page isn't built.
type GraphNode = { '@type': string; mainEntity?: { name: string }[] };

test.describe('Sogda in brief (#70)', () => {
  for (const locale of routing.locales) {
    test(`/${locale}/about: indexable, hreflang, the facts in the answer, graph, axe-clean`, async ({
      page,
    }) => {
      await page.goto(`/${locale}/about`);
      const url = `https://www.sogda.de/${locale}/about`;
      await expect(page.locator('html')).toHaveAttribute('lang', locale);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', url);
      for (const l of routing.locales) {
        await expect(page.locator(`link[rel="alternate"][hreflang="${l}"]`)).toHaveAttribute(
          'href',
          `https://www.sogda.de/${l}/about`,
        );
      }
      await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute(
        'href',
        'https://www.sogda.de/en/about',
      );
      await expect(page.locator('meta[name="robots"][content*="noindex"]')).toHaveCount(0);
      const description = await page.locator('meta[name="description"]').getAttribute('content');
      expect(description!.length).toBeLessThanOrEqual(160);
      await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
        'content',
        new RegExp(`/og/${locale}/about\\.png$`),
      );

      // Answer first, with the synced numbers in the locale's own digits.
      const main = page.locator('main#main');
      const answer = main.locator('h1 + p[data-answer]');
      const n = (x: number) => new Intl.NumberFormat(locale).format(x);
      for (const x of [facts.totals.words, facts.totals.grammar_topics, facts.totals.steps]) {
        await expect(answer).toContainText(n(x));
      }
      // Every ICU argument was filled.
      expect(await main.innerText()).not.toMatch(/[{}]/);

      const graph = JSON.parse(
        (await main.locator('script[type="application/ld+json"]').textContent())!,
      )['@graph'] as GraphNode[];
      expect(graph.map((g) => g['@type'])).toEqual(
        expect.arrayContaining(['WebPage', 'BreadcrumbList', 'FAQPage']),
      );
      expect(graph.find((g) => g['@type'] === 'FAQPage')!.mainEntity).toHaveLength(
        await main.locator('details').count(),
      );

      const { violations } = await new AxeBuilder({ page }).analyze();
      expect(violations.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
    });
  }

  test('in the sitemap, in every locale, naming the others', async ({ request }) => {
    const xml = await (await request.get('/sitemap.xml')).text();
    for (const l of routing.locales)
      expect(xml).toContain(`<loc>https://www.sogda.de/${l}/about</loc>`);
    expect(xml).toContain('hreflang="x-default" href="https://www.sogda.de/en/about"');
  });

  test('every home page links to it from the footer, so it is no orphan', async ({ page }) => {
    for (const l of routing.locales) {
      await page.goto(`/${l}`);
      await expect(page.locator(`footer a[href="/${l}/about"]`)).toBeVisible();
    }
    // Of the 12 level pages (#72), only the first: they link to each other.
    await page.goto('/en');
    await expect(page.locator('footer a[href="/en/a1-1"]')).toBeVisible();
    await expect(page.locator('footer a[href="/en/a1-2"]')).toHaveCount(0);
  });

  test.describe('the language switch', () => {
    test.use({ viewport: { width: 1280, height: 800 } });
    test('keeps you on the page', async ({ page }) => {
      await gotoReady(page, '/en/about');
      await page.getByRole('button', { name: /Language/ }).click();
      await page.locator('#language-menu').getByRole('link', { name: 'Polski' }).click();
      await expect(page).toHaveURL(/\/pl\/about$/);
    });
  });
});
