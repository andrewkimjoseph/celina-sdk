import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

const v4Sdk = require("@uniswap/v4-sdk") as typeof import("@uniswap/v4-sdk");
const universalRouterSdk =
  require("@uniswap/universal-router-sdk") as typeof import("@uniswap/universal-router-sdk");
const sdkCore = require("@uniswap/sdk-core") as typeof import("@uniswap/sdk-core");

export const { Actions, V4Planner } = v4Sdk;
export const { CommandType, RoutePlanner } = universalRouterSdk;
export const { ChainId } = sdkCore;

export type { SwapExactInSingle, SwapExactIn } from "@uniswap/v4-sdk";
