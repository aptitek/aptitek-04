import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env['CI']),
  retries: process.env['CI'] ? 2 : 0,
  workers: process.env['CI'] ? 1 : 4,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:4323',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'pnpm run preview --port 4323 --ignore-lock',
    url: 'http://localhost:4323',
    reuseExistingServer: !process.env['CI'],
    env: {
      ASTRO_PREVIEW_BACKGROUND: 'false',
    },
  },
});
