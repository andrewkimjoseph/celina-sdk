import {
  buildSkillsFromToolNames,
  CELINA_TOOL_MIME,
  type CelinaA2ASkill,
} from "./skills.js";
import {
  getHostedMcpToolNames,
  TOOL_CATEGORY_BY_NAME,
} from "../tools/website-sync.js";

export interface CelinaAgentCardOptions {
  /** Public MCP host base URL for JSON-RPC execution, e.g. https://mcp.usecelina.xyz */
  mcpBaseUrl?: string;
  /** @deprecated Use mcpBaseUrl. Kept for backward compatibility. */
  baseUrl?: string;
  /** Celina package version shown on the card */
  version: string;
}

export interface CelinaA2AAgentCard {
  name: string;
  description: string;
  protocolVersion: string;
  version: string;
  url: string;
  skills: Array<{
    id: string;
    name: string;
    description: string;
    tags: string[];
    examples: string[];
  }>;
  capabilities: {
    streaming: boolean;
    pushNotifications: boolean;
  };
  defaultInputModes: string[];
  defaultOutputModes: string[];
  additionalInterfaces: Array<{
    url: string;
    transport: string;
  }>;
  /** Celina-specific task payload mime type */
  extensions?: Record<string, unknown>;
}

const DEFAULT_DESCRIPTION =
  "Celina is a third-party, open-source stack that gives an LLM read, prepare, and execute access to Celo mainnet through an SDK, an MCP server, and a REST API. This hosted agent exposes read-only access to balances, DeFi quotes, governance, staking, NFTs, and Self Agent ID verification via structured tool calls.";

export function buildCelinaA2ASkills(): CelinaA2ASkill[] {
  return buildSkillsFromToolNames(getHostedMcpToolNames(), TOOL_CATEGORY_BY_NAME);
}

export function buildCelinaAgentCard(options: CelinaAgentCardOptions): CelinaA2AAgentCard {
  const mcpBase = (
    options.mcpBaseUrl ??
    options.baseUrl ??
    "https://mcp.usecelina.xyz"
  ).replace(/\/$/, "");
  const jsonRpcUrl = `${mcpBase}/api/a2a`;
  const skills = buildCelinaA2ASkills();

  return {
    name: "Celina",
    description: DEFAULT_DESCRIPTION,
    protocolVersion: "0.3.0",
    version: options.version,
    url: jsonRpcUrl,
    skills: skills.map((skill) => ({
      id: skill.id,
      name: skill.name,
      description: skill.description,
      tags: skill.tags,
      examples: skill.examples,
    })),
    capabilities: {
      streaming: false,
      pushNotifications: false,
    },
    defaultInputModes: ["text", "data"],
    defaultOutputModes: ["text", "data"],
    additionalInterfaces: [
      { url: jsonRpcUrl, transport: "JSONRPC" },
    ],
    extensions: {
      celina: {
        toolPayloadMime: CELINA_TOOL_MIME,
        toolPayloadSchema: {
          tool: "string — hosted MCP tool name",
          arguments: "object — snake_case tool arguments",
        },
      },
    },
  };
}
