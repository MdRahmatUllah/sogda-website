import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { routing } from '../i18n/routing';

// BRIEF §9.
// The home pages first; the content pages (#68) follow, each tested with its page.
test('sitemap.xml lists every home page, with its alternates, x-default and lastmod (#58)', async ({
  request,
}) => {
  const xml = await (await request.get('/sitemap.xml')).text();
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  expect(locs.slice(0, routing.locales.length)).toEqual(
    routing.locales.map((l) => `https://www.sogda.de/${l}`),
  );
  for (const locale of routing.locales) expect(xml).toContain(`hreflang="${locale}"`);
  expect(xml).toContain('hreflang="x-default" href="https://www.sogda.de/en"');
  const lastmods = [...xml.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map((m) => m[1]);
  expect(lastmods).toHaveLength(locs.length);
  for (const d of lastmods) expect(Date.parse(d!)).not.toBeNaN();
});

test('robots.txt: one group that allows everything, the sitemap, and no Host (#58)', async ({
  request,
}) => {
  const txt = await (await request.get('/robots.txt')).text();
  expect(txt.match(/^User-Agent:/gim)).toHaveLength(1);
  expect(txt).toMatch(/^User-Agent: \*$/im);
  expect(txt).toContain('Allow: /');
  expect(txt).toContain('Sitemap: https://www.sogda.de/sitemap.xml');
  expect(txt).not.toMatch(/^Host:/im);
});

test('/favicon.ico is served, as an icon (#58)', async ({ request }) => {
  const res = await request.get('/favicon.ico');
  expect(res.ok()).toBe(true);
  // An ICO file starts 00 00 01 00.
  expect([...(await res.body()).subarray(0, 4)]).toEqual([0, 0, 1, 0]);
});

test('an unknown page: a branded 404 with a title and every home page (#58)', async ({ page }) => {
  const res = await page.goto('/no-such-page');
  expect(res!.status()).toBe(404);
  await expect(page).toHaveTitle('Page not found — Sogda');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page not found');
  for (const locale of routing.locales) {
    await expect(page.locator(`main a[hreflang="${locale}"]`)).toHaveAttribute(
      'href',
      `/${locale}`,
    );
  }
  // A sans-serif (the phone's own), not the browser's serif default.
  const font = await page.evaluate(() => getComputedStyle(document.body).fontFamily);
  expect(font).not.toMatch(/Times/i);
  expect(font).toContain('system-ui');
});

for (const locale of routing.locales) {
  const legal = JSON.parse(readFileSync(`messages/${locale}.json`, 'utf8')).legal;
  for (const [path, description] of [
    ['impressum', legal.impressumDescription],
    ['datenschutz', legal.privacyDescription],
  ] as const) {
    test(`/${locale}/${path}: its own description, canonical to the German copy (#58)`, async ({
      page,
    }) => {
      await page.goto(`/${locale}/${path}`);
      const meta = (sel: string) => page.locator(`meta[${sel}]`).first().getAttribute('content');
      expect(await meta('name="description"')).toBe(description);
      expect(await meta('property="og:description"')).toBe(description);
      const canonical = `https://www.sogda.de/de/${path}`;
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', canonical);
      expect(await meta('property="og:url"')).toBe(canonical);
      // A canonical elsewhere with hreflang here would contradict it.
      await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(0);
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
