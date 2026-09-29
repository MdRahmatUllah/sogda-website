'use client';

import { useEffect } from 'react';

// The journey follows the scroll: as the road passes down the screen, the
// traveller moves along it, the stations it has reached light up, and the
// counter ticks the words met so far. Reduced motion (or no JS) keeps the
// finished road the markup draws.
export function JourneyProgress({ total, locale }: { total: number; locale: string }) {
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const road = document.getElementById('journey-road') as SVGPathElement | null;
    const traveller = document.getElementById('journey-traveller');
    const count = document.getElementById('journey-count');
    const svg = road?.ownerSVGElement;
    if (!road || !traveller || !count || !svg) return;
    const stations = [...document.querySelectorAll<SVGGElement>('[data-station]')];
    const length = road.getTotalLength();
    const format = new Intl.NumberFormat(locale);
    let frame = 0;
    const update = () => {
      frame = 0;
      const box = svg.getBoundingClientRect();
      // The traveller is where the road crosses 70 % of the way down the view,
      // so the road's end is reached before the page runs out.
      const p = Math.min(1, Math.max(0, (innerHeight * 0.7 - box.top) / box.height));
      const point = road.getPointAtLength(p * length);
      traveller.setAttribute('transform', `translate(${point.x} ${point.y})`);
      for (const s of stations) s.toggleAttribute('data-lit', p >= Number(s.dataset.at) - 0.005);
      count.textContent = format.format(Math.round(p * total));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    addEventListener('scroll', schedule, { passive: true });
    addEventListener('resize', schedule);
    return () => {
      removeEventListener('scroll', schedule);
      removeEventListener('resize', schedule);
      cancelAnimationFrame(frame);
    };
  }, [total, locale]);
  return null;
}
