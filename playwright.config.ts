import { defineConfig, devices } from '@playwright/test';

// The tests run against the static build (`pnpm build` first), served as Vercel
// would serve out/.
export default defineConfig({
  testDir: 'tests',
  fullyParallel: true,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:4173',
    // Animations still: snapshots stay stable (CLAUDE.md, Quality gate).
    reducedMotion: 'reduce',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'pnpm start',
    url: 'http://localhost:4173/en',
    reuseExistingServer: true,
  },
});
