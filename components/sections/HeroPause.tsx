'use client';

import { Pause, Play } from 'lucide-react';
import { useState } from 'react';

// The loop runs on and on, so it has a pause (WCAG 2.2.2). Hover and focus
// pause it too (globals.css).
export function HeroPause({ pause, play }: { pause: string; play: string }) {
  const [paused, setPaused] = useState(false);
  return (
    <button
      type="button"
      className="hero-pause absolute -right-3 -bottom-3 grid size-12 place-items-center rounded-full border-2 border-ink bg-paper text-ink shadow-[3px_3px_0_0_var(--color-ink)]"
      aria-label={paused ? play : pause}
      onClick={() => {
        setPaused(!paused);
        document.getElementById('hero')?.toggleAttribute('data-paused', !paused);
      }}
    >
      {paused ? (
        <Play aria-hidden="true" className="size-5" />
      ) : (
        <Pause aria-hidden="true" className="size-5" />
      )}
    </button>
  );
}
