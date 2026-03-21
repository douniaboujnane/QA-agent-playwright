import { defineConfig, devices } from "@playwright/test"
import dotenv from "dotenv"

dotenv.config()

export const envConfig = {
  baseUrl: process.env.BASE_URL!,
  appPassword: process.env.APP_PASSWORD!,
}

export default defineConfig({
  testDir: "./specs",
  fullyParallel: true,
  retries: 0,
  timeout: 10_000,
  reporter: [["html", { open: "never" }]],
  use: {
    baseURL: envConfig.baseUrl,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
      testIgnore: "**/seed.spec.ts",
    },
  ],
})
