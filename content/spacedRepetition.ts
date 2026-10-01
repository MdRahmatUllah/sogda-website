import { getTranslations } from 'next-intl/server';
import { facts, factArgs } from '@/i18n/facts';
import type { PageContent } from '@/lib/page';

// #73 (MASTER-PLAN W3-5): how Sogda remembers. Every number is the app's
// scheduler as facts.json exports it (DeutschPlan #1182), which the app's own
// fsrs_test.dart checks against its engine.
export const SPACED_REPETITION_SLUG = 'spaced-repetition';

const RATINGS = ['again', 'hard', 'good', 'easy'] as const;

export async function spacedRepetitionPage(locale: string): Promise<PageContent> {
  const t = await getTranslations({ locale, namespace: `pages.${SPACED_REPETITION_SLUG}` });
  const { fsrs } = facts;
  const v = {
    ...factArgs,
    version: fsrs.version,
    retention: fsrs.retention.default,
    min: fsrs.retention.min,
    max: fsrs.retention.max,
    revise: fsrs.plan.revise,
    new: fsrs.plan.new,
    // The Good chain as g1, g2, …: the gaps after each Good in a row.
    ...Object.fromEntries(fsrs.good_days.map((days, i) => [`g${i + 1}`, days])),
  };
  return {
    title: t('title', v),
    description: t('description', v),
    name: t('name', v),
    eyebrow: t('eyebrow', v),
    h1: t('h1', v),
    answer: t('answer', v),
    sections: [
      {
        id: 'what',
        heading: t('what.heading', v),
        paragraphs: [t('what.body', v), t('what.target', v)],
      },
      {
        id: 'gaps',
        heading: t('gaps.heading', v),
        paragraphs: [t('gaps.body', v)],
        list: RATINGS.map((r) =>
          t('gaps.first', { rating: t(`rating.${r}`), days: fsrs.first_days[r] }),
        ),
      },
      {
        id: 'chain',
        heading: t('chain.heading', v),
        paragraphs: [t('chain.body', v), t('chain.lapse', v)],
      },
      {
        id: 'plan',
        heading: t('plan.heading', v),
        paragraphs: [t('plan.body', v), t('plan.wait', v)],
      },
      { id: 'why', heading: t('why.heading', v), paragraphs: [t('why.body', v)] },
    ],
    faq: (['target', 'missed', 'offline', 'grammar'] as const).map((k) => ({
      q: t(`faq.${k}.q`, v),
      a: t(`faq.${k}.a`, v),
    })),
  };
}
