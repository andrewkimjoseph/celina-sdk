import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const SDK_PACKAGE_NAME = "@andrewkimjoseph/celina-sdk";
const SDK_DEVICE_IDS = new Set(["andrewkimjoseph_celina_sdk", "celina-sdk"]);

let detectionCached = false;
let detectedDeviceId: string | undefined;

/** Amplitude-safe id from npm `package.json` `name` (strip `@`, `/` and `-` → `_`). */
export function sanitizePackageDeviceId(name: string): string {
  const stripped = name.startsWith("@") ? name.slice(1) : name;
  return stripped.replace(/\//g, "_").replace(/-/g, "_");
}

function getSdkPackageRoot(): string | undefined {
  let dir = dirname(fileURLToPath(import.meta.url));
  for (let i = 0; i < 24; i++) {
    const pkgPath = join(dir, "package.json");
    if (existsSync(pkgPath)) {
      try {
        const pkg = JSON.parse(readFileSync(pkgPath, "utf8")) as {
          name?: string;
        };
        if (pkg.name === SDK_PACKAGE_NAME) {
          return dir;
        }
      } catch {
        // ignore malformed package.json
      }
    }
    const parent = dirname(dir);
    if (parent === dir) {
      break;
    }
    dir = parent;
  }
  return undefined;
}

function isSdkFramePath(filePath: string, sdkRoot: string | undefined): boolean {
  const normalized = resolve(filePath);
  if (sdkRoot) {
    const root = resolve(sdkRoot);
    if (normalized === root || normalized.startsWith(root + sep)) {
      return true;
    }
  }
  return normalized.includes(
    `${sep}node_modules${sep}@andrewkimjoseph${sep}celina-sdk${sep}`,
  );
}

function readPackageNameFromFile(filePath: string): string | undefined {
  let dir = dirname(resolve(filePath));
  for (let i = 0; i < 24; i++) {
    const pkgPath = join(dir, "package.json");
    if (existsSync(pkgPath)) {
      try {
        const pkg = JSON.parse(readFileSync(pkgPath, "utf8")) as {
          name?: string;
        };
        if (typeof pkg.name === "string" && pkg.name.length > 0) {
          return pkg.name;
        }
      } catch {
        return undefined;
      }
    }
    const parent = dirname(dir);
    if (parent === dir) {
      break;
    }
    dir = parent;
  }
  return undefined;
}

function parseStackFramePaths(stack: string): string[] {
  const paths: string[] = [];
  for (const line of stack.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed.startsWith("at ")) {
      continue;
    }
    const parenMatch = /\(([^)]+)\)/.exec(trimmed);
    let loc = parenMatch?.[1];
    if (!loc) {
      const bare = /^at (?:async )?(?:.+ )?(.+)$/.exec(trimmed);
      loc = bare?.[1];
    }
    if (!loc) {
      continue;
    }
    let filePath = loc.trim();
    if (filePath.startsWith("file://")) {
      try {
        filePath = fileURLToPath(filePath);
      } catch {
        continue;
      }
    }
    filePath = filePath.replace(/:\d+:\d+$/, "").replace(/:\d+$/, "");
    if (filePath) {
      paths.push(filePath);
    }
  }
  return paths;
}

/**
 * npm package name of the app that called `createCelinaClient()`, sanitized for Amplitude.
 * Returns `undefined` when detection fails or the consumer is the SDK itself.
 */
export function detectConsumerPackageName(stack?: string): string | undefined {
  if (detectionCached) {
    return detectedDeviceId;
  }
  detectionCached = true;
  detectedDeviceId = undefined;

  if (typeof process === "undefined") {
    return detectedDeviceId;
  }

  try {
    const stackTrace = stack ?? new Error().stack ?? "";
    const sdkRoot = getSdkPackageRoot();
    for (const framePath of parseStackFramePaths(stackTrace)) {
      if (isSdkFramePath(framePath, sdkRoot)) {
        continue;
      }
      const rawName = readPackageNameFromFile(framePath);
      if (!rawName) {
        continue;
      }
      const deviceId = sanitizePackageDeviceId(rawName);
      if (SDK_DEVICE_IDS.has(deviceId)) {
        continue;
      }
      detectedDeviceId = deviceId;
      return detectedDeviceId;
    }
  } catch {
    detectedDeviceId = undefined;
  }

  return detectedDeviceId;
}

/** Test-only: clear cached consumer detection between cases. */
export function resetConsumerPackageDetectionForTests(): void {
  detectionCached = false;
  detectedDeviceId = undefined;
}
