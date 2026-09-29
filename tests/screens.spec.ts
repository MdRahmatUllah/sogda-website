import { expect, test } from '@playwright/test';
import { existsSync, readFileSync, statSync } from 'node:fs';
type Config = {
  ref: string;
  screens: { id: string; golden: string; device?: string; themes: string[]; alt: { en: string } }[];
};
const config = JSON.parse(readFileSync('content/screenshots.json', 'utf8')) as Config;
const built = JSON.parse(readFileSync('content/screens.generated.json', 'utf8')) as Record<
  string,
  { ref: string; golden: string; widths: number[] }
>;

// The pipeline's output (BRIEF §6), checked on disk: no browser needed.
test.describe('the screenshot pipeline', () => {
  test('every listed screen and theme is built at the pinned ref, with English alt text', () => {
    for (const s of config.screens) {
      expect(s.alt.en.length, s.id).toBeGreaterThan(20);
      for (const theme of s.themes) {
        const g = built[`${s.id}-${theme}`];
        expect(g, `${s.id}-${theme}`).toBeTruthy();
        expect(g!.ref).toBe(config.ref);
        expect(g!.golden).toBe(`${s.golden}_${theme}_${s.device ?? 'phone'}.png`);
        for (const w of g!.widths) {
          for (const ext of ['avif', 'webp']) {
            expect(
              existsSync(`public/screens/${s.id}-${theme}-${w}.${ext}`),
              `${s.id}-${theme}-${w}.${ext}`,
            ).toBe(true);
          }
        }
      }
    }
  });

  test('a hero-sized phone screen is at most 120 KB as AVIF (CLAUDE.md budget)', () => {
    for (const key of Object.keys(built).filter(
      (k) => built[k]!.widths.includes(1080) && !k.includes('tablet'),
    )) {
      const kb = statSync(`public/screens/${key}-1080.avif`).size / 1024;
      expect(kb, key).toBeLessThanOrEqual(120);
    }
  });

  test('the ref is pinned to a commit, never a branch', () => {
    expect(config.ref).toMatch(/^([0-9a-f]{40}|v\d+\.\d+\.\d+)$/);
    expect(readFileSync('scripts/sync-screenshots.mjs', 'utf8')).toContain(
      'raw.githubusercontent.com',
    );
  });
});

// The component, in the gallery (a SOGDA_GALLERY=1 build).
test.describe('Screen in DeviceFrame', () => {
  test.skip(!process.env.SOGDA_GALLERY, 'build with SOGDA_GALLERY=1');

  test('the screens load, sized from the golden, with alt text; auto follows the theme', async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/en/gallery');
    const today = page.getByRole('img', { name: /Today screen: a ring/ }).first();
    await expect(today).toHaveAttribute('width', '1170');
    await expect(today).toHaveAttribute('height', '2532');
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
