import { getTranslations } from 'next-intl/server';
import { site } from '@/site.config';

// BRIEF §9: the app as a MobileApplication. No rating and no offer (price)
// until the owner gives them; the Play URL once there is one.
export async function JsonLd({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'meta' });
  const data = {
    '@context': 'https://schema.org',
    '@type': 'MobileApplication',
    name: 'Sogda',
    operatingSystem: 'ANDROID',
    applicationCategory: 'EducationalApplication',
    description: t('description'),
    inLanguage: locale,
    url: `${site.url}/${locale}`,
    image: `${site.url}/og/${locale}.png`,
    ...(site.playStoreUrl ? { installUrl: site.playStoreUrl, downloadUrl: site.playStoreUrl } : {}),
  };
  return (
    <script
      type="application/ld+json"
      // Our own data, serialised: nothing from a visitor reaches it.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\u003c') }}
    />
  );
}
