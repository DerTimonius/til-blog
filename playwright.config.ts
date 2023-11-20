import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './playwright',
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'list' : 'html',
  workers: 1,
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.CI
      ? process.env.PLAYWRIGHT_TEST_BASE_URL
      : 'http://localhost:4321',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
