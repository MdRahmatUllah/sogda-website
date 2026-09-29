'use client';

import { useEffect, useRef, type ReactNode } from 'react';

// Marks its box `data-inview` the first time it scrolls into view, which
// starts its CSS entrance (globals.css). Before hydration, without JS, and
// with reduced motion, the CSS shows the finished state instead.
export function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          el.dataset.inview = '';
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} data-reveal className={className}>
      {children}
    </div>
  );
}
