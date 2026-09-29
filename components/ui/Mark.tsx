// The mark (BRIEF §5), from the brand kit's icon-tiles-full.svg and
// icon-road-full.svg, path for path, inline: no request, and it can move.
// - Variant A, tiles: the logo, everywhere.
// - Variant B, `road`: tiles + the Silk Road, for large marketing use only
//   (never below 48 px).
// - `flip`: on load the front tile flips once, from the letter you know (a,
//   the back tile's own glyph) to the new language's (Ä). Reduced motion: Ä.
const A =
  'M326 559Q429 559 485.5 509.0Q542 459 542 363V0H425L392 74H388Q353 29 314.0 9.5Q275 -10 206 -10Q134 -10 86.0 33.0Q38 76 38 165Q38 252 100.0 295.0Q162 338 282 343L373 346V359Q373 402 353.0 420.0Q333 438 297 438Q262 438 222.5 426.0Q183 414 144 397L95 510Q140 534 198.0 546.5Q256 559 326 559ZM323 248Q260 245 235.0 226.5Q210 208 210 173Q210 141 228.0 126.5Q246 112 275 112Q316 112 345.0 137.0Q374 162 374 206V250Z';
const A_UMLAUT =
  'M521 0 476 152H233L187 0H0L243 717H463L708 0ZM397 432Q392 448 383.5 481.0Q375 514 366.5 548.0Q358 582 354 604Q349 581 341.5 548.5Q334 516 326.0 484.5Q318 453 312 432L271 294H438ZM165 853Q165 890 187.0 907.0Q209 924 241 924Q271 924 294.0 907.0Q317 890 317 853Q317 817 294.0 800.0Q271 783 241 783Q209 783 187.0 800.0Q165 817 165 853ZM390 853Q390 890 411.5 907.0Q433 924 466 924Q496 924 519.0 907.0Q542 890 542 853Q542 817 519.0 800.0Q496 783 466 783Q433 783 411.5 800.0Q390 817 390 853Z';
const ROUTE = 'M31 40 C 34 24, 62 20, 74 40';
const tile = { stroke: '#15121F', strokeWidth: 2.6, strokeLinejoin: 'round' as const };

export function Mark({
  road = false,
  flip = false,
  className = '',
}: {
  road?: boolean;
  flip?: boolean;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 108 108" className={className} aria-hidden="true">
      <rect width="108" height="108" rx="22" fill="#00C2B2" />
      {road && (
        <>
          <path
            d={ROUTE}
            fill="none"
            stroke="#15121F"
            strokeWidth="3.4"
            strokeLinecap="round"
            strokeDasharray="0.1 6.2"
            transform="translate(1.6 1.6)"
          />
          <path
            d={ROUTE}
            fill="none"
            stroke="#FFC61A"
            strokeWidth="3.4"
            strokeLinecap="round"
            strokeDasharray="0.1 6.2"
          />
        </>
      )}
      <g transform="translate(44.5 49.5) rotate(-10)">
        <rect
          x="-14"
          y="-14"
          width="28"
          height="28"
          rx="5.5"
          fill="#15121F"
          {...tile}
          transform="translate(2.4 2.4)"
        />
        <rect x="-14" y="-14" width="28" height="28" rx="5.5" fill="#FFF8EE" {...tile} />
        <path fill="#15121F" transform="translate(-7.64 7.24) scale(0.0264 -0.0264)" d={A} />
      </g>
      <g transform="translate(62.5 59.5) rotate(7)">
        <g className={flip ? 'mark-flip' : undefined}>
          <rect
            x="-14"
            y="-14"
            width="28"
            height="28"
            rx="5.5"
            fill="#15121F"
            {...tile}
            transform="translate(2.4 2.4)"
          />
          <rect x="-14" y="-14" width="28" height="28" rx="5.5" fill="#FFC61A" {...tile} />
          {flip && (
            <path
              className="mark-flip-from"
              fill="#15121F"
              transform="translate(-7.64 7.24) scale(0.0264 -0.0264)"
              d={A}
            />
          )}
          <path
            className={flip ? 'mark-flip-to' : undefined}
            fill="#15121F"
            transform="translate(-7.47 10.25) scale(0.0211 -0.0211)"
            d={A_UMLAUT}
          />
        </g>
      </g>
    </svg>
  );
}
