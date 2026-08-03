/**
 * CJS re-export for @goodsdks/citizen-sdk.
 * Uses createRequire because upstream ESM/CJS interop needs a Node require shim.
 */
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

const citizenSdk =
  require("@goodsdks/citizen-sdk") as typeof import("@goodsdks/citizen-sdk");

export const IdentitySDK =
  citizenSdk.IdentityCustodialSDK ?? citizenSdk.IdentitySDK;
