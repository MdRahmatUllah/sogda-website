import { factArgs, facts } from '@/i18n/facts';
import { contentFromMessages, type PageContent } from '@/lib/page';

// "Learn German in Bangla" (#69, MASTER-PLAN W3-1): the least-served audience.
// The copy is `pages.learn-german-in-bangla` in bn and en; every number and the words of a
// first year in Germany come from content/facts.json (DeutschPlan #1180).
export const BANGLA_LOCALES = ['bn', 'en'] as const;

export async function banglaPage(locale: string): Promise<PageContent> {
  const a1 = facts.steps.filter((s) => s.level === 'A1');
  const termin = facts.featured.find((w) => w.german === 'Termin')!;
  const content = await contentFromMessages(locale, 'learn-german-in-bangla', {
    ...factArgs,
    questions: facts.mock_exam.questions,
    a1Words: a1.reduce((sum, s) => sum + s.words, 0),
    a1First: a1[0]!.code,
    a1Last: a1.at(-1)!.code,
    terminGuide: termin.guide.bn,
  });
  const germany = content.sections.find((s) => s.id === 'germany')!;
  // The German marked German (#72's `terms`), and the detail in the page's own
  // language only, so a screen reader keeps one voice: on /bn the Bangla
  // meaning and guide, on /en the English meaning.
  germany.terms = facts.featured.map((w) => ({
    term: [w.article, w.german].filter(Boolean).join(' '),
    lang: 'de',
    detail:
      locale === 'bn'
        ? `${w.meaning.bn} — /${w.guide.bn}/ · ${w.step}`
        : `${w.meaning.en} · ${w.step}`,
  }));
  return content;
}
