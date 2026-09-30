import type { ReactNode } from 'react';

// public/site.js marks the box `data-inview` the first time it scrolls into
// view, which starts its CSS entrance (globals.css). Before the script runs,
// without JS, and with reduced motion, the CSS shows the finished state.
export function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div data-reveal className={className}>
      {children}
    </div>
  );
}
