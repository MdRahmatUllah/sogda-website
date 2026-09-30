// After `next build`, before scripts/csp.mjs: every page ships without Next's
// client runtime (#22).
//
// Why: the site is static HTML and CSS; its few behaviours live in
// public/site.js. React's hydration of the whole page (~108 KB gzip of chunks,
// plus the RSC payload inlined as `self.__next_f.push(...)` scripts: 177 KB of
// /bn's 329 KB, a second copy of the page and its CSS) cost a phone's main
// thread 150–350 ms of blocking time after first paint, for nothing it shows.
//
// What goes: the <script src> chunks (and their noModule polyfills), the
// script preloads, and the inline scripts that feed or start the runtime.
// What stays: every other inline script (the theme, `/`'s language pick,
// JSON-LD) and /site.js.
// ponytail: a post-build rewrite of Next's output. If a Next upgrade renames
// its runtime markers, the check below fails the build rather than ship it.
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

function htmlFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory()
      ? htmlFiles(join(dir, e.name))
      : e.name.endsWith('.html')
        ? [join(dir, e.name)]
        : [],
  );
}

// A client component would render but never run: its JS goes below.
for (const dir of ['app', 'components']) {
  for (const f of readdirSync(dir, { recursive: true })) {
    const path = join(dir, f);
    if (/\.[jt]sx?$/.test(f) && /^\s*['"]use client['"]/m.test(readFileSync(path, 'utf8'))) {
      throw new Error(
        `strip-next: ${path} is a client component; put its behaviour in public/site.js`,
      );
    }
  }
}

let count = 0;
for (const file of htmlFiles('out')) {
  let html = readFileSync(file, 'utf8');
  html = html
    .replace(/<script\b[^>]*\ssrc="\/_next\/[^"]*"[^>]*><\/script>/g, '')
    .replace(/<link\b[^>]*\bas="script"[^>]*\/?>/g, '')
    .replace(
      /<script\b[^>]*>(?:(?!<\/script>)[\s\S])*?__next_[fs](?:(?!<\/script>)[\s\S])*<\/script>/g,
      '',
    );
  if (/\/_next\/static\/chunks\/|__next_[fs]/.test(html)) {
    throw new Error(`strip-next: Next's runtime is still in ${file}`);
  }
  writeFileSync(file, html);
  count++;
}
console.log(`strip-next: ${count} pages`);
