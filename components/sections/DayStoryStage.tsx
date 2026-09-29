'use client';

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';

// Which beat is in the middle of the screen: it sets `data-active` (which
// screen the sticky phone shows) and `--progress` (how far the ring has
// filled). Without JS the phone stays on Today, and every beat still reads.
export function DayStoryStage({ steps, children }: { steps: number; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  useEffect(() => {
    const beats = ref.current?.querySelectorAll<HTMLElement>('[data-beat]') ?? [];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.beat));
        }
      },
      // A band across the middle of the viewport.
      { rootMargin: '-45% 0px -45% 0px' },
    );
    beats.forEach((b) => observer.observe(b));
    return () => observer.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      data-active={active}
      style={{ '--progress': active / (steps - 1) } as CSSProperties}
    >
      {children}
    </div>
  );
}
