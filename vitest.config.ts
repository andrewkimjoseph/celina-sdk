import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@andrewkimjoseph/celina-sdk": path.resolve(__dirname, "src/index.ts"),
      "@andrewkimjoseph/celina-sdk/testing": path.resolve(
        __dirname,
        "tests/testing-entry.ts",
      ),
    },
  },
  test: {
    environment: "node",
    testTimeout: 60_000,
    hookTimeout: 60_000,
    include: ["tests/**/*.test.ts"],
    exclude: ["tests/unit/**"],
    env: {
      CELINA_ANALYTICS_DISABLED: "1",
    },
  },
});
