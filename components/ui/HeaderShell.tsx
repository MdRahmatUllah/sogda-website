'use client';

import { useEffect, useState, type ReactNode } from 'react';

// The sticky header. Scrolled, it gains its outline and the logo shrinks by
// transform only: a height change would shift the page (CLS).
export function HeaderShell({ children }: { children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    // The page's JS arrives after load (scripts/defer-hydration.mjs); this
    // marks that it has, for the e2e tests that click what JS drives.
    document.documentElement.dataset.hydrated = '';
    const update = () => setScrolled(window.scrollY > 8);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);
  return (
    <header
      data-scrolled={scrolled || undefined}
      className="group sticky top-0 z-50 border-b-2 border-transparent bg-bg transition-[border-color,box-shadow] duration-200 data-scrolled:border-line data-scrolled:shadow-hard"
    >
      {children}
    </header>
  );
}
