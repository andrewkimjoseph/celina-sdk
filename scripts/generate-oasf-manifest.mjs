#!/usr/bin/env node
/**
 * Writes celina-website/public/.well-known/oasf.json from the SDK OASF catalog.
 * Run from celina-sdk after `npm run build`.
 */
import { readFileSync } from "node:fs";
import { mkdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const { version } = JSON.parse(
  readFileSync(join(scriptDir, "../package.json"), "utf8"),
);

const { buildCelinaOasfRecord } = await import("../build/oasf/record.js");

const outPath = join(
  scriptDir,
  "../../celina-website/public/.well-known/oasf.json",
);

const record = buildCelinaOasfRecord({
  version,
  siteBaseUrl: "https://usecelina.xyz",
  mcpBaseUrl: "https://mcp.usecelina.xyz",
});

mkdirSync(join(outPath, ".."), { recursive: true });
writeFileSync(outPath, `${JSON.stringify(record, null, 2)}\n`, "utf8");
console.log(
  `Wrote OASF record to ${outPath} (${record.skills.length} skills, ${record.domains.length} domains)`,
);
