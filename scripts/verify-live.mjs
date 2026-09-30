// `pnpm verify:live [base]`: the launch checks (#13) against the deployed
// site (default https://www.sogda.de, the canonical host). Exits non-zero if any fails. Then run
// `pnpm lighthouse https://www.sogda.de/en https://www.sogda.de/bn` for the budgets.
import { readdirSync } from 'node:fs';
import { request } from 'node:https';

const base = (process.argv[2] ?? 'https://www.sogda.de').replace(/\/$/, '');
const host = new URL(base).host;
const locales = readdirSync('messages').map((f) => f.replace(/\.json$/, ''));
const results = [];
const check = (name, ok, detail = '') => results.push({ name, ok: Boolean(ok), detail });

async function get(url, redirect = 'follow') {
  try {
    return await fetch(url, { redirect });
  } catch (e) {
    return { ok: false, status: 0, headers: new Headers(), text: async () => String(e) };
  }
}

// HTTPS, and one canonical host: http, and the other host, go to it.
if (base.startsWith('https://')) {
  const http = await get(`http://${host}/en`, 'manual');
  check(
    'http → https',
    [301, 302, 307, 308].includes(http.status) &&
      http.headers.get('location')?.startsWith('https://'),
    `${http.status} ${http.headers.get('location') ?? ''}`,
  );
  // The other host (www ↔ apex) redirects to the canonical one.
  const other = host.startsWith('www.') ? host.slice(4) : `www.${host}`;
  const alt = await get(`https://${other}/en`, 'manual');
  check(
    `${other} → ${host}`,
    [301, 302, 307, 308].includes(alt.status) &&
      new URL(alt.headers.get('location') ?? 'x:', base).host === host,
    `${alt.status} ${alt.headers.get('location') ?? ''}`,
  );

  // The chooser at / (#63): a browser goes on by its first language, with a
  // temporary 307 (a 308 would be cached for everyone); a request with no
  // Accept-Language, a crawler, gets the page. fetch always sends one, so these
  // go through https.request, which sends only what it's given.
  const raw = (headers) =>
    new Promise((resolve) => {
      const req = request(`${base}/`, { headers }, (res) => {
        res.resume();
        resolve({ status: res.statusCode, location: res.headers.location ?? '' });
      });
      req.on('error', (e) => resolve({ status: 0, location: String(e) }));
      req.end();
    });
  const bare = await raw({});
  check('/ without Accept-Language: the chooser', bare.status === 200, String(bare.status));
  for (const [lang, expected] of [
    ['bn-BD,bn;q=0.9,en-US;q=0.8', 'bn'],
    ['en-US,en;q=0.9,bn;q=0.8', 'en'],
    ['pl-PL,pl;q=0.9', 'pl'],
  ]) {
    const r = await raw({ 'accept-language': lang });
    check(
      `/ with ${lang} → /${expected}`,
      r.status === 307 && r.location.endsWith(`/${expected}?from=root`),
      `${r.status} ${r.location}`,
    );
  }
}

// Every page in every locale, and the files around them.
for (const locale of locales) {
  for (const page of ['', '/impressum', '/datenschutz']) {
    const res = await get(`${base}/${locale}${page}`);
    check(`/${locale}${page}`, res.status === 200, String(res.status));
    if (page === '/impressum' && res.status === 200) {
      check(
        `/${locale}/impressum has no placeholder`,
        !(await res.text()).includes('data-placeholder'),
      );
    }
  }
}
for (const path of [
  '/',
  '/sitemap.xml',
  '/robots.txt',
  '/og/en.png',
  '/manifest.webmanifest',
  '/favicon.svg',
]) {
  const res = await get(`${base}${path}`);
  check(path, res.status === 200, String(res.status));
}

// The security headers (vercel.json).
const page = await get(`${base}/en`);
const h = page.headers;
check(
  'Content-Security-Policy',
  h.get('content-security-policy')?.includes("frame-ancestors 'none'"),
);
check('Strict-Transport-Security', h.get('strict-transport-security')?.includes('max-age='));
check('X-Content-Type-Options', h.get('x-content-type-options') === 'nosniff');
check('Referrer-Policy', h.get('referrer-policy') === 'strict-origin-when-cross-origin');
check('Permissions-Policy', h.get('permissions-policy')?.includes('camera=()'));

for (const r of results)
  console.log(`${r.ok ? 'ok  ' : 'FAIL'}  ${r.name}${r.detail ? `  (${r.detail})` : ''}`);
const failed = results.filter((r) => !r.ok).length;
console.log(failed ? `\n${failed} failed` : '\nall passed');
process.exit(failed ? 1 : 0);
