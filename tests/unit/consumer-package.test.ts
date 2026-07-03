import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  detectConsumerPackageName,
  resetConsumerPackageDetectionForTests,
  sanitizePackageDeviceId,
} from "../../src/analytics/consumer-package.js";
import { resolveDeviceId } from "../../src/analytics/config.js";
import { resolveSdkConfig } from "../../src/config/sdk-config.js";

describe("sanitizePackageDeviceId", () => {
  it("sanitizes unscoped names", () => {
    expect(sanitizePackageDeviceId("celeste-ai")).toBe("celeste_ai");
  });

  it("sanitizes scoped names", () => {
    expect(sanitizePackageDeviceId("@andrewkimjoseph/celina-mcp")).toBe(
      "andrewkimjoseph_celina_mcp",
    );
    expect(sanitizePackageDeviceId("@andrewkimjoseph/celina-sdk")).toBe(
      "andrewkimjoseph_celina_sdk",
    );
  });
});

describe("detectConsumerPackageName", () => {
  afterEach(() => {
    resetConsumerPackageDetectionForTests();
  });

  it("returns consumer package from synthetic stack", () => {
    const root = mkdtempSync(join(tmpdir(), "celina-consumer-"));
    const appDir = join(root, "celeste-ai", "src", "lib");
    mkdirSync(appDir, { recursive: true });
    writeFileSync(
      join(root, "celeste-ai", "package.json"),
      JSON.stringify({ name: "celeste-ai" }),
    );
    const celinaPath = join(appDir, "celina.ts");
    writeFileSync(celinaPath, "// stub");

    const stack = `Error: probe
    at createCelinaClient (file:///sdk/build/index.js:1:1)
    at getCelinaClient (${celinaPath}:12:5)`;

    resetConsumerPackageDetectionForTests();
    expect(detectConsumerPackageName(stack)).toBe("celeste_ai");
  });

  it("skips SDK package and returns undefined for SDK-only stack", () => {
    const sdkRoot = mkdtempSync(join(tmpdir(), "celina-sdk-root-"));
    mkdirSync(join(sdkRoot, "build"), { recursive: true });
    writeFileSync(
      join(sdkRoot, "package.json"),
      JSON.stringify({ name: "@andrewkimjoseph/celina-sdk" }),
    );
    const sdkFile = join(sdkRoot, "build", "index.js");
    writeFileSync(sdkFile, "// stub");

    const stack = `Error: probe
    at resolveSdkConfig (${sdkFile}:10:1)
    at createCelinaClient (${sdkFile}:20:1)`;

    resetConsumerPackageDetectionForTests();
    expect(detectConsumerPackageName(stack)).toBeUndefined();
  });

  it("caches detection result", () => {
    const root = mkdtempSync(join(tmpdir(), "celina-cache-"));
    const appDir = join(root, "my-app");
    mkdirSync(appDir, { recursive: true });
    writeFileSync(
      join(appDir, "package.json"),
      JSON.stringify({ name: "my-app" }),
    );
    const entry = join(appDir, "index.js");
    writeFileSync(entry, "// stub");

    const stack = `Error: probe\n    at run (${entry}:1:1)`;
    resetConsumerPackageDetectionForTests();
    expect(detectConsumerPackageName(stack)).toBe("my_app");
    expect(detectConsumerPackageName("Error: other\n    at x (/nowhere):1:1")).toBe(
      "my_app",
    );
  });
});

describe("resolveSdkConfig device id", () => {
  afterEach(() => {
    resetConsumerPackageDetectionForTests();
    vi.unstubAllEnvs();
  });

  it("prefers explicit analyticsDeviceId", () => {
    const config = resolveSdkConfig({ analyticsDeviceId: "custom_id" });
    expect(config.analyticsDeviceId).toBe("custom_id");
    expect(resolveDeviceId(config)).toBe("custom_id");
  });
});
