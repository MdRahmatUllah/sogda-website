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
pnpm dev                 # http://localhost:3000
pnpm lint && pnpm typecheck
pnpm build               # static export into out/, then a CSP per page (scripts/csp.mjs)
pnpm exec playwright install chromium   # once
pnpm test:e2e            # against out/, served on :4173
pnpm lighthouse          # the budgets from CLAUDE.md, on every locale of out/
```

- **Store links, contact:** `site.config.ts`.
- **Copy:** `messages/<locale>.json`; the locale list is `i18n/routing.ts`.
- **Security headers:** `vercel.json` sends them. `scripts/csp.mjs` adds each page's `<meta>` Content-Security-Policy, which allows exactly that page's inline scripts by hash, since a static export has no server to add nonces.
