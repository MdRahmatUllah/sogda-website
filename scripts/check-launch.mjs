// `pnpm check:launch`: the site may go live on sogda.de only with the
// Impressum complete (BRIEF §8, §10). Exits non-zero, naming what's missing.
// next.config.ts runs the same check on Vercel's production builds.
// vatId is optional: not every seller has one.
import { readFileSync } from 'node:fs';

const legal = JSON.parse(readFileSync(new URL('../content/legal.json', import.meta.url), 'utf8'));
const required = ['name', 'street', 'postcodeCity', 'country', 'email', 'phone'];
const missing = required.filter((k) => !legal[k]);
if (missing.length) {
  console.error(
    `launch check: the Impressum still needs ${missing.join(', ')} (content/legal.json)`,
  );
  process.exit(1);
}
console.log('launch check: the Impressum is complete');
