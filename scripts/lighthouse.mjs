// `pnpm lighthouse`: the CLAUDE.md budgets, on the static build (`pnpm build`
// first). Lighthouse's default is a throttled mid-range phone, which is the
// mobile run the budgets mean. Exits non-zero if any page misses one.
//   node scripts/lighthouse.mjs [url ...]   (default: every locale of out/)
import { spawn } from 'node:child_process';
import { readdirSync, readFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import * as chromeLauncher from 'chrome-launcher';
import lighthouse from 'lighthouse';

const PORT = 4174;
// Every locale has its messages file (i18n/routing.ts lists the same codes).
const LOCALES = readdirSync('messages').map((f) => f.replace(/\.json$/, ''));

const BUDGET = { score: 95, lcp: 2000, cls: 0.05, tbt: 150, jsKb: 130 };

/** Initial JS of a built page, gzipped: every <script src> a modern browser loads. */
function initialJsKb(locale) {
  const html = readFileSync(`out/${locale}.html`, 'utf8');
  // noModule polyfills never load in a browser that runs modules.
  const srcs = [...html.matchAll(/<script([^>]*)>/g)]
    .filter(([, attrs]) => !/noModule/i.test(attrs))
    .flatMap(([, attrs]) => attrs.match(/\ssrc="([^"]+)"/)?.[1] ?? []);
  const bytes = srcs.reduce((sum, src) => sum + gzipSync(readFileSync(`out${decodeURIComponent(src)}`)).length, 0);
  return bytes / 1024;
}

const server = spawn('pnpm', ['exec', 'serve', 'out', '-l', String(PORT)], {
  shell: true,
  stdio: 'ignore',
});
const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless=new'] });
let failed = false;
try {
  await new Promise((r) => setTimeout(r, 2000));
  const urls = process.argv.slice(2);
  const targets = urls.length
    ? urls.map((url) => ({ url }))
    : LOCALES.map((l) => ({ url: `http://localhost:${PORT}/${l}`, locale: l }));
  for (const { url, locale } of targets) {
    const { lhr } = await lighthouse(url, { port: chrome.port, output: 'json', logLevel: 'error' });
    const scores = Object.fromEntries(
      Object.entries(lhr.categories).map(([k, c]) => [k, Math.round(c.score * 100)]),
    );
    const a = lhr.audits;
    const row = {
      ...scores,
      lcp: Math.round(a['largest-contentful-paint'].numericValue),
      cls: Number(a['cumulative-layout-shift'].numericValue.toFixed(3)),
      tbt: Math.round(a['total-blocking-time'].numericValue),
      ...(locale ? { jsKb: Number(initialJsKb(locale).toFixed(1)) } : {}),
    };
    const misses = [
      ...Object.entries(scores)
        .filter(([, s]) => s < BUDGET.score)
        .map(([k, s]) => `${k} ${s} < ${BUDGET.score}`),
      row.lcp > BUDGET.lcp && `LCP ${row.lcp} ms > ${BUDGET.lcp}`,
      row.cls > BUDGET.cls && `CLS ${row.cls} > ${BUDGET.cls}`,
      row.tbt > BUDGET.tbt && `TBT ${row.tbt} ms > ${BUDGET.tbt}`,
      row.jsKb > BUDGET.jsKb && `JS ${row.jsKb} KB > ${BUDGET.jsKb}`,
    ].filter(Boolean);
    console.log(url, JSON.stringify(row), misses.length ? `FAIL: ${misses.join(', ')}` : 'ok');
    if (misses.length) failed = true;
  }
} finally {
  await chrome.kill();
  server.kill();
}
process.exit(failed ? 1 : 0);
