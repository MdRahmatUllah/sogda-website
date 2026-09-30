import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { routing } from '../i18n/routing';

// BRIEF §9.
test('sitemap.xml lists every page in every language, with its alternates', async ({ request }) => {
  const xml = await (await request.get('/sitemap.xml')).text();
  for (const locale of routing.locales) {
    for (const page of ['', '/impressum', '/datenschutz']) {
      expect(xml).toContain(`<loc>https://www.sogda.de/${locale}${page}</loc>`);
    }
  }
  for (const locale of routing.locales) expect(xml).toContain(`hreflang="${locale}"`);
});

test('robots.txt allows everything and names the sitemap', async ({ request }) => {
  const txt = await (await request.get('/robots.txt')).text();
  expect(txt).toContain('Allow: /');
  expect(txt).toContain('Sitemap: https://www.sogda.de/sitemap.xml');
});

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
