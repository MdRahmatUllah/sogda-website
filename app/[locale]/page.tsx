import { setRequestLocale } from 'next-intl/server';
import { use } from 'react';
import { Faq, FinalCta, Gallery } from '@/components/sections/Closing';
import { DayStory } from '@/components/sections/DayStory';
import { Documents, FeatureGrid, Languages, Looks, Practice } from '@/components/sections/Features';
import { Hero } from '@/components/sections/Hero';
import { Journey } from '@/components/sections/Journey';
import { JsonLd } from '@/components/sections/JsonLd';
import { Memory } from '@/components/sections/Memory';

export default function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  setRequestLocale(locale);
  return (
    <main id="main">
      <JsonLd locale={locale} />
      <Hero locale={locale} />
      <DayStory locale={locale} />
      <Memory locale={locale} />
      <Journey locale={locale} />
      <Practice locale={locale} />
      <Documents locale={locale} />
      <FeatureGrid locale={locale} />
      <Looks locale={locale} />
      <Languages locale={locale} />
      <Gallery locale={locale} />
      <Faq locale={locale} />
      <FinalCta locale={locale} />
    </main>
  );
}
