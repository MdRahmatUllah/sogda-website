import { expect, test } from '@playwright/test';
import { routing } from '../i18n/routing';

// #117: every URL in the sitemap, walked in one pass, with the cheap checks
// that keep the release sweep true. Each page is served and has one absolute
// canonical (itself) and well-formed hreflang to pages that exist; its
// description fits a search result; its card and every internal link
// resolve; and its graph only points at nodes it has.
const SITE = 'https://www.sogda.de';
const LOCALES = new Set<string>([...routing.locales, 'x-default']);

type Node = Record<string, unknown>;

/** Every `{ "@id": … }` reference in a graph node, however deep. */
function refs(value: unknown, out: string[] = []): string[] {
  if (Array.isArray(value)) value.forEach((v) => refs(v, out));
  else if (value && typeof value === 'object') {
    const o = value as Node;
    if (typeof o['@id'] === 'string' && Object.keys(o).length === 1) out.push(o['@id']);
    else Object.values(o).forEach((v) => refs(v, out));
  }
  return out;
}

test('#117 every sitemap page: served, one canonical, hreflang, its card, its graph, its links', async ({
  page,
  request,
}) => {
  test.setTimeout(240_000);
  const xml = await (await request.get('/sitemap.xml')).text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]!);
  expect(urls.length).toBeGreaterThan(10);
  const listed = new Set(urls);
  const path = (url: string) => url.replace(SITE, '') || '/';

  const problems: string[] = [];
  const links = new Set<string>();
  const cards = new Set<string>();
  for (const url of urls) {
    const res = await page.goto(path(url));
    if (res?.status() !== 200) {
      problems.push(`${url}: HTTP ${res?.status()}`);
      continue;
    }
    const head = await page.evaluate(() => ({
      canonical: [...document.querySelectorAll('link[rel="canonical"]')].map((l) =>
        l.getAttribute('href'),
      ),
      alternates: [...document.querySelectorAll('link[rel="alternate"][hreflang]')].map(
        (l) => [l.getAttribute('hreflang')!, l.getAttribute('href')!] as [string, string],
      ),
      image: document.querySelector('meta[property="og:image"]')?.getAttribute('content'),
      description:
        document.querySelector('meta[name="description"]')?.getAttribute('content') ?? '',
      graphs: [...document.querySelectorAll('script[type="application/ld+json"]')].map(
        (s) => s.textContent ?? '',
      ),
      links: [...document.querySelectorAll('a[href^="/"]')].map((a) => a.getAttribute('href')!),
    }));

    // The chooser is the x-default of the homes and canonical to itself too.
    if (head.canonical.length !== 1 || head.canonical[0] !== url)
      problems.push(`${url}: canonical ${JSON.stringify(head.canonical)}`);
    const langs = head.alternates.map(([l]) => l);
    if (!langs.includes('x-default')) problems.push(`${url}: no x-default`);
    if (new Set(langs).size !== langs.length) problems.push(`${url}: a repeated hreflang`);
    if (url !== SITE && !head.alternates.some(([, href]) => href === url))
      problems.push(`${url}: its hreflang set leaves itself out`);
    for (const [lang, href] of head.alternates) {
      if (!LOCALES.has(lang)) problems.push(`${url}: hreflang "${lang}"`);
      if (!listed.has(href))
        problems.push(`${url}: hreflang ${lang} → ${href}, not in the sitemap`);
    }

    // A search result shows about 160 characters of it (#121).
    if (!head.description || head.description.length > 160)
      problems.push(`${url}: description ${head.description.length} characters`);
    if (!head.image?.startsWith(`${SITE}/og/`)) problems.push(`${url}: og:image ${head.image}`);
    else cards.add(path(head.image!));

    // The graph: it parses, and every reference is a node on the page.
    try {
      const nodes = head.graphs.flatMap((g) => {
        const d = JSON.parse(g) as Node;
        return (d['@graph'] as Node[] | undefined) ?? [d];
      });
      const ids = new Set(nodes.map((n) => n['@id']).filter(Boolean));
      for (const id of refs(nodes))
        if (!ids.has(id)) problems.push(`${url}: graph refers to ${id}`);
    } catch (e) {
      problems.push(`${url}: JSON-LD doesn't parse (${e})`);
    }
    head.links.forEach((l) => links.add(l.split('#')[0]!));
  }

  for (const target of [...links, ...cards]) {
    const status = (await request.get(target)).status();
    if (status !== 200) problems.push(`${target}: HTTP ${status} (linked or the card of a page)`);
  }
  expect(problems).toEqual([]);
});

test('#117 an unknown URL is the branded 404, with no index', async ({ page }) => {
  const res = await page.goto('/en/no-such-page');
  expect(res!.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
});
