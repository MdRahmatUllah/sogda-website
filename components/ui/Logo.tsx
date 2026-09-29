/* eslint-disable @next/next/no-img-element -- a static export serves the brand SVGs as they are */

// The horizontal lockup (Variant A), light or dark with the theme. Its own
// ground is Paper or Night, the header's colour, so it sits flush.
export function Logo({ locale, label }: { locale: string; label: string }) {
  const img =
    'h-11 w-auto transition-transform duration-200 origin-left group-data-scrolled:scale-90';
  return (
    <a href={`/${locale}`} aria-label={label} className="shrink-0 rounded-lg">
      <img
        src="/brand/lockup-horizontal-tiles-light.svg"
        alt=""
        width={574}
        height={190}
        className={`only-light ${img}`}
      />
      <img
        src="/brand/lockup-horizontal-tiles-dark.svg"
        alt=""
        width={574}
        height={190}
        loading="lazy"
        className={`only-dark ${img}`}
      />
    </a>
  );
}
