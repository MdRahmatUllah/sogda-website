import { setRequestLocale } from 'next-intl/server';
import { use } from 'react';
import { DayStory } from '@/components/sections/DayStory';
import { Hero } from '@/components/sections/Hero';
import { Journey } from '@/components/sections/Journey';
import { Memory } from '@/components/sections/Memory';

export default function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  setRequestLocale(locale);
  return (
    <main id="main">
      <Hero locale={locale} />
      <DayStory locale={locale} />
      <Memory locale={locale} />
      <Journey locale={locale} />
    </main>
  );
}
