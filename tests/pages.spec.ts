import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { routing } from '../i18n/routing';
import { gotoReady } from './ready';

// The content-page template (#68), through its sample page. Until the first
// real page is in content/pages.ts the sample is built everywhere (noindex);
// after that, only with SOGDA_GALLERY=1, and these tests skip without it.
const SAMPLE = 'template-sample';

type GraphNode = {
  '@type': string;
  itemListElement?: { item: string }[];
  mainEntity?: { name: string }[];
};

test.describe('the page template (#68)', () => {
  test.beforeEach(async ({ request }) => {
    test.skip(
      !(await request.get(`/en/${SAMPLE}`)).ok(),
      'the sample is in this build only while no real page exists, or with SOGDA_GALLERY=1',
    );
  });

  for (const locale of routing.locales) {
    test(`/${locale}: metadata, answer first, graph, FAQ, store and links, axe-clean`, async ({
      page,
    }) => {
      await page.goto(`/${locale}/${SAMPLE}`);
      const url = `https://www.sogda.de/${locale}/${SAMPLE}`;
      await expect(page.locator('html')).toHaveAttribute('lang', locale);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', url);
      // hreflang across the locales the page exists in, and a default.
      for (const l of routing.locales) {
        await expect(page.locator(`link[rel="alternate"][hreflang="${l}"]`)).toHaveAttribute(
          'href',
          `https://www.sogda.de/${l}/${SAMPLE}`,
        );
      }
      await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute(
        'href',
        `https://www.sogda.de/en/${SAMPLE}`,
      );
      // The sample is never indexed.
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
      const description = await page.locator('meta[name="description"]').getAttribute('content');
      expect(description).toBeTruthy();

      // Answer first: the first paragraph after the H1 is the answer.
      const main = page.locator('main#main');
      const h1 = main.getByRole('heading', { level: 1 });
      await expect(h1).toBeVisible();
      await expect(main.locator('h1 + p')).toHaveAttribute('data-answer', '');

      // The breadcrumb: Sogda (the locale's home), then this page.
      const crumbs = main.locator('nav').first();
      await expect(crumbs.getByRole('link', { name: 'Sogda' })).toHaveAttribute(
        'href',
        `/${locale}`,
      );
      await expect(crumbs.locator('[aria-current="page"]')).toBeVisible();

      // The graph: the page (about the app), its breadcrumb, and its FAQ,
      // with as many questions as the page shows.
      const graph = JSON.parse(
        (await main.locator('script[type="application/ld+json"]').textContent())!,
      )['@graph'] as GraphNode[];
      const node = (type: string) => graph.find((n) => n['@type'] === type)!;
      // The shared nodes it points at are on the page too (#60).
      expect(graph.map((n) => n['@type'])).toEqual(
        expect.arrayContaining(['Organization', 'WebSite', 'MobileApplication']),
      );
      expect(node('WebPage')).toMatchObject({
        '@id': `${url}#webpage`,
        url,
        inLanguage: locale,
        about: { '@id': 'https://www.sogda.de/#app' },
        isPartOf: { '@id': 'https://www.sogda.de/#website' },
      });
      expect(node('BreadcrumbList').itemListElement).toHaveLength(2);
      expect(node('BreadcrumbList').itemListElement![0]!.item).toBe(
        `https://www.sogda.de/${locale}`,
      );
      const questions = main.locator('details');
      expect(node('FAQPage').mainEntity).toHaveLength(await questions.count());
      expect(node('FAQPage').mainEntity![0]!.name).toBe(
        (await questions.first().locator('summary').textContent())!.trim(),
      );

      // The store, and the way on.
      await expect(main.locator('#page-cta')).toBeVisible();
      await expect(main.locator('nav[aria-labelledby="page-related"] a').first()).toHaveAttribute(
        'href',
        `/${locale}`,
      );

      const { violations } = await new AxeBuilder({ page }).analyze();
      expect(violations.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
    });
  }

  test('the sample is in no sitemap', async ({ request }) => {
    expect(await (await request.get('/sitemap.xml')).text()).not.toContain(SAMPLE);
  });

  test('a page that doesn’t exist in a language 404s there', async ({ request }) => {
    expect((await request.get(`/en/${SAMPLE}-nope`)).status()).toBe(404);
  });
});

test.describe('the language switch follows the page’s own alternates (#68)', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test('to the same page where it exists, else to that language’s home', async ({
    page,
    request,
  }) => {
    test.skip(!(await request.get(`/en/${SAMPLE}`)).ok(), 'needs the sample page');
    await gotoReady(page, `/en/${SAMPLE}`);
    const pick = async (name: string) => {
      await page.getByRole('button', { name: /Language/ }).click();
      await page.locator('#language-menu').getByRole('link', { name }).click();
    };
    await pick('Polski');
    await expect(page).toHaveURL(new RegExp(`/pl/${SAMPLE}$`));
    // Drop the German alternate, as a page that exists only in some languages
    // has none: the switch goes to /de, not to a 404.
    await gotoReady(page, `/en/${SAMPLE}`);
    await page.evaluate(() =>
      document.querySelector('link[rel="alternate"][hreflang="de"]')!.remove(),
    );
    await pick('Deutsch');
    await expect(page).toHaveURL(/\/de$/);
  });

  test('a page with no alternates (the legal pages) swaps the locale in its path', async ({
    page,
  }) => {
    await gotoReady(page, '/en/impressum');
    await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(0);
    await page.getByRole('button', { name: /Language/ }).click();
    await page.locator('#language-menu').getByRole('link', { name: 'Русский' }).click();
    await expect(page).toHaveURL(/\/ru\/impressum$/);
  });
});
