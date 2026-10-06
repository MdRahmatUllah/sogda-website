import { expect, type Page, test } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { routing } from '../i18n/routing';
import { gotoReady } from './ready';

// Each language in its own name (components/ui/Footer.tsx's LANGUAGE_NAMES).
const NAMES: Record<string, string> = {
  en: 'English',
  de: 'Deutsch',
  pl: 'Polski',
  ru: 'Русский',
  bn: 'বাংলা',
};

// BRIEF §7, #63: `/` is a chooser any crawler can index; in production
// vercel.json sends every browser on to its language first (307, ?from=root),
// and the locale page honours a language picked before.
test.describe('/ is the language chooser (#63)', () => {
  test('an indexable page: no redirect, title, canonical, absolute hreflang, five links', async ({
    page,
  }) => {
    const en = JSON.parse(readFileSync('messages/en.json', 'utf8'));
    const res = await page.goto('/');
    expect(res!.status()).toBe(200);
    await page.waitForTimeout(500);
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator('script')).toHaveCount(0);
    await expect(page).toHaveTitle(en.meta.title);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      en.meta.description,
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://www.sogda.de',
    );
    await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute(
      'href',
      'https://www.sogda.de',
    );
    for (const l of routing.locales) {
      await expect(page.locator(`link[rel="alternate"][hreflang="${l}"]`)).toHaveAttribute(
        'href',
        `https://www.sogda.de/${l}`,
      );
      const link = page.locator(`main a[hreflang="${l}"]`);
      await expect(link).toHaveAttribute('href', `/${l}`);
      await expect(link).toHaveAttribute('lang', l);
      await expect(link).toContainText(NAMES[l]!);
    }
  });

  test('every locale page names / as its x-default', async ({ page }) => {
    await page.goto('/pl');
    await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute(
      'href',
      'https://www.sogda.de',
    );
  });
});

test.describe('arriving from / (?from=root, #63)', () => {
  test('a language picked before, if another one, wins', async ({ page }) => {
    await page.goto('/en');
    await page.evaluate(() => localStorage.setItem('locale', 'pl'));
    await page.goto('/de?from=root');
    await expect(page).toHaveURL(/\/pl$/);
  });

  test('no pick, or the same one: the page stays, and the parameter goes', async ({ page }) => {
    await page.goto('/de?from=root');
    await expect(page).toHaveURL(/\/de$/);
    await page.evaluate(() => localStorage.setItem('locale', 'de'));
    await page.goto('/de?from=root#faq');
    await expect(page).toHaveURL(/\/de#faq$/);
  });
});

test.describe('vercel.json sends browsers from / by their first language (#63)', () => {
  // The local server (serve) doesn't run vercel.json, so this applies its
  // rules the way Vercel does: in order, the first whose `has` all match. A
  // header value is read both anchored to the whole header and unanchored, and
  // the two readings must agree, so the rules hold whichever Vercel uses.
  type Rule = {
    source: string;
    destination: string;
    permanent: boolean;
    has: { type: string; key: string; value?: string }[];
  };
  const rules = (JSON.parse(readFileSync('vercel.json', 'utf8')).redirects as Rule[]).filter(
    (r) => r.source === '/',
  );
  const route = (header: string | undefined, anchored: boolean) =>
    rules.find((r) =>
      r.has.every(
        (h) =>
          h.type === 'header' &&
          h.key === 'accept-language' &&
          header !== undefined &&
          (h.value === undefined ||
            new RegExp(anchored ? `^(?:${h.value})$` : h.value).test(header)),
      ),
    );
  for (const [header, expected] of [
    ['bn-BD,bn;q=0.9,en-US;q=0.8', 'bn'],
    ['de-DE,de;q=0.9,en;q=0.8', 'de'],
    ['pl-PL,pl;q=0.9', 'pl'],
    ['ru-RU,ru;q=0.9,en-US;q=0.8', 'ru'],
    ['en-US,en;q=0.9,bn;q=0.8', 'en'], // Bangla second: English wins
    ['fr-FR,fr;q=0.9,de;q=0.8', 'en'], // German only second: English
    ['*', 'en'],
    [undefined, null], // a crawler: the chooser
  ] as const) {
    test(`${header ?? 'no Accept-Language'} → ${expected ? `/${expected}` : 'the chooser'}`, () => {
      for (const anchored of [true, false]) {
        const rule = route(header, anchored);
        expect(rule?.destination ?? null).toBe(expected ? `/${expected}?from=root` : null);
        // 307: a 308 would be cached as "/ is /bn" for everyone after.
        if (rule) expect(rule.permanent).toBe(false);
      }
    });
  }
});

test('the header switch changes the language and remembers it', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await gotoReady(page, '/en');
  const bar = page.locator('header > div').first();
  await bar.getByRole('button', { name: 'Language: English' }).click();
  const menu = page.locator('#language-menu');
  await expect(menu).toBeVisible();
  await expect(menu.getByRole('link')).toHaveText(routing.locales.map((l) => NAMES[l]!));
  await expect(menu.getByRole('link', { name: 'English' })).toHaveAttribute('aria-current', 'true');
  await menu.getByRole('link', { name: 'বাংলা' }).click();
  await expect(page).toHaveURL(/\/bn$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'bn');
  expect(await page.evaluate(() => localStorage.getItem('locale'))).toBe('bn');
  await expect(
    page.locator('header > div').first().getByRole('button', { name: /বাংলা/ }),
  ).toBeVisible();
});

test('the switch keeps the page: from an Impressum to the same Impressum', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await gotoReady(page, '/en/impressum');
  await page
    .locator('header > div')
    .first()
    .getByRole('button', { name: /Language/ })
    .click();
  await page.locator('#language-menu').getByRole('link', { name: 'Deutsch' }).click();
  await expect(page).toHaveURL(/\/de\/impressum$/);
});

test('on a phone the languages are in the menu', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await gotoReady(page, '/en');
  const bar = page.locator('header > div').first();
  await expect(bar.getByRole('button', { name: /Language/ })).toBeHidden();
  await page.getByRole('button', { name: 'Menu' }).click();
  await expect(page.locator('#menu').getByRole('navigation', { name: 'Language' })).toBeVisible();
  await expect(page.locator('#menu').getByRole('link', { name: 'Deutsch' })).toBeVisible();
});

test('a page loads only the fonts its own text needs', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  const fonts: string[] = [];
  page.on('request', (r) => r.resourceType() === 'font' && fonts.push(r.url()));
  await page.goto('/en');
  await page.waitForLoadState('networkidle');
  // Inter only: the Bangla (and any other script's) font waits until a page,
  // or an opened language menu, shows that script.
  expect(fonts).toHaveLength(1);
});

test('every page names its other languages (hreflang, x-default → the chooser at /)', async ({
  page,
}) => {
  for (const locale of routing.locales) {
    await page.goto(`/${locale}`);
    for (const lang of routing.locales) {
      await expect(page.locator(`link[rel="alternate"][hreflang="${lang}"]`)).toHaveAttribute(
        'href',
        new RegExp(`/${lang}$`),
      );
    }
    await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute(
      'href',
      'https://www.sogda.de',
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      new RegExp(`/${locale}$`),
    );
  }
});

test('the Bangla page: Bangla copy, Bangla digits, Bangla alt text', async ({ page }) => {
  await page.goto('/bn');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'জার্মান শিখুন, প্রতিদিন একটু একটু করে।',
  );
  await expect(
    page
      .locator('#journey')
      .getByText(`${new Intl.NumberFormat('bn').format(FACTS.totals.words)}টি শব্দ`),
  ).toBeVisible();
  await expect(page.locator('#hero .hero-screen img').first()).toHaveAttribute('alt', /আজকের পাতা/);
  await expect(page.locator('#day [data-beat="0"] span').first()).toHaveText('১');
  await expect(page.getByText('শিগগিরই Google Play-তে আসছে').first()).toBeVisible();
});

// Counted words agree with their number (Polish one/few/many; the memory
// chart's gaps are the app's schedule from content/facts.json, #103).
const FACTS = JSON.parse(readFileSync('content/facts.json', 'utf8'));
const GAPS: number[] = FACTS.fsrs.good_days.slice(0, 4);
const counted = (locale: string, forms: Record<string, string>) =>
  GAPS.map((n) => `${n} ${forms[new Intl.PluralRules(locale).select(n)]}`);
// The course's word count as the page writes it (#143): the locale's digits
// and grouping, and the noun's form for that number.
const words = (locale: string, forms: Record<string, string>) =>
  `${new Intl.NumberFormat(locale).format(FACTS.totals.words)} ${forms[new Intl.PluralRules(locale).select(FACTS.totals.words)]}`;

// The chart's first label and the revisions' last count carry the unit
// (#135): 4 takes the few form and 150 the many form, in Polish and Russian.
const firstAndLast = async (page: Page, forms: Record<string, string>, locale: string) => {
  const gaps = counted(locale, forms);
  await expect(page.locator('#memory .memory-dot text').first()).toHaveText(gaps[0]!);
  const revisions = await page.locator('#memory ol').getAttribute('aria-label');
  expect(revisions?.endsWith(gaps.at(-1)!), revisions ?? '').toBe(true);
};

test('Polish counts: the gaps take dzień / dni / dnia by their number', async ({ page }) => {
  await page.goto('/pl');
  await firstAndLast(page, { one: 'dzień', few: 'dni', many: 'dni', other: 'dnia' }, 'pl');
  await expect(
    page
      .locator('#journey')
      .getByText(words('pl', { one: 'słowo', few: 'słowa', many: 'słów', other: 'słowa' })),
  ).toBeVisible();
});

test('Bangla chips: the gaps in Bengali digits, as the app shows numbers (#103)', async ({
  page,
}) => {
  await page.goto('/bn');
  const bn = new Intl.NumberFormat('bn');
  await expect(page.locator('#memory .memory-chip')).toHaveText(
    GAPS.map((n) => `${bn.format(n)} দিন`),
  );
});

test('Russian counts: день / дня / дней by their number; Cyrillic in its own font', async ({
  page,
}) => {
  const fonts: string[] = [];
  page.on('request', (r) => r.resourceType() === 'font' && fonts.push(r.url()));
  await page.goto('/ru');
  await firstAndLast(page, { one: 'день', few: 'дня', many: 'дней', other: 'дня' }, 'ru');
  await expect(
    page
      .locator('#journey')
      .getByText(words('ru', { one: 'слово', few: 'слова', many: 'слов', other: 'слова' })),
  ).toBeVisible();
  // Inter Latin, and Inter's Cyrillic face for the Russian text (not a
  // system fallback); the Bangla font only if the page shows Bangla.
  await page.waitForLoadState('networkidle');
  expect(fonts.length).toBeGreaterThanOrEqual(2);
});

// #139: a page translator (Chrome's "Translate to English") ignores `lang`, so
// the course's German must be marked translate="no" (in SVG, the class
// notranslate), or /de's word cards turn into English. The Impressum's German
// stays translatable (not in this list).
for (const path of ['/de', '/en', '/en/a1-1', '/bn/learn-german-in-bangla']) {
  test(`${path}: the course's German keeps its German under page translation (#139)`, async ({
    page,
  }) => {
    await page.goto(path);
    const marks = await page
      .locator('main [lang="de"]')
      .evaluateAll((els) =>
        els.map((e) => [e.textContent?.trim(), !!e.closest('[translate="no"], .notranslate')]),
      );
    expect(marks.length, 'the page shows German').toBeGreaterThan(0);
    expect(marks.filter(([, kept]) => !kept).map(([text]) => text)).toEqual([]);
  });
}

// #150: since v1.2.0 the app promises "the whole course works offline", not
// the sound (DeutschPlan #1365: the phone's German voice may need installing).
// No locale may say more: no "fully offline", no "no signal" for all of Sogda.
test('no locale says Sogda is fully offline, only the whole course (#150)', () => {
  const over =
    /fully offline|completely offline|komplett offline|vollständig offline|całkowicie offline|w pełni offline|полностью офлайн|পুরোপুরি অফলাইন|সম্পূর্ণ অফলাইন|^no signal|^kein netz|^bez zasięgu|^связь не нужна|^ইন্টারনেট লাগে না/i;
  for (const locale of routing.locales) {
    const found: string[] = [];
    const walk = (x: unknown, path: string) => {
      if (typeof x === 'string') {
        if (over.test(x)) found.push(`${path}: ${x}`);
      } else if (x && typeof x === 'object') {
        for (const [k, v] of Object.entries(x)) walk(v, path ? `${path}.${k}` : k);
      }
    };
    walk(JSON.parse(readFileSync(`messages/${locale}.json`, 'utf8')), '');
    expect(found, locale).toEqual([]);
  }
  expect(readFileSync('app/llms.txt/route.ts', 'utf8')).not.toMatch(over);
});
