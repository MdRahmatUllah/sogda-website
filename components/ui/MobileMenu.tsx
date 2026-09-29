'use client';

import { X } from 'lucide-react';

type Link = { href: string; label: string };

// The narrow-screen menu: a native popover, so opening, Esc, light dismiss
// and the button's expanded state come from the browser. Choosing a link
// closes it.
export function MobileMenu({
  links,
  label,
  closeLabel,
}: {
  links: Link[];
  label: string;
  closeLabel: string;
}) {
  return (
    <div
      id="menu"
      popover="auto"
      className="inset-x-0 top-16 bottom-auto m-0 w-full border-y-2 border-line bg-bg p-4 text-fg shadow-hard lg:hidden"
    >
      <nav aria-label={label}>
        <ul
          className="grid gap-1"
          onClick={(e) => {
            if ((e.target as HTMLElement).closest('a')) {
              document.getElementById('menu')?.hidePopover();
            }
          }}
        >
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="flex min-h-12 items-center rounded-xl px-4 text-lg font-semibold hover:bg-well"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <button
        type="button"
        popoverTarget="menu"
        popoverTargetAction="hide"
        className="icon-btn absolute top-3 right-3"
        aria-label={closeLabel}
      >
        <X aria-hidden="true" />
      </button>
    </div>
  );
}
