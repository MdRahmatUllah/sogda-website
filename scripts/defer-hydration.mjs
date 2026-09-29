// After `next build`, before scripts/csp.mjs: Next's JS starts after the page
// has loaded, not alongside the hero.
//
// Why: on Lighthouse's simulated mobile network, every request that starts
// before the hero image paints shares its bandwidth, and Next's ~105 KB of
// React runtime pushed the hero's LCP from 1.8 s (no JS) to 2.4 s, past the
// 2.0 s budget. The page is static HTML and CSS that reads, looks and moves
// (CSS animations, the native popover menu) without JS; the JS only adds the
// theme toggle, the menu closing on a link, and the pause button. So it can
// wait for `load`.
//
// How: each page's async chunk <script src> tags (and the runtime's preload)
// are removed and re-created, attributes and all, by one inline loader on
// `load`, once the first frame has painted. The noModule polyfills stay (modern browsers never fetch them).
// ponytail: a post-build rewrite of Next's output; if a Next upgrade changes
// how it emits scripts, the e2e hydration checks (data-hydrated) fail first.
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

function attrs(tag) {
  return Object.fromEntries(
    [...tag.matchAll(/\s([a-zA-Z_:-]+)(?:="([^"]*)")?/g)].map(([, k, v]) => [k, v ?? '']),
  );
}

let count = 0;
for (const file of htmlFiles('out')) {
  let html = readFileSync(file, 'utf8');
  if (html.includes('id="defer-hydration"')) continue;
  const scripts = [];
  html = html.replace(/<script([^>]*\ssrc="[^"]+"[^>]*)><\/script>/g, (tag, a) => {
    if (/noModule/i.test(a) || !/\sasync/.test(a)) return tag;
    const keep = attrs(a);
    delete keep.async;
    scripts.push(keep);
    return '';
  });
  if (!scripts.length) continue;
  html = html.replace(/<link rel="preload" as="script"[^>]*\/>/g, '');
  // After load and after the first frame has painted (an idle callback runs
  // once a frame is rendered; Safari has none, so a short timeout there).
  const loader =
    `<script id="defer-hydration">addEventListener('load',function(){` +
    `var go=function(){${JSON.stringify(scripts)}.forEach(function(a){` +
    `var s=document.createElement('script');for(var k in a)s.setAttribute(k,a[k]);` +
    `document.body.appendChild(s)})};` +
    `window.requestIdleCallback?requestIdleCallback(go,{timeout:1000}):setTimeout(go,100)})</script>`;
  html = html.replace('</body>', `${loader}</body>`);
  writeFileSync(file, html);
  count++;
}
console.log(`defer-hydration: ${count} pages`);
