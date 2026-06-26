#!/usr/bin/env node
/**
 * Writes celina-website A2A agent card JSON from the SDK catalog:
 * - public/.well-known/agent-card.json (hosted discovery URL)
 * - src/data/agent-card.json (bundled import for the /a2a page)
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

const outPaths = [
  join(
    scriptDir,
    "../../celina-website/public/.well-known/agent-card.json",
  ),
  join(scriptDir, "../../celina-website/src/data/agent-card.json"),
];

const card = buildCelinaAgentCard({
  mcpBaseUrl: "https://mcp.usecelina.xyz",
  version,
});

const payload = `${JSON.stringify(card, null, 2)}\n`;
for (const outPath of outPaths) {
  mkdirSync(join(outPath, ".."), { recursive: true });
  writeFileSync(outPath, payload, "utf8");
  console.log(`Wrote A2A agent card to ${outPath} (${card.skills.length} skills)`);
}
