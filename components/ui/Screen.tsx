import { preload } from 'react-dom';
import config from '@/content/screenshots.json';
import generatedJson from '@/content/screens.generated.json';

type Generated = {
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

function Picture({
  file,
  alt,
  priority,
  sizes,
  className = '',
}: {
  file: string;
  alt: string;
  priority: boolean;
  sizes: string;
  className?: string;
}) {
  const g = generated[file];
  if (!g)
    throw new Error(
      `No screen "${file}": add it to content/screenshots.json, then pnpm sync:screens`,
    );
  const srcSet = (ext: string) =>
    g.widths.map((w) => `/screens/${file}-${w}.${ext} ${w}w`).join(', ');
  // The first view's screen is fetched from <head>, before the parser, CSS
  // and scripts get to it (LCP).
  if (priority) {
    preload(`/screens/${file}-${g.widths[1] ?? g.widths[0]}.avif`, {
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
        src={`/screens/${file}-${g.widths[1] ?? g.widths[0]}.webp`}
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
// height are the golden's, so it never shifts the layout; it loads lazily
// unless it's the page's first view (`priority`). `theme="auto"` follows the
// site's theme: the dark one, when the screen has it, shows in dark mode, and
// being lazy, the hidden one isn't downloaded.
export function Screen({
  id,
  locale,
  theme = 'light',
  priority = false,
  sizes = '(min-width: 1024px) 320px, 70vw',
  className = '',
}: {
  id: string;
  locale: string;
  theme?: ScreenTheme;
  priority?: boolean;
  sizes?: string;
  className?: string;
}) {
  const alt = screenAlt(id, locale);
  if (theme !== 'auto') {
    return (
      <Picture
        file={`${id}-${theme}`}
        alt={alt}
        priority={priority}
        sizes={sizes}
        className={className}
      />
    );
  }
  if (!generated[`${id}-dark`]) {
    return (
      <Picture
        file={`${id}-light`}
        alt={alt}
        priority={priority}
        sizes={sizes}
        className={className}
      />
    );
  }
  return (
    <>
      <Picture
        file={`${id}-light`}
        alt={alt}
        priority={false}
        sizes={sizes}
        className={`only-light ${className}`}
      />
      <Picture
        file={`${id}-dark`}
        alt={alt}
        priority={false}
        sizes={sizes}
        className={`only-dark ${className}`}
      />
    </>
  );
}
