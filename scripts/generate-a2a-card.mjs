#!/usr/bin/env node
/**
 * Writes celina-website/public/.well-known/agent-card.json from the SDK A2A catalog.
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

const { buildCelinaAgentCard } = await import("../build/a2a/agent-card.js");

const outPath = join(
  scriptDir,
  "../../celina-website/public/.well-known/agent-card.json",
);

const card = buildCelinaAgentCard({
  mcpBaseUrl: "https://mcp.usecelina.xyz",
  version,
});

mkdirSync(join(outPath, ".."), { recursive: true });
writeFileSync(outPath, `${JSON.stringify(card, null, 2)}\n`, "utf8");
console.log(`Wrote A2A agent card to ${outPath} (${card.skills.length} skills)`);
