import { factArgs, facts } from '@/i18n/facts';
import { contentFromMessages, type PageContent } from '@/lib/page';

// The audience pages (MASTER-PLAN W3-1, W3-7): "Learn German in Bangla" (#69)
// and «немецкий с нуля» / «niemiecki od podstaw» (#75). Each is its own
// `pages.<slug>` namespace in the locales it exists in; every number and the
// words of a first year in Germany come from content/facts.json (DeutschPlan
// #1180). The page's language is the meaning language its words are shown in.
export const AUDIENCE_PAGES = [
  { slug: 'learn-german-in-bangla', locales: ['bn', 'en'] },
  { slug: 'learn-german-from-scratch', locales: ['ru', 'pl'] },
] as const;

type Lang = 'en' | 'bn' | 'ru' | 'pl';

export async function audiencePage(slug: string, locale: string): Promise<PageContent> {
  const lang = locale as Lang;
  const a1 = facts.steps.filter((s) => s.level === 'A1');
  const termin = facts.featured.find((w) => w.german === 'Termin')!;
  const content = await contentFromMessages(locale, slug, {
    ...factArgs,
    questions: facts.mock_exam.questions,
    a1Words: a1.reduce((sum, s) => sum + s.words, 0),
    a1First: a1[0]!.code,
    a1Last: a1.at(-1)!.code,
    terminGuide: termin.guide[lang],
  });
  const germany = content.sections.find((s) => s.id === 'germany')!;
  // The German marked German (#72's `terms`), and the detail in the page's own
  // language only, so a screen reader keeps one voice.
  germany.terms = facts.featured.map((w) => ({
    term: [w.article, w.german].filter(Boolean).join(' '),
    lang: 'de',
    detail: `${w.meaning[lang]} — /${w.guide[lang]}/ · ${w.step}`,
  }));
  return content;
}
