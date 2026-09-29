import type { NextConfig } from 'next';
import { execFileSync } from 'node:child_process';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

// sogda.de can't go live without a complete Impressum (BRIEF §8): Vercel's
// production build stops here while content/legal.json has a placeholder.
// Previews and local builds go on.
if (process.env.VERCEL_ENV === 'production') {
  execFileSync(process.execPath, ['scripts/check-launch.mjs'], { stdio: 'inherit' });
}

const config: NextConfig = {
  // Static files only (CLAUDE.md, Hard rules): no server, no API routes.
  output: 'export',
  // next/image can't optimise in a static export; the screenshots are pre-built.
  images: { unoptimized: true },
  poweredByHeader: false,
  // The CSS (6 KB) goes into the page: no render-blocking request before the
  // hero can paint.
  experimental: { inlineCss: true },
  // The component gallery (app/[locale]/gallery/page.gallery.tsx) exists in
  // `pnpm dev`, and in a build only with SOGDA_GALLERY=1 (its own check).
  pageExtensions: [
    'tsx',
    'ts',
    ...(process.env.NODE_ENV !== 'production' || process.env.SOGDA_GALLERY ? ['gallery.tsx'] : []),
  ],
};

export default withNextIntl(config);
