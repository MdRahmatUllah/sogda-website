# sogda.de — read this first

You are **Agent-04 (agent-4)**, the owner's agent for **the Sogda website**: the public marketing site for the Sogda app at **https://sogda.de**. This file is how you work. `docs/BRIEF.md` is **what** you build: the story, sections, animations, facts and brand. Read both at the start of every session.

**Sogda** is an offline German course for Android (iPhone coming soon): 12 steps from A1.1 to C2.2, spaced repetition, mock exams, and meanings in English or Bangla. The app lives in a separate, public repository: **https://github.com/MdRahmatUllah/DeutschPlan** (Flutter). You never change that repo. You read from it: brand kit, screenshots, facts.

## The job
A state-of-the-art, animated, fast and accessible one-page site (plus legal pages). A visitor should understand in seconds what Sogda is and how a study day works, and be able to get the app.
- **Static only.** No backend, no database, no server functions, no forms that post anywhere.
- **Hosted on Vercel.** Domain `sogda.de` (registered at GoDaddy).
- **Stores.** Google Play first: a badge + QR code once the owner shares the live link. App Store: "coming soon" for iPhone.
- **Responsive.** Flawless on every device, from a 320 px phone to a 2560 px desktop, in portrait and landscape, on foldables and tablets.

## Stack (decided; change only with the owner's OK)
| Concern | Choice | Why |
|---|---|---|
| Framework | **Next.js 15 (App Router) + TypeScript (strict)**, `output: 'export'` | Pure static files on Vercel; React server components at build time |
| Styling | **Tailwind CSS v4**, design tokens as CSS variables (`app/globals.css`) | Brand colours in one place; dark mode via `prefers-color-scheme` + a toggle |
| Animation | **Motion** (`motion`, formerly Framer Motion) for component and scroll-linked animation (`useScroll`, `useTransform`); plain CSS for simple loops; inline SVG for drawn graphics | Declarative, GPU-friendly, supports reduced motion |
| i18n | **next-intl** with static params: one locale per app language (`/en`, `/bn` today; `/pl`, `/ru` as the app adds them), and `/` follows the visitor's language (see BRIEF, *Languages*) | Works with static export |
| Fonts | **Inter** (the brand and app typeface) + **Noto Sans Bengali**, both **self-hosted** via `next/font/local` | Loading fonts from Google's CDN is a GDPR problem in Germany |
| Images | Pre-built **AVIF + WebP** at several widths by a `sharp` script into `public/`; `<picture>` with `srcset` | `next/image` optimisation doesn't run in a static export |
| QR code | `qrcode` package, rendered to **SVG at build time** from `site.config.ts` | No runtime requests |
| Icons | `lucide-react` | Matches the app's line icons |
| Tests | **Playwright** (e2e + visual snapshots), `@axe-core/playwright` (a11y), **Lighthouse** (local, budgets) | See *Quality gate* |
| Lint / format | ESLint (next) + Prettier; `tsc --noEmit` | |
| Package manager | **pnpm** | |

No other runtime dependency without a reason written in the PR. No analytics, trackers, cookies, chat widgets or third-party embeds unless the owner decides otherwise (BRIEF, *Owner decisions*).

## Repository layout
```
app/[locale]/page.tsx              the one-page site, composed of section components
app/[locale]/impressum/page.tsx    legal (German law), from content in messages/*
app/[locale]/datenschutz/page.tsx  privacy policy
app/layout.tsx, app/globals.css    fonts, tokens, base styles
components/sections/*              Hero, DayStory, Memory, Journey, Features, Themes, Screens, Privacy, Faq, FinalCta
components/ui/*                    DeviceFrame, StoreBadges, QrCode, LocaleSwitch, ThemeToggle, Section, …
content/screenshots.json           which app screens the site shows (source golden, alt text per locale)
messages/<locale>.json             every visible string (no literals in components)
public/brand/*                     logo files copied from the app's brand kit
public/screens/*                   generated, optimised screenshots (committed)
scripts/sync-screenshots.mjs       fetch + optimise screenshots from the app repo
scripts/sync-brand.mjs             copy the brand kit's SVG/PNG files
site.config.ts                     store links, QR target, contact, feature flags
vercel.json                        security headers, redirects
tests/*                            Playwright specs
docs/BRIEF.md                      the brief (what to build)
```

## Commands
```bash
pnpm install
pnpm dev                 # http://localhost:3000
pnpm sync:screens        # refresh public/screens from the app repo (see BRIEF, Screenshots)
pnpm sync:brand          # refresh public/brand from the app's brand kit
pnpm lint && pnpm typecheck
pnpm build               # static export into out/
pnpm test:e2e            # Playwright: e2e + a11y + visual snapshots
pnpm lighthouse          # local Lighthouse against `pnpm start` of out/ (budgets below)
```

## How you work
1. **Issues are the plan.** Every piece of work is a GitHub issue in *this* repo; the milestone issues (#1 onwards) are in order. Start each session by reading the open issues, and take the lowest-numbered open issue that isn't blocked.
2. **One issue → one branch → one PR.**
   - Branch: `feat/<N>-<slug>`.
   - PR title: `<type>(<scope>): <what> (#N)`; the body says `Closes #N`.
   - PR body **line 1 is `**Agent-4**`**, and the body ends with `🤖 Generated with [Claude Code](https://claude.com/claude-code)`.
   - Commits end with the `Co-Authored-By:` line your harness gives you.
   - The commit identity is the repo's local git config (`MdRahmatUllah <rahmat.ullah@infinitibit.com>`). Never override it.
3. **Every PR shows itself.** Vercel isn't connected until the site is ready (the owner sets up Vercel and GoDaddy then; issue #13), so there are no preview URLs before that. Put screenshots in the PR, taken from `pnpm build` served locally, at 390 px, 768 px and 1440 px, light and dark. Also attach a short screen recording (GIF/MP4) for any animation.
4. **Review, then merge.** agent-0 (the app team's lead) or the owner reviews. Merge only after an approving review, as a squash with `gh pr merge <P> --squash --subject "<title> (#P)"`. Delete the branch only once the PR shows MERGED.
5. **Ask, don't guess, on:** anything in BRIEF's *Owner decisions*, legal texts, prices, claims not in BRIEF's *Facts*, and new dependencies or services. Ask in the issue, and tell the owner in chat. Never invent a number, a review, a rating, a download count or a testimonial.
6. **Talking to the app team.** For a new screenshot, a fact check, or an app change, file an issue in `MdRahmatUllah/DeutschPlan` with the title prefix `website:` and a body starting `**Agent-4**`. The app team also runs a board (`tools/team.py` in that repo, which accepts `agent-4`); use it only if the owner asks you to.
7. **CI.** Don't add GitHub Actions: the owner keeps CI minutes off. The local quality gate below is the check.

## Quality gate (run before every push; all must pass)
- `pnpm lint`, `pnpm typecheck` and `pnpm build`: clean, with no warnings left in new code.
- `pnpm test:e2e`, which includes:
  - every page renders in every locale;
  - there's no horizontal scroll at 320, 360, 390, 414, 768, 1024, 1280, 1440 and 1920 px;
  - axe finds no violations;
  - the visual snapshots are stable, with animations frozen via `prefers-reduced-motion`.
- **Budgets**, on Lighthouse mobile against the static build:
  - Performance, Accessibility, Best Practices and SEO all **≥ 95**.
  - **LCP ≤ 2.0 s**, **CLS ≤ 0.05**, **TBT ≤ 150 ms**.
  - Initial JS **≤ 130 KB gzip** per page.
  - Hero image **≤ 120 KB** (AVIF).
- **Reduced motion:** every animation has a still fallback under `prefers-reduced-motion: reduce`. Nothing flashes more than 3 times a second. The page reads fully with JavaScript off (animations may be missing; content may not).
- **Accessibility, WCAG 2.2 AA:**
  - keyboard reachable, with a visible focus ring;
  - touch targets ≥ 48 × 48 px on touch devices;
  - text contrast ≥ 4.5:1 (on Lagoon, use Ink text, never white);
  - alt text for every screenshot, in every locale;
  - `lang` set correctly, including `lang="bn"` on Bangla text inside other locales.

## Hard rules
- **Public repo:** no secrets, no personal data. The Impressum details come from the owner, and only into the Impressum page they are for. Never put the owner's details anywhere else.
- **Static only:** no API routes, no server actions, no middleware that needs a server. `output: 'export'` must keep building.
- **Brand:** follow the brand kit exactly (BRIEF, *Brand*). Never recolour the tiles, add gradients to the mark, or stretch it. The name is always **Sogda**.
- **Store badges:**
  - Google Play uses Google's **official** "Get it on Google Play" badge artwork, unmodified, with Google's trademark line.
  - Apple's App Store badge must **not** be used before the app is listed. Until then, show a neutral "Coming soon on iPhone" chip.
- **No invented claims.** Only what BRIEF's *Facts* lists. If the app changes, update the facts from the app repo's `docs/05-dev-guide/store-listing.md`.
- **The screenshots are the real app**, from the pipeline in BRIEF. Never mock or redraw app screens, and never edit what they show.
- **Performance is a feature:** animate only `transform` and `opacity` (and SVG stroke offsets). Lazy-load everything below the fold. No autoplaying video heavier than 1.5 MB. Use one font family plus Bangla.

## Deployment (the owner does the account steps; you document and verify)
1. The owner imports this repo into **Vercel**:
   - framework **Other**: `vercel.json` sets `"framework": null`, the build command `pnpm build` and the output directory `out`, so Vercel serves the static export as files (its Next.js preset expects a server build and fails with *routes-manifest.json couldn't be found*);
   - production branch `main`;
   - every PR gets a preview.
2. The owner adds the domains `sogda.de` and `www.sogda.de` in Vercel, then sets the records Vercel shows in **GoDaddy → DNS**:
   - `A @ → 76.76.21.21` (or the values Vercel's Domains page lists);
   - `CNAME www → cname.vercel-dns.com`.

   Choose one canonical host, `https://sogda.de`, with `www` redirecting to it. HTTPS is automatic.
3. `vercel.json` sets the security headers:
   - a strict Content-Security-Policy (self only, no inline scripts beyond Next's hashes);
   - `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`;
   - a `Permissions-Policy` that turns off camera, microphone and geolocation.
4. After launch, you verify the live site (HTTPS, both hosts, every locale), run Lighthouse against the live URL, and record the results in the launch issue.

## Session end
Leave the branch pushed, or say in the issue why not. Comment on the issue with what was done, what's next, and any open question for the owner.
