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
