import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Children, type ReactNode } from 'react';

// A horizontal, snap-scrolling row (BRIEF §3.5, §3.9): swipe it, scroll it,
// or use the arrow keys once it has focus; dots (and optionally prev/next
// buttons) jump to an item (public/site.js). Without JS it is still a
// scrollable row. `wideClassName` lets a wide screen lay the same items out
// differently (the practice section's fan), with the dots and buttons hidden.
export function SnapCarousel({
  locale,
  label,
  itemLabel,
  prev,
  next,
  buttons = false,
  wideControls = true,
  className = '',
  wideClassName = '',
  children,
}: {
  /** For the dots' numbers (Bangla digits in Bangla). */
  locale: string;
  label: string;
  /** Each dot's label, with {n} and {total}: "Screen {n} of {total}". */
  itemLabel: string;
  /** Hide the dots and buttons on wide screens (where `wideClassName` lays
   * the items out without scrolling). */
  wideControls?: boolean;
  prev?: string;
  next?: string;
  buttons?: boolean;
  className?: string;
  wideClassName?: string;
  children: ReactNode;
}) {
  const items = Children.toArray(children);
  const format = (n: number) => new Intl.NumberFormat(locale).format(n);
  return (
    <div data-carousel className={className}>
      <ul
        data-track
        tabIndex={0}
        aria-label={label}
        className={`flex snap-x snap-mandatory gap-6 overflow-x-auto overscroll-x-contain px-[max(1rem,calc(50%-9rem))] py-4 [scrollbar-width:none] ${wideClassName}`}
      >
        {items.map((item, i) => (
          <li key={i} data-index={i} className="shrink-0 snap-center">
            {item}
          </li>
        ))}
      </ul>
      <div
        className={`mt-4 flex items-center justify-center gap-2 ${wideControls ? '' : 'lg:hidden'}`}
      >
        {buttons && (
          <button type="button" data-go="-1" className="icon-btn" aria-label={prev}>
            <ChevronLeft aria-hidden="true" />
          </button>
        )}
        {items.map((_, i) => (
          <button
            key={i}
            type="button"
            data-dot={i}
            aria-label={itemLabel
              .replace('{n}', format(i + 1))
              .replace('{total}', format(items.length))}
            aria-current={i === 0 || undefined}
            className="grid size-12 place-items-center"
          >
            <span
              aria-hidden="true"
              className={`block size-3 rounded-full border-2 border-line ${i === 0 ? 'bg-fg' : ''}`}
            />
          </button>
        ))}
        {buttons && (
          <button type="button" data-go="1" className="icon-btn" aria-label={next}>
            <ChevronRight aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
}
