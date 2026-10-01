import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';

const facts = JSON.parse(readFileSync('content/facts.json', 'utf8'));

// #61: the course's numbers come from content/facts.json, formatted per
// locale, and /llms.txt says the same. agent-3's drift checks extend this
// file.
const words = facts.totals.words;

test('/llms.txt states the facts from facts.json, as plain text', async ({ request }) => {
  const res = await request.get('/llms.txt');
  expect(res.status()).toBe(200);
  expect(res.headers()['content-type']).toContain('text/plain');
  const txt = await res.text();
  expect(txt).toMatch(/^# Sogda\n\n> Sogda is an offline German course app/);
  expect(txt).toContain(
    `in ${facts.totals.steps} steps, with ${words.toLocaleString('en')} words, ` +
      `${facts.totals.grammar_topics} grammar topics and ${facts.totals.mock_exams} mock exams`,
  );
  // Every thousands figure in it is the word count: none stale, none typed.
  for (const [figure] of txt.matchAll(/\b\d{1,3}(?:,\d{3})+\b/g)) {
    expect(figure).toBe(words.toLocaleString('en'));
  }
  expect(txt).toContain('not official Goethe or telc papers');
  expect(txt).toContain('https://www.sogda.de/bn');
});

for (const locale of ['en', 'de', 'pl', 'ru', 'bn'] as const) {
  test(`/${locale}: the hero's fact row states facts.json's numbers`, async ({ page }) => {
    // #91's smoke test catches a raw ICU placeholder; this one a stale count.
    await page.goto(`/${locale}`);
    const format = new Intl.NumberFormat(locale);
    const hero = page.locator('#hero li');
    await expect(hero.nth(0)).toContainText(format.format(words));
    await expect(hero.nth(1)).toContainText(format.format(facts.totals.grammar_topics));
    await expect(hero.nth(2)).toContainText(format.format(facts.totals.steps));
  });

  test(`/${locale}: the journey's numbers are facts.json's, in the locale's digits`, async ({
    page,
  }) => {
    await page.goto(`/${locale}`);
    const journey = page.locator('#journey');
    const format = new Intl.NumberFormat(locale);
    await expect(journey.locator('li').first()).toContainText(format.format(words));
    await expect(journey.locator('li').nth(1)).toContainText(
      format.format(facts.totals.grammar_topics),
    );
    await expect(journey.locator('h2')).toContainText(format.format(facts.totals.steps));
    await expect(page.locator('#journey-count')).toHaveAttribute('data-total', String(words));
  });
}

// The drift checks (#61). A number the site states is either an ICU argument
// from facts.json or a picture's own content (an alt text says what its
// screenshot shows); a number that is close to a fact but isn't it is stale.
const t = facts.totals;
// The counts a stale copy gets nearly right: the words and topics, in all and
// per step.
const near: number[] = [
  t.words,
  t.grammar_topics,
  ...facts.steps.map((s: { words: number }) => s.words),
];
// Other facts a page may state that land near a step's count (B1.1 has 194
// words, C1.1 403): the mock paper's, the scheduler's gaps (409 days, #73),
// and BRIEF §4's text scale (200 %) and voice download (~400 MB).
// ponytail: a hand list; a new BRIEF figure near a step count needs an entry.
const allowed = new Set<number>([
  ...near,
  ...Object.values(facts.mock_exam.writing_min_words as Record<string, number>),
  ...Object.values(facts.mock_exam.speaking_seconds as Record<string, number>),
  ...facts.fsrs.good_days,
  200,
  400,
]);
const BN = '০১২৩৪৫৬৭৮৯';
// A number as the site writes it in any locale (5,069 · 5.069 · 5 069 · 5069 ·
// ৫,০৬৯টি), but not a digit of a level code (A1.1), a version (1.1.0) or a
// Latin word.
const NUM =
  /(?<![\p{Script=Latin}\d.,])\d{1,3}(?:[,.\u00a0\u202f ]\d{3})+(?![\d\p{Script=Latin}])|(?<![\p{Script=Latin}\d.,])\d+(?![\d\p{Script=Latin}]|[.,]\d)/gu;
const numbers = (s: string) =>
  [...s.replace(/[০-৯]/g, (d) => String(BN.indexOf(d))).matchAll(NUM)].map((m) =>
    Number(m[0].replace(/[,.\u00a0\u202f ]/g, '')),
  );
/** Numbers within 5 % of a count that aren't any fact: "about 5,000", "540". */
const nearMisses = (s: string) =>
  numbers(s).filter((n) => !allowed.has(n) && near.some((v) => Math.abs(n - v) <= v * 0.05));

function* leaves(node: unknown, path: string): Generator<[string, string]> {
  if (typeof node === 'string') yield [path, node];
  else if (node && typeof node === 'object')
    for (const [k, v] of Object.entries(node)) yield* leaves(v, `${path}.${k}`);
}

test('#61 no message types a fact: the numbers are ICU arguments', () => {
  // The course-wide counts and each step's words: a literal would outlive
  // the next content build. (A picture's alt texts may say what it shows.)
  const counts = new Set<number>([
    ...Object.values(t as Record<string, number>).filter((n) => n >= 10),
    ...facts.steps.map((s: { words: number }) => s.words),
    facts.mock_exam.questions,
    facts.mock_exam.points,
  ]);
  const typed: string[] = [];
  for (const locale of ['en', 'de', 'pl', 'ru', 'bn']) {
    const messages = JSON.parse(readFileSync(`messages/${locale}.json`, 'utf8'));
    for (const [path, text] of leaves(messages, locale)) {
      // An ICU argument, plural selects included, is not a literal.
      let bare = text;
      while (/\{[^{}]*\}/.test(bare)) bare = bare.replace(/\{[^{}]*\}/g, '');
      for (const n of numbers(bare)) if (counts.has(n)) typed.push(`${path}: ${n} in "${text}"`);
    }
  }
  expect(typed).toEqual([]);
});

test('#61 no page states a near-miss of a count, in its text or its images’ alt', async ({
  page,
  request,
}) => {
  const xml = await (await request.get('/sitemap.xml')).text();
  const paths = [...xml.matchAll(/<loc>https:\/\/www\.sogda\.de([^<]*)<\/loc>/g)].map(
    (m) => m[1] || '/',
  );
  expect(paths.length).toBeGreaterThan(10);
  const stale: string[] = [];
  for (const path of paths) {
    await page.goto(path);
    const text = await page.evaluate(() =>
      [
        document.body.innerText,
        ...[...document.querySelectorAll('img[alt]')].map((i) => i.getAttribute('alt')),
        document.querySelector('meta[name="description"]')?.getAttribute('content') ?? '',
      ].join('\n'),
    );
    for (const n of nearMisses(text)) stale.push(`${path}: ${n}`);
  }
  expect(stale).toEqual([]);
});

test('#61 BRIEF §4 and the Play listing state the facts facts.json has', () => {
  const brief = readFileSync('docs/BRIEF.md', 'utf8');
  const s4 = brief.slice(brief.indexOf('## 4.'), brief.indexOf('## 5.'));
  const en = new Intl.NumberFormat('en');
  expect(s4).toContain(
    `**${t.steps} steps from ${facts.steps[0].code} to ${facts.steps.at(-1).code}**`,
  );
  expect(s4).toContain(`**${en.format(t.words)} words**`);
  expect(s4).toContain(`**${t.grammar_topics} grammar topics**`);
  expect(s4).toContain(`Android ${facts.app.min_android}+ (minSdk ${facts.app.min_sdk})`);
  expect(nearMisses(s4)).toEqual([]);
  // The store texts come verbatim from the app (store-listing.md).
  for (const [locale, texts] of Object.entries(facts.listing as Record<string, object>)) {
    for (const [field, text] of Object.entries(texts as Record<string, string>)) {
      expect(nearMisses(text), `${locale} ${field}`).toEqual([]);
    }
  }
});

// Check 5: the store screenshots were shot from the same course content as
// facts.json. `pnpm sync:screens` records the site-facts `content_version` at
// the store sets' commit; a content change re-syncs both, or this fails.
test('#61 the screenshots are no older than the facts: one content version', () => {
  const source = JSON.parse(readFileSync('content/screens.source.json', 'utf8'));
  const config = JSON.parse(readFileSync('content/screenshots.json', 'utf8'));
  expect(source.app_ref).toBe(config.store.ref);
  expect(source.content_version).toBe(facts.content_version);
});
