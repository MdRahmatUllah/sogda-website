import type { CSSProperties, ReactNode } from 'react';

// public/site.js tracks which beat is in the middle of the screen: it sets
// `data-active` (which screen the sticky phone shows) and `--progress` (how
// far the ring has filled). Without JS the phone stays on Today, and every
// beat still reads.
export function DayStoryStage({ children }: { children: ReactNode }) {
  return (
    <div data-stage data-active={0} style={{ '--progress': 0 } as CSSProperties}>
      {children}
    </div>
  );
}
