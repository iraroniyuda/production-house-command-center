import { defineConfig, devices } from "@playwright/test";

const baseURL =
  process.env.PHCC_E2E_BASE_URL ?? "http://localhost:3000";

const outputDir =
  process.env.PHCC_E2E_OUTPUT_DIR ?? "test-results";

export default defineConfig({
  testDir: "./e2e",
  outputDir,
  fullyParallel: false,
  workers: 1,
  retries: 0,
  forbidOnly: true,
  timeout: 90_000,
  expect: {
    timeout: 10_000,
  },
  reporter: [["list"]],
  preserveOutput: "never",
  use: {
    baseURL,
    headless: true,
    trace: "off",
    screenshot: "off",
    video: "off",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],
});
