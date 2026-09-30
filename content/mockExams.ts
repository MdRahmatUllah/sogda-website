import { getTranslations } from 'next-intl/server';
import { factArgs, facts } from '@/i18n/facts';
import type { PageContent } from '@/lib/page';

// The mock exams page (#71, MASTER-PLAN W3-3): what a Sogda paper holds, by
// level, and how it compares with the Goethe and telc exams. Every number
// comes from content/facts.json (#61); the copy is the `pages.mock-exams`
// namespace. What it says about the real exams stays at their skills and
// names (from the course's own exam targets); their durations and points are
// theirs to publish, and move.
export const MOCK_EXAMS_SLUG = 'mock-exams';
export const MOCK_EXAMS_LOCALES = ['en', 'de', 'pl', 'ru', 'bn'] as const;

export async function mockExamsPage(locale: string): Promise<PageContent> {
  const t = await getTranslations({ locale, namespace: `pages.${MOCK_EXAMS_SLUG}` });
  const paper = facts.mock_exam;
  const v = {
    ...factArgs,
    questions: paper.questions,
    tasks: paper.tasks,
    points: paper.points,
    first: facts.steps[0]!.code,
    last: facts.steps.at(-1)!.code,
  };
  const levels = facts.levels.map((level) => ({
    level: level.code,
    target: level.exam_target,
    words: paper.writing_min_words[level.code as keyof typeof paper.writing_min_words],
    seconds: paper.speaking_seconds[level.code as keyof typeof paper.speaking_seconds],
  }));
  return {
    title: t('title', v),
    description: t('description', v),
    name: t('name', v),
    eyebrow: t('eyebrow', v),
    h1: t('h1', v),
    answer: t('answer', v),
    sections: [
      {
        id: 'paper',
        heading: t('paper.heading', v),
        paragraphs: [t('paper.body', v)],
        // The paper's sections in the app's order (BR-EXAM-03), with their
        // counts: writing and speaking are one task each.
        list: paper.sections.map((s) =>
          s.points > 1
            ? t('paper.task', { name: t(`section.${s.id}`), points: s.points })
            : t('paper.items', { name: t(`section.${s.id}`), n: s.items }),
        ),
      },
      {
        id: 'levels',
        heading: t('levels.heading', v),
        paragraphs: [t('levels.body', v)],
        list: levels.map((l) => t('levels.item', l)),
      },
      {
        id: 'compare',
        heading: t('compare.heading', v),
        paragraphs: [t('compare.skills', v), t('compare.reading', v), t('compare.official', v)],
      },
    ],
    faq: (['official', 'count', 'offline', 'reading'] as const).map((k) => ({
      q: t(`faq.${k}.q`, v),
      a: t(`faq.${k}.a`, v),
    })),
  };
}
