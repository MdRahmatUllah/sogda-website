import { preload } from 'react-dom';
import config from '@/content/screenshots.json';
import generatedJson from '@/content/screens.generated.json';

type Generated = {
  source: string;
  base: string;
  hash: string;
  width: number;
  height: number;
  widths: number[];
  placeholder: string;
};
const generated = generatedJson as Record<string, Generated>;
const screens = Object.fromEntries(config.screens.map((s) => [s.id, s]));

export type ScreenTheme = 'light' | 'dark' | 'glass' | 'auto';

/** The screen's alt text in [locale], English until it's translated. */
export function screenAlt(id: string, locale: string): string {
  const alt = screens[id]?.alt as Record<string, string> | undefined;
  return alt?.[locale] ?? alt?.en ?? '';
}

/** The built variant of a screen: the locale's own capture where the app has
 * one (the Polish and Russian store sets, #66), else the default. */
function variant(id: string, theme: string, locale: string, localize: boolean) {
  return (
    (localize ? generated[`${id}-${theme}@${locale}`] : undefined) ?? generated[`${id}-${theme}`]
  );
}

function Picture({
  g,
  name,
  alt,
  priority,
  sizes,
  className = '',
}: {
  g: Generated | undefined;
  name: string;
  alt: string;
  priority: boolean;
  sizes: string;
  className?: string;
}) {
  if (!g)
    throw new Error(
      `No screen "${name}": add it to content/screenshots.json, then pnpm sync:screens`,
    );
  // Hashed names (#66): a screen that changes gets a new URL, so /screens is
  // cached for good (vercel.json).
  const file = (w: number, ext: string) => `/screens/${g.base}-${w}.${g.hash}.${ext}`;
  const srcSet = (ext: string) => g.widths.map((w) => `${file(w, ext)} ${w}w`).join(', ');
  const second = g.widths[1] ?? g.widths[0]!;
  // The first view's screen is fetched from <head>, before the parser, CSS
  // and scripts get to it (LCP).
  if (priority) {
    preload(file(second, 'avif'), {
      as: 'image',
      type: 'image/avif',
      imageSrcSet: srcSet('avif'),
      imageSizes: sizes,
      fetchPriority: 'high',
    });
  }
  return (
    <picture className={className}>
      {/* AVIF at every width; a browser without AVIF (under 5 %) gets one WebP
          at the second width, which keeps the page's markup light (LCP). */}
      <source type="image/avif" srcSet={srcSet('avif')} sizes={sizes} />
      {/* Pre-built sizes: next/image can't optimise a static export. */}
      <img
        src={file(second, 'webp')}
        width={g.width}
        height={g.height}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
        className="block size-full object-cover"
        style={{ backgroundImage: `url(${g.placeholder})`, backgroundSize: 'cover' }}
      />
    </picture>
  );
}

// A real app screen (BRIEF §6), from content/screenshots.json. Width and
// height are the source's (every one in the goldens' shape), so it never
// shifts the layout; it loads lazily unless it's the page's first view
// (`priority`). Where the app has a capture in the page's language (#66) that
// one shows. `theme="auto"` follows the site's theme: the dark one, when the
// screen has it, shows in dark mode, and being lazy, the hidden one isn't
// downloaded. A capture in the page's language wins over a dark one in
// another: the app in your language matters more than its theme.
// `localize={false}` keeps the default (the looks section compares themes,
// so all three must be the same app).
export function Screen({
  id,
  locale,
  theme = 'light',
  priority = false,
  localize = true,
  sizes = '(min-width: 1024px) 320px, 70vw',
  className = '',
}: {
  id: string;
  locale: string;
  theme?: ScreenTheme;
  priority?: boolean;
  localize?: boolean;
  sizes?: string;
  className?: string;
}) {
  const alt = screenAlt(id, locale);
  const one = (t: string, cls: string, prio: boolean) => (
    <Picture
      g={variant(id, t, locale, localize)}
      name={`${id}-${t}`}
      alt={alt}
      priority={prio}
      sizes={sizes}
      className={cls}
    />
  );
  if (theme !== 'auto') return one(theme, className, priority);
  const own = localize && Boolean(generated[`${id}-light@${locale}`]);
  const ownDark = localize && Boolean(generated[`${id}-dark@${locale}`]);
  if (!generated[`${id}-dark`] || (own && !ownDark)) return one('light', className, priority);
  return (
    <>
      {one('light', `only-light ${className}`, false)}
      {one('dark', `only-dark ${className}`, false)}
    </>
  );
}
