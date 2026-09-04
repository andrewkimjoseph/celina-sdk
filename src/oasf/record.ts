import {
  CELINA_OASF_SCHEMA_VERSION,
  CELINA_OASF_SKILLS,
  CELINA_OASF_DOMAINS,
  CELINA_OASF_VERSION,
  OASF_REPO_ENDPOINT,
  celinaOasfDomainSlugs,
  celinaOasfSkillSlugs,
} from "./taxonomy.js";

export interface CelinaOasfService {
  name: "OASF";
  endpoint: string;
  version: string;
  skills: string[];
  domains: string[];
}

export interface CelinaOasfRecordLocator {
  type: string;
  urls: string[];
}

export interface CelinaOasfRecord {
  name: string;
  description: string;
  version: string;
  schema_version: string;
  authors: string[];
  created_at: string;
  skills: Array<{ name: string; id: number }>;
  domains: Array<{ name: string; id: number }>;
  modules: unknown[];
  locators: CelinaOasfRecordLocator[];
}

export interface CelinaOasfRecordOptions {
  /** Package or release version shown on the record */
  version?: string;
  /** Public site base URL, e.g. https://usecelina.xyz */
  siteBaseUrl?: string;
  /** MCP host base URL for execution endpoints */
  mcpBaseUrl?: string;
}

const DEFAULT_DESCRIPTION =
  "Celina is a third-party, open-source stack that gives an LLM read, prepare, and execute access to Celo mainnet through an SDK, an MCP server, and a REST API. This hosted agent exposes read-only access to balances, DeFi quotes, governance, staking, NFTs, and Self Agent ID verification via structured tool calls.";

export function buildCelinaOasfService(): CelinaOasfService {
  return {
    name: "OASF",
    endpoint: OASF_REPO_ENDPOINT,
    version: CELINA_OASF_VERSION,
    skills: celinaOasfSkillSlugs(),
    domains: celinaOasfDomainSlugs(),
  };
}

export function buildCelinaOasfRecord(
  options: CelinaOasfRecordOptions = {},
): CelinaOasfRecord {
  const site = (options.siteBaseUrl ?? "https://usecelina.xyz").replace(/\/$/, "");
  const mcp = (options.mcpBaseUrl ?? "https://mcp.usecelina.xyz").replace(/\/$/, "");

  return {
    name: "Celina",
    description: DEFAULT_DESCRIPTION,
    version: options.version ?? "0.9.2",
    schema_version: CELINA_OASF_SCHEMA_VERSION,
    authors: ["Celina <https://usecelina.xyz>"],
    created_at: "2025-06-01T00:00:00Z",
    skills: CELINA_OASF_SKILLS.map(({ name, id }) => ({ name, id })),
    domains: CELINA_OASF_DOMAINS.map(({ name, id }) => ({ name, id })),
    modules: [],
    locators: [
      { type: "source_code", urls: ["https://github.com/andrewkimjoseph/celina-sdk"] },
      { type: "web", urls: [site] },
      { type: "mcp", urls: [`${mcp}/mcp`] },
      { type: "a2a", urls: [`${mcp}/a2a`] },
      { type: "agent_card", urls: [`${site}/.well-known/agent-card.json`] },
      { type: "registration", urls: [`${site}/agent.json`] },
    ],
  };
}
