/**
 * Bundle Node-awkward CJS/ESM interop packages into flat ESM files.
 * Wrangler cannot run createRequire(import.meta.url); Node cannot load
 * Mento/Uniswap ESM graphs (extensionless relative imports).
 */
import * as esbuild from "esbuild";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "src/clients/generated");

mkdirSync(outDir, { recursive: true });

const shared = {
  bundle: true,
  format: "esm",
  platform: "neutral",
  mainFields: ["module", "main"],
  conditions: ["import", "module", "default"],
  target: "es2022",
  legalComments: "none",
  logLevel: "info",
  absWorkingDir: root,
  external: [
    "viem",
    "viem/*",
    "wagmi",
    "wagmi/*",
  ],
};

await esbuild.build({
  ...shared,
  stdin: {
    contents: `
      import * as citizenSdk from "@goodsdks/citizen-sdk";
      export const IdentitySDK =
        citizenSdk.IdentityCustodialSDK ?? citizenSdk.IdentitySDK;
    `,
    resolveDir: root,
    sourcefile: "citizen-sdk.entry.ts",
    loader: "ts",
  },
  outfile: join(outDir, "citizen-sdk.bundle.js"),
});

await esbuild.build({
  ...shared,
  stdin: {
    contents: `
      export {
        Mento,
        ChainId,
        deadlineFromMinutes,
        RouteNotFoundError,
        FXMarketClosedError,
      } from "@mento-protocol/mento-sdk";
    `,
    resolveDir: root,
    sourcefile: "mento-sdk.entry.ts",
    loader: "ts",
  },
  outfile: join(outDir, "mento-sdk.bundle.js"),
});

await esbuild.build({
  ...shared,
  stdin: {
    contents: `
      export { Actions, V4Planner } from "@uniswap/v4-sdk";
      export { CommandType, RoutePlanner } from "@uniswap/universal-router-sdk";
      export { ChainId } from "@uniswap/sdk-core";
    `,
    resolveDir: root,
    sourcefile: "uniswap-sdk.entry.ts",
    loader: "ts",
  },
  outfile: join(outDir, "uniswap-sdk.bundle.js"),
});
