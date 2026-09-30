// `pnpm sync:facts [app-commit]`: the course's facts (#61), which the app's
// tools/export_site_facts.py writes (DeutschPlan #1174), fetched at a pinned
// app commit into content/facts.json. Never fetched at build time, so the
// Vercel build doesn't depend on GitHub. With no commit, it re-syncs the one
// already pinned.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { format, resolveConfig } from 'prettier';

const OUT = 'content/facts.json';
const SCHEMA = 1;

const ref =
  process.argv[2] ?? (existsSync(OUT) ? JSON.parse(readFileSync(OUT, 'utf8')).app_ref : undefined);
if (!/^[0-9a-f]{40}$/.test(ref ?? '')) {
  throw new Error('usage: pnpm sync:facts <the app commit, 40 hex characters>');
}
const url = `https://raw.githubusercontent.com/MdRahmatUllah/DeutschPlan/${ref}/docs/05-dev-guide/site-facts.json`;
const res = await fetch(url);
if (!res.ok) throw new Error(`site-facts.json at ${ref}: HTTP ${res.status}`);
const facts = await res.json();
if (facts.schema !== SCHEMA) {
  throw new Error(`site-facts.json has schema ${facts.schema}; this site reads ${SCHEMA}`);
}
// Formatted as the repo formats it, so `pnpm lint` passes on a fresh sync.
const json = JSON.stringify({ app_ref: ref, ...facts });
writeFileSync(OUT, await format(json, { ...(await resolveConfig(OUT)), filepath: OUT }));
console.log(
  `${OUT}: ${facts.totals.words} words, content ${facts.content_version}, app ${ref.slice(0, 8)}`,
);
