import { defineConfig, devices } from "@playwright/test";

const FRONTEND = "http://localhost:3000";

// Thin E2E pass over the critical user flows: public contact form + admin auth
// and dashboard. Boots both dev servers (reused if already running). Runs
// against the dev DB; all E2E-created rows are tagged __E2E__ and swept by
// global-teardown.
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  timeout: 30000,
  expect: { timeout: 10000 },
  reporter: [["list"]],
  globalTeardown: "./e2e/global-teardown.ts",
  use: {
    baseURL: FRONTEND,
    trace: "on-first-retry",
  },
  projects: [
    { name: "setup", testMatch: /auth\.setup\.ts/ },
    {
      name: "public",
      testMatch: /public\/.*\.spec\.ts/,
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "admin",
      testMatch: /admin\/.*\.spec\.ts/,
      dependencies: ["setup"],
      use: {
        ...devices["Desktop Chrome"],
        storageState: "e2e/.auth/admin.json",
      },
    },
  ],
  webServer: [
    {
      command: "npm run dev",
      cwd: "../backend",
      port: 4000,
      reuseExistingServer: true,
      timeout: 120000,
      stdout: "ignore",
      stderr: "pipe",
    },
    {
      command: "npm run dev",
      url: FRONTEND,
      reuseExistingServer: true,
      timeout: 120000,
      stdout: "ignore",
      stderr: "pipe",
    },
  ],
});
