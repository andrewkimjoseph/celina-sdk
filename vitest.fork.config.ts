import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    setupFiles: ["./tests/setup/load-env.ts"],
    globalSetup: ["./tests/fork/globalSetup.ts"],
    include: ["tests/fork/**/*.test.ts"],
    testTimeout: 120_000,
    hookTimeout: 120_000,
    pool: "forks",
    maxWorkers: 4,
  },
});
