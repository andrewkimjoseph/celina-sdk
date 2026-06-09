import { AsyncLocalStorage } from "node:async_hooks";
import type { SdkConfig } from "../config/sdk-config.js";
import { WALLET_EXTRACT_BY_SDK_METHOD } from "./wallet-extract.js";

const WALLET_RE = /^0x[a-fA-F0-9]{40}$/;

const analyticsWalletStorage = new AsyncLocalStorage<string | undefined>();

/** Validate and normalize a Celo address for telemetry `user_id`. */
export function normalizeWalletAddress(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }
  const trimmed = value.trim();
  if (!WALLET_RE.test(trimmed)) {
    return undefined;
  }
  return trimmed.toLowerCase();
}

function walletFromArgValue(value: unknown): string | undefined {
  const direct = normalizeWalletAddress(value);
  if (direct) {
    return direct;
  }
  if (value && typeof value === "object" && !Array.isArray(value)) {
    for (const key of [
      "address",
      "wallet_address",
      "from",
      "owner",
      "accountAddress",
      "fromAddress",
    ]) {
      const nested = normalizeWalletAddress(
        (value as Record<string, unknown>)[key],
      );
      if (nested) {
        return nested;
      }
    }
  }
  return undefined;
}

/** Extract wallet from read args using catalog-generated rules. */
export function extractWalletFromReadArgs(
  methodKey: string,
  args: readonly unknown[],
): string | undefined {
  const rule = WALLET_EXTRACT_BY_SDK_METHOD[methodKey];
  if (!rule) {
    return undefined;
  }

  if (rule.positional !== undefined) {
    const fromPos = walletFromArgValue(args[rule.positional]);
    if (fromPos) {
      return fromPos;
    }
  }

  if (rule.objectKeys) {
    for (const arg of args) {
      if (!arg || typeof arg !== "object" || Array.isArray(arg)) {
        continue;
      }
      const obj = arg as Record<string, unknown>;
      for (const key of rule.objectKeys) {
        const found = normalizeWalletAddress(obj[key]);
        if (found) {
          return found;
        }
      }
    }
  }

  return undefined;
}

/** Run async/sync work with a request-scoped analytics wallet (singleton SDK clients). */
export function runWithAnalyticsWallet<T>(address: string | undefined, fn: () => T): T {
  const normalized = normalizeWalletAddress(address);
  return analyticsWalletStorage.run(normalized, fn);
}

/** Resolve wallet for telemetry: read args → ALS → config default. */
export function resolveAnalyticsWallet(
  methodKey: string,
  args: readonly unknown[],
  config: SdkConfig,
): string | undefined {
  return (
    extractWalletFromReadArgs(methodKey, args) ??
    analyticsWalletStorage.getStore() ??
    normalizeWalletAddress(config.analyticsWalletAddress)
  );
}

/** Test-only: clear ALS between cases. */
export function resetAnalyticsWalletStorageForTests(): void {
  analyticsWalletStorage.disable();
}
