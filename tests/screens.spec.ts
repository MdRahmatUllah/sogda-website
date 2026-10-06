import { expect, test } from '@playwright/test';
import { existsSync, readFileSync, statSync } from 'node:fs';
type Screen = {
  id: string;
  golden: string;
  store?: string;
  device?: string;
  themes: string[];
  alt: Record<string, string>;
};
type Config = {
  ref: string;
  store: { ref: string; sets: Record<string, Record<string, string | string[]>> };
  screens: Screen[];
};
type Built = {
  source: string;
  ref: string;
  base: string;
  hash: string;
  width: number;
  height: number;
  widths: number[];
};
const config = JSON.parse(readFileSync('content/screenshots.json', 'utf8')) as Config;
const built = JSON.parse(readFileSync('content/screens.generated.json', 'utf8')) as Record<
  string,
  Built
>;

/** The store capture a screen should come from in a language, or null. */
function storeCapture(s: Screen, theme: string, lang: string): string | null {
  const set = config.store.sets[lang];
  const dir = set?.[theme];
  const skip = (set?.skip as string[] | undefined) ?? [];
  return s.store && typeof dir === 'string' && !skip.includes(s.store)
    ? `store:${dir}/${s.store}.png`
    : null;
}

// The pipeline's output (BRIEF §6, #66), checked on disk: no browser needed.
test.describe('the screenshot pipeline', () => {
  test('every screen and theme: the English store capture where there is one, else the golden (#66)', () => {
    for (const s of config.screens) {
      expect(s.alt.en!.length, s.id).toBeGreaterThan(20);
      for (const theme of s.themes) {
        const g = built[`${s.id}-${theme}`];
        expect(g, `${s.id}-${theme}`).toBeTruthy();
        const store = storeCapture(s, theme, 'en');
        expect(g!.source).toBe(store ?? `golden:${s.golden}_${theme}_${s.device ?? 'phone'}.png`);
        expect(g!.ref).toBe(store ? config.store.ref : config.ref);
      }
    }
  });

  test('Polish, Russian and Bangla get their own capture where their set has one (#66, #114)', () => {
    let count = 0;
    for (const s of config.screens) {
      for (const theme of s.themes) {
        for (const lang of ['pl', 'ru', 'bn']) {
          const store = storeCapture(s, theme, lang);
          const g = built[`${s.id}-${theme}@${lang}`];
          if (store) {
            expect(g?.source, `${s.id}-${theme}@${lang}`).toBe(store);
            count++;
          } else {
            expect(g, `${s.id}-${theme}@${lang}`).toBeUndefined();
          }
        }
      }
    }
    expect(count).toBeGreaterThanOrEqual(21);
  });

  test('every file exists under a name that carries its hash, in the goldens’ shape (#66)', () => {
    for (const [key, g] of Object.entries(built)) {
      expect(g.hash, key).toMatch(/^[0-9a-f]{8}$/);
      for (const w of g.widths) {
        for (const ext of ['avif', 'webp']) {
          expect(existsSync(`public/screens/${g.base}-${w}.${g.hash}.${ext}`), key).toBe(true);
        }
      }
      // Phone screens in one shape (1170:2532), store captures extended to it,
      // so a frame never changes shape as its screens change.
      if (!key.includes('tablet')) {
        expect(Math.abs(g.height / g.width - 2532 / 1170), key).toBeLessThan(0.002);
      }
    }
  });

  test('a hero-sized phone screen is at most 120 KB as AVIF (CLAUDE.md budget)', () => {
    for (const [key, g] of Object.entries(built).filter(
      ([k, g]) => g.widths.includes(1080) && !k.includes('tablet'),
    )) {
      const kb = statSync(`public/screens/${g.base}-1080.${g.hash}.avif`).size / 1024;
      expect(kb, key).toBeLessThanOrEqual(120);
    }
  });

  test('both refs are pinned to a commit, never a branch', () => {
    expect(config.ref).toMatch(/^([0-9a-f]{40}|v\d+\.\d+\.\d+)$/);
    expect(config.store.ref).toMatch(/^[0-9a-f]{40}$/);
    expect(readFileSync('scripts/sync-screenshots.mjs', 'utf8')).toContain(
      'raw.githubusercontent.com',
    );
  });

  test('/screens is cached for good, which only its hashed names make safe (#66)', () => {
    const headers = JSON.parse(readFileSync('vercel.json', 'utf8')).headers as {
      source: string;
      headers: { key: string; value: string }[];
    }[];
    const rule = headers.find((h) => h.source === '/screens/(.*)');
    expect(rule?.headers.find((h) => h.key === 'Cache-Control')?.value).toContain('immutable');
  });
});

// On the page: each locale shows the app in its own language where it can.
test.describe('the screens follow the page’s language (#66)', () => {
  for (const [locale, own] of [
    ['pl', true],
    ['ru', true],
    ['en', false],
    ['de', false],
    ['bn', true],
  ] as const) {
    test(`/${locale}: the hero's Today is ${own ? 'the app in its language' : 'the default'}`, async ({
      page,
    }) => {
      await page.goto(`/${locale}`);
      const srcs = await page
        .locator('#hero img')
        .evaluateAll((imgs) => imgs.map((i) => i.getAttribute('src') ?? ''));
      const today = srcs.filter((s) => s.includes('/screens/today-light'));
      expect(today.length, srcs.join(' ')).toBeGreaterThan(0);
      for (const s of today) {
        if (own) expect(s).toContain(`today-light-${locale}-`);
        else expect(s).not.toMatch(/today-light-(pl|ru|bn)-/);
      }
    });
  }

  test('the looks section compares themes of one app, whatever the language', async ({ page }) => {
    await page.goto('/pl');
    const src = await page.locator('#looks .look-screen img').first().getAttribute('src');
    expect(src).not.toContain('-pl-');
  });
});

// The component, in the gallery (a SOGDA_GALLERY=1 build).
test.describe('Screen in DeviceFrame', () => {
  test.skip(!process.env.SOGDA_GALLERY, 'build with SOGDA_GALLERY=1');

  test('the screens load, sized from their source, with alt text; auto follows the theme', async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/en/gallery');
    const today = page.getByRole('img', { name: /Today screen: a ring/ }).first();
    const width = Number(await today.getAttribute('width'));
    const height = Number(await today.getAttribute('height'));
    expect(Math.abs(height / width - 2532 / 1170)).toBeLessThan(0.002);
    await expect(today).toHaveAttribute('loading', 'eager');
    await expect
      .poll(() => today.evaluate((i: HTMLImageElement) => i.naturalWidth))
      .toBeGreaterThan(0);
    // Dark mode shows the dark card, and the light one isn't downloaded.
    const auto = page.locator('img[src*="study-back-"]');
    await expect(auto.nth(1)).toBeVisible();
    await expect(auto.nth(0)).toBeHidden();
    expect(await auto.nth(0).evaluate((i: HTMLImageElement) => i.currentSrc)).toBe('');
  });
});
