import type { ReactNode } from 'react';

// A generic device (BRIEF §6): an Ink bezel and a hard Lagoon shadow, no
// Apple or Google likeness. The screen keeps the goldens' aspect ratio, so a
// screenshot fills it exactly: phone 1170 × 2532 (portrait), tablet
// 2048 × 1536 (landscape). The frame is a size container, and the bezel and
// corners are in cqw, so they scale with the device, not with the page. A ring
// in the line colour keeps the bezel visible on Night.
// Give it a width (className): a size container can't size to its content.
const KIND = {
  phone: {
    aspect: '1170 / 2532',
    frame: 'rounded-[13cqw] p-[3.5cqw]',
    screen: 'rounded-[9.5cqw]',
  },
  tablet: {
    aspect: '2048 / 1536',
    frame: 'rounded-[4.5cqw] p-[2cqw]',
    screen: 'rounded-[2.6cqw]',
  },
};

export function DeviceFrame({
  kind = 'phone',
  className = '',
  children,
}: {
  kind?: keyof typeof KIND;
  className?: string;
  children: ReactNode;
}) {
  const k = KIND[kind];
  return (
    <div className={`@container ${className}`}>
      <div
        className={`bg-ink shadow-[0_0_0_2px_var(--line),8px_8px_0_0_var(--color-lagoon)] ${k.frame}`}
      >
        <div
          className={`relative overflow-hidden bg-paper ${k.screen}`}
          style={{ aspectRatio: k.aspect }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
