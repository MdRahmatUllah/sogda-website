# sogda.de

The website for **Sogda — the road to a new language**: an offline German course app (A1–C2) for Android, with iPhone coming soon.

- **What we build:** [`docs/BRIEF.md`](docs/BRIEF.md)
- **How we build it** (for the agent and for contributors): [`CLAUDE.md`](CLAUDE.md)
- **The app** lives in [MdRahmatUllah/DeutschPlan](https://github.com/MdRahmatUllah/DeutschPlan).

A static Next.js site, deployed on Vercel at https://sogda.de.

## Branches

- **`dev`:** where every change lands, one PR per issue (`--base dev`). Vercel doesn't deploy it: only `main` deploys (`vercel.json`, `git.deploymentEnabled`).
- **`main`:** production, https://www.sogda.de (sogda.de redirects to it). It changes only when the owner merges `dev` into it, or asks.

## Develop

Node 22+ and pnpm 10.

```bash
pnpm install
pnpm exec playwright install chromium firefox webkit   # once
pnpm dev                 # http://localhost:3000
pnpm lint && pnpm typecheck
pnpm build               # static export into out/, without Next's client JS
                         # (scripts/strip-next.mjs); a CSP per page (scripts/csp.mjs)
pnpm start               # serve out/ on :4173 as Vercel would
pnpm test:e2e            # against out/: Chromium runs everything; Firefox, WebKit, an iPhone,
                         # an iPad and a Pixel run the smoke and QA checks
pnpm lighthouse [urls]   # the CLAUDE.md budgets: every locale of out/, or the URLs given
pnpm sync:brand          # the app's brand kit (pinned), favicons, manifest, Play badges
pnpm sync:screens        # the app's goldens (pinned) as AVIF + WebP into public/screens
pnpm og                  # the Open Graph images, public/og/<locale>.png; tests/og.spec.ts fails on a stale one
pnpm check:launch        # fails while the Impressum has a placeholder
pnpm verify:live [base]  # after deploying: HTTPS, the canonical host, every page, the headers
```

For PRs: `node scripts/shots.mjs <dir> /en` (screenshots at 390/768/1440, light and dark), `node scripts/record.mjs <out.gif> /en [s] [w] [h] [scroll]` (a motion GIF) and `node scripts/frames.mjs /en '#day' 4` (frame times with the CPU throttled). PR images go on the `pr-shots` branch, never on `main`.

- **Store links, contact:** `site.config.ts`. Setting `playStoreUrl` switches on the official badge, the QR code and the JSON-LD `installUrl`.
- **Copy:** `messages/<locale>.json`; the locale list is `i18n/routing.ts`.
- **A new language** (when the app ships one): add it to `i18n/routing.ts`, add `messages/<code>.json` (the app's own wording: `app_<code>.arb` and the glossary), give every screen in `content/screenshots.json` its `alt.<code>`, then `pnpm sync:brand` (its Play badge) and `pnpm og`. Its name goes in `LANGUAGE_NAMES` (`components/ui/Footer.tsx`). For Russian, add Cyrillic to the Inter subset first (`app/fonts.ts`).
- **A new content page** (#68, MASTER-PLAN W3):
  1. **Register it:** one entry in `content/pages.ts`, with its `slug` (`/<locale>/<slug>`, ASCII and the same in every locale), the `locales` it exists in (hreflang, the sitemap and the language switch follow them), and `content: (l) => contentFromMessages(l, '<slug>', values)`.
  2. **Write its copy:** a `pages.<slug>` namespace in each of those locales' `messages/<locale>.json` (the shape is in `lib/page.ts`):
     - `title`, `description`, `name`, `eyebrow`?, `h1`;
     - **`answer`: two self-contained sentences that answer the page's query, with the numbers**;
     - `sections` and `faq`.

     Numbers are ICU arguments (`{words}`) filled from `values`, never literals.
  3. **Run `pnpm og`** for its share cards.
  4. **The template does the rest:** breadcrumbs, the graph (`WebPage` → `/#app`, `BreadcrumbList`, `FAQPage`), the store CTA and links to the other pages. `/<locale>/template-sample` shows every part (it's built in `pnpm dev`, with `SOGDA_GALLERY=1`, and while no real page exists).
- **Legal:** the Impressum's details live only in `content/legal.json`. Until they're all there, the pages show placeholders and a Vercel production build for the sogda.de domain stops (a production build on `*.vercel.app` and previews go on).
- **Security headers:** `vercel.json` sends them. The www ↔ sogda.de redirect is set in Vercel's domain settings only (sogda.de primary, www redirecting to it): a second redirect in `vercel.json` made a loop with them. `scripts/csp.mjs` adds each page's `<meta>` Content-Security-Policy, which allows exactly that page's inline scripts by hash, since a static export has no server to add nonces.
- **Brand:** `app/globals.css` holds the tokens (Lagoon, Sun, Ink, Paper, Night, the app's article colours, outline and hard shadow). Components use the semantic colours (`bg`, `fg`, `card`, `line`…), which follow the theme. Dark mode follows the system until the visitor picks, and the pick is remembered.
- **Fonts:** Inter and Noto Sans Bengali, subset from the app's variable fonts (`app/fonts.ts` says how) and self-hosted.
- **Component gallery:** `/en/gallery` in `pnpm dev`. For its axe check on a build: `SOGDA_GALLERY=1 pnpm build && SOGDA_GALLERY=1 pnpm test:e2e -g gallery`. A plain `pnpm build` leaves it out.
- **Screens:** `content/screenshots.json` lists the app screens the site shows: the golden, the themes, and alt text per locale, all at one pinned app `ref`. `pnpm sync:screens` builds AVIF and WebP at 360/540/720/1080 px (tablets 720–2048) and a blur placeholder (`content/screens.generated.json`). It skips anything already built from the same ref, so a second run changes nothing. `<Screen id locale theme priority sizes>` renders one: `theme="auto"` follows the site's theme, and `priority` is only for the first view.
- **Lighthouse** runs the lockfile-pinned Chromium, throws away one warm-up run per page, and judges the median of three: one run on a busy machine can swing LCP by half a second. Its Chrome runs with `--disable-gpu-vsync --disable-frame-rate-limit`: headless Chrome has no display, and on Windows its frame clock drops to 1 Hz about 0.4 s in, so a page ready at 0.5 s first paints at about 1.15 s, which no phone does (#22).

### What keeps the page fast (each cost LCP once; don't undo them)
- **No React in the browser** (#22). Every component renders on the server only; the few behaviours (the theme toggle, the menus' links, the hero's pause, the reveals, the day story, the journey and the carousels) are `public/site.js`, about 2 KB gzip, keyed on data attributes in the markup. `scripts/strip-next.mjs` removes Next's runtime and its RSC payload from every page after the build: hydration blocked a phone's main thread for 150–350 ms, and the payload doubled the HTML. A new behaviour goes in `site.js`; a `'use client'` component would render but never run.
- **Below the hero, sections and the footer are `content-visibility: auto`,** so their layout, fonts (Bangla) and screens wait until they're near the view.
- **No natively painted controls** (`appearance: none` on buttons, selects, radios, `<summary>`). In Chrome on Windows a native one held the first paint by about 2 s (measured before #22 found headless Chrome's 1 Hz frame clock, which may have been the cause; they stay off either way).
- **Nothing the first view doesn't show may appear later and larger:** a later, bigger paint becomes the LCP. The hero's loop screens stay `display: none` until their turn; the second phone is there from the start.
- **Inter has no optical-size axis** (41 KB instead of 64 KB).
