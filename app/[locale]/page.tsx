import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { use } from 'react';

export default function Home({ params }: { params: Promise<{ locale: string }> }) {
  setRequestLocale(use(params).locale);
  const t = useTranslations('home');
  return (
    <main className="mx-auto max-w-3xl px-6 py-24">
      <p className="font-semibold">{t('kicker')}</p>
      <h1 className="mt-2 text-4xl font-extrabold">{t('headline')}</h1>
    </main>
  );
}
