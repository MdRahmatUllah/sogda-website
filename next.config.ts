import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const config: NextConfig = {
  // Static files only (CLAUDE.md, Hard rules): no server, no API routes.
  output: 'export',
  // next/image can't optimise in a static export; the screenshots are pre-built.
  images: { unoptimized: true },
  poweredByHeader: false,
  // The component gallery (app/[locale]/gallery/page.gallery.tsx) exists in
  // `pnpm dev`, and in a build only with SOGDA_GALLERY=1 (its own check).
  pageExtensions: [
    'tsx',
    'ts',
    ...(process.env.NODE_ENV !== 'production' || process.env.SOGDA_GALLERY ? ['gallery.tsx'] : []),
  ],
};

export default withNextIntl(config);
