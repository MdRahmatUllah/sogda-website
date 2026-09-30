import facts from '@/content/facts.json';

/**
 * The course's facts (#61): `content/facts.json`, synced from the app at a
 * pinned commit by `pnpm sync:facts`. Every number the site states comes
 * from here, never from a literal in the messages.
 */
export { facts };

/** The facts as ICU arguments; any message may use any of them. */
export const factArgs = {
  words: facts.totals.words,
  topics: facts.totals.grammar_topics,
  steps: facts.totals.steps,
  mocks: facts.totals.mock_exams,
  mocksPerStep: facts.totals.mock_exams_per_step,
  android: facts.app.min_android,
};
