import { Mark } from './Mark';

// The horizontal lockup, drawn rather than fetched: the mark inline, and the
// wordmark as the brand sets it (Inter ExtraBold, tracking −2 %) in live text,
// so it follows the theme's ink and costs no request before the hero paints.
export function Logo({ locale, label }: { locale: string; label: string }) {
  return (
    <a
      href={`/${locale}`}
      aria-label={label}
      className="flex shrink-0 origin-left items-center gap-2.5 rounded-lg transition-transform duration-200 group-data-scrolled:scale-90"
    >
      <Mark className="size-10" />
      <span
        aria-hidden="true"
        className="text-[1.65rem] leading-none font-extrabold tracking-[-0.02em]"
      >
        Sogda
      </span>
    </a>
  );
}
