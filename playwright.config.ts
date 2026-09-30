import { defineConfig, devices } from '@playwright/test';

// #84: agents build the site in parallel (CLAUDE.md, Team mode), so each runs on
// its own port, and a server already on it is never silently reused.
const port = Number(process.env.PW_PORT ?? 4173);

// The tests run against the static build (`pnpm build` first), served as Vercel
// would serve out/.
export default defineConfig({
  testDir: 'tests',
  fullyParallel: true,
  reporter: [['list']],
  use: {
    baseURL: `http://localhost:${port}`,
    // Animations still: snapshots stay stable (CLAUDE.md, Quality gate).
    reducedMotion: 'reduce',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    // The device matrix (#12): every page, every width and axe in the other
    // engines and on emulated phones and a tablet, plus the QA checks.
    ...(
      [
        ['firefox', devices['Desktop Firefox']],
        ['webkit', devices['Desktop Safari']],
        ['iphone', devices['iPhone 13']],
        ['ipad', devices['iPad (gen 7)']],
        ['pixel', devices['Pixel 7']],
      ] as const
    ).map(([name, device]) => ({
      name,
      use: { ...device },
      testMatch: ['smoke.spec.ts', 'qa.spec.ts'],
    })),
  ],
  webServer: {
    command: `pnpm exec serve out -l ${port}`,
    url: `http://localhost:${port}/en`,
    reuseExistingServer: process.env.PW_REUSE === '1',
  },
});
