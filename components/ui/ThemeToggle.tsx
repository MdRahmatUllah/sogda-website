import { Moon, Sun } from 'lucide-react';

// Light or dark: the system's until the visitor picks, then theirs,
// remembered (the layout's inline script applies it before first paint).
// public/site.js sets `aria-pressed` and swaps the icons.
export function ThemeToggle({ label }: { label: string }) {
  return (
    <button
      type="button"
      data-theme-toggle
      className="icon-btn"
      aria-label={label}
      aria-pressed="false"
    >
      <Moon aria-hidden="true" data-icon="off" />
      <Sun aria-hidden="true" data-icon="on" className="hidden" />
    </button>
  );
}
