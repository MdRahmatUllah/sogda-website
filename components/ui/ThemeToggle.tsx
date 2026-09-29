'use client';

import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

// Light or dark: the system's until the visitor picks, then theirs,
// remembered (the layout's inline script applies it before first paint).
export function ThemeToggle({ label }: { label: string }) {
  const [dark, setDark] = useState<boolean | null>(null);
  useEffect(() => {
    const set = document.documentElement.dataset.theme;
    setDark(set ? set === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches);
  }, []);
  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.dataset.theme = next ? 'dark' : 'light';
    try {
      localStorage.setItem('theme', next ? 'dark' : 'light');
    } catch {
      // Storage blocked: the pick lasts for this page only.
    }
  };
  return (
    <button
      type="button"
      className="icon-btn"
      aria-label={label}
      aria-pressed={dark ?? false}
      onClick={toggle}
    >
      {dark ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
    </button>
  );
}
