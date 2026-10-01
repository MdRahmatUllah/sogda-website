import { expect, test } from '@playwright/test';
import { execFileSync } from 'node:child_process';

// #131: every committed share card was drawn from today's inputs. No browser:
// `scripts/og.mjs check` compares each card's recorded input hash (its text,
// screen and template) with a fresh one. A failure names the stale cards; run
// `pnpm og` and commit them.
test('#131 every share card was drawn from its current text, screen and template', () => {
  let stale = '';
  try {
    execFileSync(process.execPath, ['scripts/og.mjs', 'check'], { stdio: 'pipe' });
  } catch (e) {
    stale = String((e as { stderr?: Buffer }).stderr ?? e);
  }
  expect(stale).toBe('');
});
