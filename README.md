# sogda.de

The website for **Sogda — the road to a new language**: an offline German course app (A1–C2) for Android, with iPhone coming soon.

- **What we build:** [`docs/BRIEF.md`](docs/BRIEF.md)
- **How we build it** (for the agent and for contributors): [`CLAUDE.md`](CLAUDE.md)
- **The app** lives in [MdRahmatUllah/DeutschPlan](https://github.com/MdRahmatUllah/DeutschPlan).

A static Next.js site, deployed on Vercel at https://sogda.de.

## Develop

Node 22+ and pnpm 10.

```bash
pnpm install
pnpm exec playwright install chromium firefox webkit   # once
pnpm dev                 # http://localhost:3000
pnpm lint && pnpm typecheck
pnpm build               # static export into out/; Next's JS deferred past the first paint
                         # (scripts/defer-hydration.mjs); a CSP per page (scripts/csp.mjs)
pnpm start               # serve out/ on :4173 as Vercel would
pnpm test:e2e            # against out/: Chromium runs everything; Firefox, WebKit, an iPhone,
                         # an iPad and a Pixel run the smoke and QA checks
pnpm lighthouse [urls]   # the CLAUDE.md budgets: every locale of out/, or the URLs given
pnpm sync:brand          # the app's brand kit (pinned), favicons, manifest, Play badges
pnpm sync:screens        # the app's goldens (pinned) as AVIF + WebP into public/screens
pnpm og                  # the Open Graph images, public/og/<locale>.png
pnpm check:launch        # fails while the Impressum has a placeholder
pnpm verify:live [base]  # after deploying: HTTPS, the canonical host, every page, the headers
```

For PRs: `node scripts/shots.mjs <dir> /en` (screenshots at 390/768/1440, light and dark), `node scripts/record.mjs <out.gif> /en [s] [w] [h] [scroll]` (a motion GIF) and `node scripts/frames.mjs /en '#day' 4` (frame times with the CPU throttled). PR images go on the `pr-shots` branch, never on `main`.

- **Store links, contact:** `site.config.ts`. Setting `playStoreUrl` switches on the official badge, the QR code and the JSON-LD `installUrl`.
- **Copy:** `messages/<locale>.json`; the locale list is `i18n/routing.ts`.
- **A new language** (when the app ships one): add it to `i18n/routing.ts`, add `messages/<code>.json` (the app's own wording: `app_<code>.arb` and the glossary), give every screen in `content/screenshots.json` its `alt.<code>`, then `pnpm sync:brand` (its Play badge) and `pnpm og`. Its name goes in `LANGUAGE_NAMES` (`components/ui/Footer.tsx`). For Russian, add Cyrillic to the Inter subset first (`app/fonts.ts`).
- **Legal:** the Impressum's details live only in `content/legal.json`. Until they're all there, the pages show placeholders and a Vercel production build for the sogda.de domain stops (a production build on `*.vercel.app` and previews go on).
- **Security headers:** `vercel.json` sends them, and redirects www to sogda.de. `scripts/csp.mjs` adds each page's `<meta>` Content-Security-Policy, which allows exactly that page's inline scripts by hash, since a static export has no server to add nonces.
- **Brand:** `app/globals.css` holds the tokens (Lagoon, Sun, Ink, Paper, Night, the app's article colours, outline and hard shadow). Components use the semantic colours (`bg`, `fg`, `card`, `line`…), which follow the theme. Dark mode follows the system until the visitor picks, and the pick is remembered.
- **Fonts:** Inter and Noto Sans Bengali, subset from the app's variable fonts (`app/fonts.ts` says how) and self-hosted.
- **Component gallery:** `/en/gallery` in `pnpm dev`. For its axe check on a build: `SOGDA_GALLERY=1 pnpm build && SOGDA_GALLERY=1 pnpm test:e2e -g gallery`. A plain `pnpm build` leaves it out.
- **Screens:** `content/screenshots.json` lists the app screens the site shows: the golden, the themes, and alt text per locale, all at one pinned app `ref`. `pnpm sync:screens` builds AVIF and WebP at 360/540/720/1080 px (tablets 720–2048) and a blur placeholder (`content/screens.generated.json`). It skips anything already built from the same ref, so a second run changes nothing. `<Screen id locale theme priority sizes>` renders one: `theme="auto"` follows the site's theme, and `priority` is only for the first view.
- **Lighthouse** runs the lockfile-pinned Chromium, throws away one warm-up run per page, and judges the median of three: one run on a busy machine can swing LCP by half a second.

### What keeps the page fast (each cost LCP once; don't undo them)
- **Next's JS loads after the first paint** (`scripts/defer-hydration.mjs`). The page reads, looks and moves without it; the JS only adds the theme toggle, the menu's link handler, the pause button and the scroll-linked parts.
- **Below the hero, sections and the footer are `content-visibility: auto`,** so their layout, fonts (Bangla) and screens wait until they're near the view.
- **No natively painted controls** (`appearance: none` on buttons, selects, radios, `<summary>`). In Chrome on Windows a native one held the first paint by about 2 s.
- **Nothing the first view doesn't show may appear later and larger:** a later, bigger paint becomes the LCP. The hero's loop screens stay `display: none` until their turn; the second phone is there from the start.
- **Inter has no optical-size axis** (41 KB instead of 64 KB).
