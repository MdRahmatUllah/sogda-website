// After `next build`: give every page a Content-Security-Policy that allows
// exactly its own inline scripts, by hash. Next's App Router inlines its RSC
// payload as <script> tags, and a static site has no server to add nonces, so
// the hashes go into a <meta> CSP on each page. vercel.json adds what a <meta>
// can't carry (frame-ancestors) and the other security headers.
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const OUT = 'out';

function policy(html) {
  const hashes = new Set();
  for (const [, attrs, body] of html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)) {
    if (/\ssrc=/.test(attrs)) continue;
    hashes.add(`'sha256-${createHash('sha256').update(body).digest('base64')}'`);
  }
  return [
    "default-src 'self'",
    `script-src 'self' ${[...hashes].join(' ')}`.trim(),
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self'",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'none'",
  ].join('; ');
}

function withPolicy(html) {
  const meta = `<meta http-equiv="Content-Security-Policy" content="${policy(html)}"/>`;
  // Right after the charset, before any script it has to cover.
  return html.replace(/(<meta charSet="utf-8"\/>)/i, `$1${meta}`);
}

function htmlFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory()
      ? htmlFiles(join(dir, e.name))
      : e.name.endsWith('.html')
        ? [join(dir, e.name)]
        : [],
  );
}

let count = 0;
for (const file of htmlFiles(OUT)) {
  const html = readFileSync(file, 'utf8');
  if (html.includes('http-equiv="Content-Security-Policy"')) continue;
  const next = withPolicy(html);
  if (next === html) throw new Error(`${file}: no <meta charSet> to put the CSP after`);
  writeFileSync(file, next);
  count++;
}
console.log(`csp: ${count} pages`);
