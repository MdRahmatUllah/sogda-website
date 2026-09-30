import type { MetadataRoute } from 'next';
import { site } from '@/site.config';

export const dynamic = 'force-static';

// One group for every crawler, AI ones included (#55): a named group would
// replace it for that bot, so none is added. No `host`: only Yandex read it,
// and it's deprecated (#58).
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
