'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Children, useEffect, useRef, useState, type ReactNode } from 'react';

// A horizontal, snap-scrolling row (BRIEF §3.5, §3.9): swipe it, scroll it,
// or use the arrow keys once it has focus; dots (and optionally prev/next
// buttons) jump to an item. Without JS it is still a scrollable row.
// `wideClassName` lets a wide screen lay the same items out differently
// (the practice section's fan), with the dots and buttons hidden there.
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
  const track = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);
  // The current item is the one nearest the middle of the track (several
  // can be in view at once on a wide screen).
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const middle = el.getBoundingClientRect().left + el.clientWidth / 2;
      let best = 0;
      let distance = Infinity;
      el.querySelectorAll<HTMLElement>('[data-index]').forEach((item, i) => {
        const box = item.getBoundingClientRect();
        const d = Math.abs(box.left + box.width / 2 - middle);
        if (d < distance) [best, distance] = [i, d];
      });
      setActive(best);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    el.addEventListener('scroll', schedule, { passive: true });
    addEventListener('resize', schedule);
    return () => {
      el.removeEventListener('scroll', schedule);
      removeEventListener('resize', schedule);
      cancelAnimationFrame(frame);
    };
  }, []);
  const go = (i: number) => {
    const el = track.current;
    const item = el?.querySelector<HTMLElement>(
      `[data-index="${Math.max(0, Math.min(items.length - 1, i))}"]`,
    );
    if (el && item)
      el.scrollTo({
        left: item.offsetLeft - el.offsetLeft - (el.clientWidth - item.clientWidth) / 2,
        behavior: 'smooth',
      });
  };
  return (
    <div className={className}>
      <ul
        ref={track}
        tabIndex={0}
        aria-label={label}
        onKeyDown={(e) => {
          const step = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
          if (!step) return;
          e.preventDefault();
          go(active + step);
        }}
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
          <button
            type="button"
            className="icon-btn"
            aria-label={prev}
            onClick={() => go(active - 1)}
          >
            <ChevronLeft aria-hidden="true" />
          </button>
        )}
        {items.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={itemLabel
              .replace('{n}', format(i + 1))
              .replace('{total}', format(items.length))}
            aria-current={i === active || undefined}
            onClick={() => go(i)}
            className="grid size-12 place-items-center"
          >
            <span
              aria-hidden="true"
              className={`block size-3 rounded-full border-2 border-line ${i === active ? 'bg-fg' : ''}`}
            />
          </button>
        ))}
        {buttons && (
          <button
            type="button"
            className="icon-btn"
            aria-label={next}
            onClick={() => go(active + 1)}
          >
            <ChevronRight aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
}
