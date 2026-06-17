#!/usr/bin/env node
/**
 * Merges discovery service entries into celina-website/public/agent.json.
 * Preserves registrations, wallet, and non-discovery services.
 * Run from celina-sdk after `npm run build`.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const sdkPkg = JSON.parse(
  readFileSync(join(scriptDir, "../package.json"), "utf8"),
);

const { buildCelinaOasfService } = await import("../build/oasf/record.js");

const agentJsonPath = join(
  scriptDir,
  "../../celina-website/public/agent.json",
);

const SITE = "https://usecelina.xyz";
const MCP = "https://mcp.usecelina.xyz";

const existing = JSON.parse(readFileSync(agentJsonPath, "utf8"));

const preservedNames = new Set([
  "web",
  "Celeste",
  "MCP docs",
  "Self Agent ID",
  "wallet",
]);

const preservedServices = (existing.services ?? []).filter((service) =>
  preservedNames.has(service.name),
);

const mcpService = existing.services?.find((s) => s.name === "MCP");
const mcpVersion = mcpService?.version ?? "0.9.7";

const discoveryServices = [
  {
    name: "MCP",
    endpoint: `${MCP}/api/mcp`,
    version: mcpVersion,
  },
  {
    name: "A2A",
    endpoint: `${SITE}/.well-known/agent-card.json`,
    version: "0.3.0",
  },
  buildCelinaOasfService(),
];

existing.description =
  "Celina is an open-source agent stack for Celo mainnet — MCP server, A2A specialist agent, OASF discovery, SDK, and hosted endpoint for balances, swaps, Self Agent ID, and chain tools for LLM agents.";
existing.services = [...preservedServices, ...discoveryServices];

writeFileSync(agentJsonPath, `${JSON.stringify(existing, null, 2)}\n`, "utf8");
console.log(`Updated ${agentJsonPath} (${existing.services.length} services)`);
