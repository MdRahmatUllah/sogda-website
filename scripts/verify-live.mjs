// `pnpm verify:live [base]`: the launch checks (#13) against the deployed
// site (default https://sogda.de). Exits non-zero if any fails. Then run
// `pnpm lighthouse https://sogda.de/en https://sogda.de/bn` for the budgets.
import { readdirSync } from 'node:fs';

const base = (process.argv[2] ?? 'https://sogda.de').replace(/\/$/, '');
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

// HTTPS, and one canonical host: http and www both go to https://sogda.de.
if (base.startsWith('https://')) {
  const http = await get(`http://${host}/en`, 'manual');
  check(
    'http → https',
    [301, 302, 307, 308].includes(http.status) &&
      http.headers.get('location')?.startsWith('https://'),
    `${http.status} ${http.headers.get('location') ?? ''}`,
  );
  const www = await get(`https://www.${host}/en`, 'manual');
  check(
    'www → canonical host',
    [301, 302, 307, 308].includes(www.status) &&
      new URL(www.headers.get('location') ?? 'x:', base).host === host,
    `${www.status} ${www.headers.get('location') ?? ''}`,
  );
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
