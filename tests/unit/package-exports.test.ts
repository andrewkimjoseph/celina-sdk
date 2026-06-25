import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

type PackageExports = Record<
  string,
  {
    types?: string;
    import?: string;
    default?: string;
  }
>;

describe("package exports", () => {
  it("points ./testing to built artifacts", () => {
    const packageJsonPath = resolve(process.cwd(), "package.json");
    const packageJson = JSON.parse(
      readFileSync(packageJsonPath, "utf8"),
    ) as { exports?: PackageExports };

    expect(packageJson.exports?.["./testing"]).toEqual({
      types: "./build/tests/testing-entry.d.ts",
      import: "./build/tests/testing-entry.js",
      default: "./build/tests/testing-entry.js",
    });
  });
});
