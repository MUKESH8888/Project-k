import { defineConfig } from "@playwright/test";
import { resolve } from "node:path";
const data = resolve("work", "e2e-" + Date.now());
export default defineConfig({
  testDir: "./tests/browser",
  workers: 1,
  timeout: 45000,
  use: {
    channel: "msedge",
    baseURL: "http://localhost:3101",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "node scripts/test-server.mjs",
    url: "http://localhost:3101",
    reuseExistingServer: false,
    timeout: 120000,
    env: {
      COMMERCE_DATA_DIR: data,
      SESSION_DATA_DIR: data,
      NODE_ENV: "production",
    },
  },
  reporter: "list",
});
