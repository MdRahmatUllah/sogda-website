import { Pause, Play } from 'lucide-react';

// The loop runs on and on, so it has a pause (WCAG 2.2.2). Hover and focus
// pause it too (globals.css). public/site.js toggles `#hero[data-paused]`,
// the label and the icon.
export function HeroPause({ pause, play }: { pause: string; play: string }) {
  return (
    <button
      type="button"
      data-hero-pause
      data-pause={pause}
      data-play={play}
      className="hero-pause absolute -right-3 -bottom-3 grid size-12 place-items-center rounded-full border-2 border-ink bg-paper text-ink shadow-[3px_3px_0_0_var(--color-ink)]"
      aria-label={pause}
    >
      <Pause aria-hidden="true" data-icon="off" className="size-5" />
      <Play aria-hidden="true" data-icon="on" className="hidden size-5" />
    </button>
  );
}
