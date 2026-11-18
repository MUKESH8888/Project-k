import { spawnSync, spawn } from "node:child_process";
const setup = spawnSync(process.execPath, ["scripts/create-admin.mjs"], {
  stdio: "inherit",
  env: {
    ...process.env,
    ADMIN_EMAIL: "admin@example.test",
    ADMIN_NAME: "Test Administrator",
    ADMIN_PASSWORD: "E2e-only-password-123",
  },
});
if (setup.status !== 0) process.exit(setup.status || 1);
const child = spawn(
  process.execPath,
  ["node_modules/next/dist/bin/next", "start", "--port", "3101"],
  { stdio: "inherit", env: process.env },
);
for (const signal of ["SIGTERM", "SIGINT"])
  process.on(signal, () => child.kill(signal));
child.on("exit", (code) => process.exit(code || 0));
