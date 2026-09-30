import { getTranslations } from 'next-intl/server';
import { facts } from '@/i18n/facts';
import type { PageContent } from '@/lib/page';

// The 12 level pages (#72, MASTER-PLAN W3-4): one per step of the course,
// built from content/facts.json (#61) and the `levelPages` messages, so no
// number is typed by hand. They exist only in the four meaning languages:
// each shows its words' meanings in the page's language, and the course has
// no German meanings for /de.
export const LEVEL_LOCALES = ['en', 'bn', 'ru', 'pl'] as const;
type Lang = (typeof LEVEL_LOCALES)[number];

/** A1.1 → a1-1: ASCII, and the same in every locale. */
export const levelSlug = (code: string) => code.toLowerCase().replace('.', '-');

const byLevel = (table: Record<string, number>, level: string) => table[level]!;

export async function levelPage(locale: string, code: string): Promise<PageContent> {
  const lang = locale as Lang;
  const t = await getTranslations({ locale, namespace: 'levelPages' });
  const at = facts.steps.findIndex((s) => s.code === code);
  const step = facts.steps[at]!;
  const next = facts.steps[at + 1];
  const level = facts.steps.filter((s) => s.level === step.level);
  const paper = facts.mock_exam;
  const v = {
    step: step.code,
    level: step.level,
    ord: step.ord,
    steps: facts.totals.steps,
    words: step.words,
    topics: step.grammar_topics,
    half: step.code === level[0]!.code ? 'first' : 'second',
    mocksPerStep: facts.totals.mock_exams_per_step,
    questions: paper.questions,
    points: paper.points,
    sample: step.sample.length,
    levelWords: level.reduce((sum, s) => sum + s.words, 0),
    levelTopics: level.reduce((sum, s) => sum + s.grammar_topics, 0),
    first: level[0]!.code,
    second: level.at(-1)!.code,
    next: next?.code ?? '',
    nextWords: next?.words ?? 0,
  };
  const section = (id: string) => t(`section.${id}`);
  return {
    title: t('title', v),
    description: t('description', v),
    name: t('name', v),
    eyebrow: t('eyebrow', v),
    h1: t('h1', v),
    answer: t('answer', v),
    sections: [
      {
        id: 'level',
        heading: t('levelHeading', v),
        paragraphs: [t(`cefr.${step.level}`), t('cefrNote')],
      },
      {
        id: 'grammar',
        heading: t('grammarHeading', v),
        paragraphs: [],
        // Bangla has no grammar names in the course, so it shows English's,
        // as the app does.
        list: step.grammar.map((g) => (g.topic as Record<string, string>)[lang] ?? g.topic.en),
      },
      {
        id: 'exam',
        heading: t('examHeading', v),
        paragraphs: [t('examBody', v)],
        list: paper.sections.map((s) =>
          s.id === 'writing'
            ? t('writing', {
                name: section(s.id),
                words: byLevel(paper.writing_min_words, step.level),
              })
            : s.id === 'speaking'
              ? t('speaking', {
                  name: section(s.id),
                  seconds: byLevel(paper.speaking_seconds, step.level),
                })
              : t('items', { name: section(s.id), n: s.items }),
        ),
      },
      {
        id: 'words',
        heading: t('wordsHeading', v),
        paragraphs: [t('wordsBody', v)],
        terms: step.sample.map((w) => ({
          term: [w.article, w.german].filter(Boolean).join(' ') + (w.forms ? ` · ${w.forms}` : ''),
          lang: 'de',
          detail: `${(w.meaning as Record<string, string>)[lang]} — /${(w.guide as Record<string, string>)[lang]}/`,
        })),
      },
    ],
    faq: [
      { q: t('faq.official.q', v), a: t('faq.official.a', v) },
      { q: t('faq.count.q', v), a: t('faq.count.a', v) },
      next
        ? { q: t('faq.next.q', v), a: t('faq.next.a', v) }
        : { q: t('faq.last.q', v), a: t('faq.last.a', v) },
    ],
  };
}
