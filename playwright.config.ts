import { defineConfig, devices } from "@playwright/test";

process.env.NEXT_PUBLIC_OAUTH_ENABLED ??= "true";
process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ??= "test-recaptcha-site-key";

/**
 * Playwright configuration for E2E testing.
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "github" : "html",
  use: {
    baseURL: "http://localhost:9000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:9000",
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
    env: {
      ...process.env,
      NEXT_PUBLIC_OAUTH_ENABLED: process.env.NEXT_PUBLIC_OAUTH_ENABLED,
    },
  },
});
