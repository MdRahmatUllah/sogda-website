import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { routing } from '../i18n/routing';

// BRIEF §9.
test('sitemap.xml lists the home pages with alternates, x-default and lastmod, and no legal page', async ({
  request,
}) => {
  const xml = await (await request.get('/sitemap.xml')).text();
  for (const locale of routing.locales) {
    expect(xml).toContain(`<loc>https://www.sogda.de/${locale}</loc>`);
    expect(xml).toContain(`hreflang="${locale}"`);
  }
  expect(xml).toContain('hreflang="x-default"');
  expect(xml.match(/<lastmod>/g)).toHaveLength(routing.locales.length);
  // #58: the legal pages are the same text in every locale, canonical to /de.
  expect(xml).not.toContain('/impressum');
  expect(xml).not.toContain('/datenschutz');
});

test('robots.txt allows everything in one group, names the sitemap, and has no Host line', async ({
  request,
}) => {
  const txt = await (await request.get('/robots.txt')).text();
  expect(txt).toContain('Allow: /');
  expect(txt).toContain('Sitemap: https://www.sogda.de/sitemap.xml');
  expect(txt.match(/^User-Agent:/gim)).toHaveLength(1);
  expect(txt).not.toMatch(/^Host:/im);
});

test('the 404 is branded: a title, a sans font (never Times), and all five home pages', async ({
  page,
}) => {
  const response = await page.goto('/no-such-page');
  expect(response?.status()).toBe(404);
  await expect(page).toHaveTitle('Page not found — Sogda');
  await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute('content', /noindex/);
  // The system sans (app/not-found.tsx says why not Inter); it was Times.
  const font = await page.evaluate(() => getComputedStyle(document.body).fontFamily);
  expect(font).toMatch(/sans-serif/);
  expect(font).not.toMatch(/times/i);
  for (const locale of routing.locales) {
    await expect(page.locator(`main a[href="/${locale}"][hreflang="${locale}"]`)).toBeVisible();
  }
});

for (const [slug, key] of [
  ['impressum', 'impressum'],
  ['datenschutz', 'privacy'],
] as const) {
  for (const locale of routing.locales) {
    test(`/${locale}/${slug}: its own description and card, canonical to /de`, async ({ page }) => {
      await page.goto(`/${locale}/${slug}`);
      const legal = JSON.parse(readFileSync(`messages/${locale}.json`, 'utf8')).legal;
      const meta = (sel: string) => page.locator(`meta[${sel}]`).first().getAttribute('content');
      expect(await meta('name="description"')).toBe(legal[`${key}Description`]);
      expect(await meta('property="og:description"')).toBe(legal[`${key}Description`]);
      expect(await meta('property="og:title"')).toBe(`${legal[key]} — Sogda`);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        'href',
        `https://www.sogda.de/de/${slug}`,
      );
    });
  }
}

for (const locale of routing.locales) {
  test(`/${locale}: title, description, Open Graph and Twitter card`, async ({ page, request }) => {
    await page.goto(`/${locale}`);
    const messages = JSON.parse(readFileSync(`messages/${locale}.json`, 'utf8'));
    await expect(page).toHaveTitle(messages.meta.title);
    const meta = (sel: string) => page.locator(`meta[${sel}]`).first().getAttribute('content');
    expect(await meta('name="description"')).toBe(messages.meta.description);
    expect(await meta('property="og:title"')).toBe(messages.meta.title);
    expect(await meta('property="og:url"')).toBe(`https://www.sogda.de/${locale}`);
    expect(await meta('name="twitter:card"')).toBe('summary_large_image');
    const image = await meta('property="og:image"');
    expect(image).toBe(`https://www.sogda.de/og/${locale}.png`);
    expect(await meta('property="og:image:width"')).toBe('1200');
    const png = await request.get(`/og/${locale}.png`);
    expect(png.ok()).toBe(true);
    const bytes = await png.body();
    // PNG header: width and height, big-endian, at bytes 16-23.
    expect([bytes.readUInt32BE(16), bytes.readUInt32BE(20)]).toEqual([1200, 630]);
  });

  test(`/${locale}: JSON-LD MobileApplication, with no rating or price`, async ({ page }) => {
    await page.goto(`/${locale}`);
    const raw = await page.locator('script[type="application/ld+json"]').textContent();
    const data = JSON.parse(raw!);
    expect(data['@type']).toBe('MobileApplication');
    expect(data.name).toBe('Sogda');
    expect(data.operatingSystem).toBe('ANDROID');
    expect(data.applicationCategory).toBe('EducationalApplication');
    expect(data).not.toHaveProperty('aggregateRating');
    expect(data).not.toHaveProperty('offers');
  });
}
