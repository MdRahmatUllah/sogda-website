import { facts } from '@/i18n/facts';
import { routing } from '@/i18n/routing';
import { site } from '@/site.config';

export const dynamic = 'force-static';

// `/llms.txt` (#61): what Sogda is, in plain sentences, and where each page
// is. The numbers come from content/facts.json and the rest from BRIEF §4.
// It's a cheap by-product: the big engines rarely fetch it (#55), and the same
// facts are on the pages themselves.
export function GET() {
  const n = (x: number) => x.toLocaleString('en');
  const english = new Intl.DisplayNames(['en'], { type: 'language' });
  const list = (codes: string[]) =>
    new Intl.ListFormat('en-GB', { type: 'disjunction' }).format(codes.map((c) => english.of(c)!));
  const { totals, mock_exam: paper } = facts;
  const meanings = list(facts.languages.meaning.map((l) => l.code));
  const first = facts.steps[0]!.code;
  const last = facts.steps.at(-1)!.code;

  const text = `# Sogda

> Sogda is an offline German course app for Android: A1 to C2 in ${totals.steps} steps, with ${n(totals.words)} words, ${totals.grammar_topics} grammar topics and ${totals.mock_exams} mock exams, and meanings and a pronunciation guide in ${meanings}, no account needed.

Sogda here is a German course app. It is unrelated to the historical region Sogdia and to any company named Sogda.

## Facts
- The course: ${totals.steps} steps from ${first} to ${last}, the CEFR levels A1 to C2, built around the exams.
- ${n(totals.words)} words, each with examples, its article and forms where it has them, and a pronunciation guide in the meaning language's letters or an English respelling.
- ${totals.grammar_topics} grammar topics, each with its rule and a short practice.
- Meanings in ${meanings}: one language, or two shown together. In Russian and Polish, the example sentences and grammar rules too.
- A daily plan: revise what is due, learn new words, practise a grammar topic and sentences. Spaced revision with FSRS.
- ${totals.mock_exams_per_step} mock exams per step (${totals.mock_exams} in all): ${paper.questions} questions plus a writing and a speaking task, ${paper.points} points, with a result by section. They are generated from the step's words and grammar, not official Goethe or telc papers.
- Fully offline, with no account; progress stays on the phone.
- Android ${facts.app.min_android} or newer (${facts.app.package}), version ${facts.app.version}. The app itself is in ${list(facts.languages.app_ui)}. iPhone: coming soon.

## Pages
${routing.locales
  .map(
    (l) =>
      `- [${new Intl.DisplayNames([l], { type: 'language' }).of(l)}](${site.url}/${l}): the course, a study day, the exams and the FAQ`,
  )
  .join('\n')}

## Legal
- [Impressum](${site.url}/de/impressum)
- [Datenschutzerklärung](${site.url}/de/datenschutz)
`;
  return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
