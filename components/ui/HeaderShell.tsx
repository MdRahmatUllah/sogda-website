import type { ReactNode } from 'react';

// The sticky header. Scrolled, it gains its outline and the logo shrinks by
// transform only: a height change would shift the page (CLS). public/site.js
// sets `data-scrolled`.
export function HeaderShell({ children }: { children: ReactNode }) {
  return (
    <header
      data-header
      className="group sticky top-0 z-50 border-b-2 border-transparent bg-bg transition-[border-color,box-shadow] duration-200 data-scrolled:border-line data-scrolled:shadow-hard"
    >
      {children}
    </header>
  );
}
