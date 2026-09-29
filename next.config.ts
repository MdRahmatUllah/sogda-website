import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const config: NextConfig = {
  // Static files only (CLAUDE.md, Hard rules): no server, no API routes.
  output: 'export',
  // next/image can't optimise in a static export; the screenshots are pre-built.
  images: { unoptimized: true },
  poweredByHeader: false,
};

export default withNextIntl(config);
