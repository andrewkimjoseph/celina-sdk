import { ALL_TOOL_DEFINITIONS, getToolInputSchemaShape } from "./catalog.js";
import { filterToolDefinitions } from "./filter.js";
import type { FilterToolsOptions, ToolDefinition, ToolFamily } from "./types.js";

export type WebsiteToolCategory =
  | "Blockchain"
  | "Account"
  | "Token"
  | "Transaction"
  | "Mento FX"
  | "Uniswap"
  | "Wallet"
  | "GoodDollar"
  | "Aave"
  | "Self"
  | "Governance"
  | "Staking"
  | "NFT"
  | "Contract"
  | "AgentKarma";

export type WebsiteToolKind = "read" | "write";

export type WebsiteToolAvailability = "hosted" | "stdio" | "both";

export interface WebsiteToolBaseline {
  name: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
  kind: WebsiteToolKind;
  category: WebsiteToolCategory;
  inputs: Array<{
    name: string;
    type: string;
    required?: boolean;
    description: string;
  }>;
}

export const HOSTED_MCP_FILTER: FilterToolsOptions = {
  surface: "mcp",
  serverKeyToolsEnabled: false,
  selfSessionToolsEnabled: false,
  estimateToolsEnabled: false,
};

const STDIO_ONLY_TOOLS = new Set([
  "send_token",
  "execute_mento_fx",
  "execute_uniswap_swap",
  "supply_aave",
  "withdraw_aave",
  "claim_daily_gooddollar_ubi",
  "execute_gooddollar_reserve_swap",
  "get_wallet_address",
  "get_self_identity",
  "sign_self_request",
  "authenticated_self_fetch",
  "refresh_self_proof",
  "deregister_self_agent",
  "register_self_agent",
  "check_self_registration",
]);

export const TOOL_CATEGORY_BY_NAME: Record<string, WebsiteToolCategory> = {
  get_network_status: "Blockchain",
  get_block: "Blockchain",
  get_latest_blocks: "Blockchain",
  get_transaction: "Blockchain",
  verify_attribution_tag: "Blockchain",
  get_account: "Account",
  get_wallet_address: "Wallet",
  get_celo_balances: "Token",
  get_stablecoin_balances: "Token",
  get_token_info: "Token",
  get_token_balance: "Token",
  estimate_send: "Transaction",
  send_token: "Transaction",
  get_mento_fx_quote: "Mento FX",
  estimate_mento_fx: "Mento FX",
  execute_mento_fx: "Mento FX",
  prepare_mento_fx: "Mento FX",
  get_uniswap_quote: "Uniswap",
  estimate_uniswap_swap: "Uniswap",
  execute_uniswap_swap: "Uniswap",
  prepare_uniswap_swap: "Uniswap",
  get_swap_quote: "Uniswap",
  prepare_swap: "Uniswap",
  get_aave_balances: "Aave",
  supply_aave: "Aave",
  withdraw_aave: "Aave",
  resolve_ens: "Wallet",
  get_gooddollar_whitelisting_info: "GoodDollar",
  get_gooddollar_identity_link: "GoodDollar",
  get_gooddollar_ubi_entitlement: "GoodDollar",
  claim_daily_gooddollar_ubi: "GoodDollar",
  prepare_claim_daily_gooddollar_ubi: "GoodDollar",
  get_gooddollar_reserve_quote: "GoodDollar",
  estimate_gooddollar_reserve_swap: "GoodDollar",
  execute_gooddollar_reserve_swap: "GoodDollar",
  prepare_gooddollar_reserve_swap: "GoodDollar",
  get_governance_proposals: "Governance",
  get_proposal_details: "Governance",
  get_staking_balances: "Staking",
  get_validator_groups: "Staking",
  get_validator_group_details: "Staking",
  get_activatable_stakes: "Staking",
  get_total_staking_info: "Staking",
  get_nft_info: "NFT",
  get_nft_balance: "NFT",
  call_contract_function: "Contract",
  estimate_contract_gas: "Contract",
  verify_self_agent: "Self",
  lookup_self_agent: "Self",
  verify_self_request: "Self",
  register_self_agent: "Self",
  check_self_registration: "Self",
  get_self_identity: "Self",
  refresh_self_proof: "Self",
  deregister_self_agent: "Self",
  sign_self_request: "Self",
  authenticated_self_fetch: "Self",
  get_agentkarma_reputation: "AgentKarma",
  get_agentkarma_celo_agent: "AgentKarma",
  check_agentkarma_counterparty: "AgentKarma",
};

function toolNameToSlug(name: string): string {
  return name.replace(/_/g, "-");
}

function familyToKind(families: ToolFamily[]): WebsiteToolKind {
  return families.includes("execute") ? "write" : "read";
}

function firstSentence(text: string): string {
  const match = text.match(/^[^.!?]+[.!?]?/);
  return match ? match[0].trim() : text.slice(0, 120);
}

type ZodSchemaNode = {
  _def?: {
    typeName?: string;
    innerType?: unknown;
    description?: string;
  };
};

function unwrapZodSchema(schema: unknown): ZodSchemaNode | null {
  if (!schema || typeof schema !== "object") {
    return null;
  }
  return schema as ZodSchemaNode;
}

function isZodOptional(schema: unknown): boolean {
  const zod = unwrapZodSchema(schema);
  const typeName = zod?._def?.typeName;
  return typeName === "ZodOptional" || typeName === "ZodDefault";
}

function zodInnerSchema(schema: unknown): unknown {
  const zod = unwrapZodSchema(schema);
  if (!zod?._def) return schema;
  if (isZodOptional(schema)) {
    return zod._def.innerType;
  }
  return schema;
}

function zodFieldType(schema: unknown): string {
  const inner = zodInnerSchema(schema);
  const zod = unwrapZodSchema(inner);
  if (!zod?._def?.typeName) {
    return "string";
  }
  const typeName = zod._def.typeName;
  if (typeName === "ZodBoolean") return "boolean";
  if (typeName === "ZodNumber") return "number";
  if (typeName === "ZodArray") return "array";
  return "string";
}

function zodFieldDescription(schema: unknown, fallback: string): string {
  const zod = unwrapZodSchema(schema);
  if (zod?._def?.description) {
    return zod._def.description;
  }
  if (isZodOptional(schema)) {
    return zodFieldDescription(zod?._def?.innerType, fallback);
  }
  return fallback;
}

function inputsFromSchema(definition: ToolDefinition): WebsiteToolBaseline["inputs"] {
  const shape = getToolInputSchemaShape(definition);
  if (!shape) return [];

  return Object.entries(shape).map(([name, schema]) => ({
    name,
    type: zodFieldType(schema),
    required: !isZodOptional(schema),
    description: zodFieldDescription(schema, name.replace(/_/g, " ")),
  }));
}

function categoryForTool(definition: ToolDefinition): WebsiteToolCategory {
  return TOOL_CATEGORY_BY_NAME[definition.name] ?? "Blockchain";
}

export function toWebsiteToolBaseline(definition: ToolDefinition): WebsiteToolBaseline {
  return {
    name: definition.name,
    slug: toolNameToSlug(definition.name),
    title: definition.mcp?.title ?? definition.name.replace(/_/g, " "),
    summary: firstSentence(definition.description),
    description: definition.description,
    kind: familyToKind(definition.families),
    category: categoryForTool(definition),
    inputs: inputsFromSchema(definition),
  };
}

export function deriveToolAvailability(
  definition: ToolDefinition,
): WebsiteToolAvailability {
  if (definition.name.startsWith("estimate_")) {
    return "stdio";
  }
  if (STDIO_ONLY_TOOLS.has(definition.name)) {
    return "stdio";
  }
  const surfaces = definition.surfaces ?? ["mcp", "browser"];
  if (surfaces.length === 1 && surfaces[0] === "browser") {
    return "stdio";
  }
  return "both";
}

export function getHostedMcpToolDefinitions(): ToolDefinition[] {
  return filterToolDefinitions(ALL_TOOL_DEFINITIONS, HOSTED_MCP_FILTER);
}

export function getHostedMcpToolNames(): string[] {
  return getHostedMcpToolDefinitions().map((d) => d.name);
}

export function getHostedMcpToolCount(): number {
  return getHostedMcpToolDefinitions().length;
}

export function getWebsiteToolBaselines(): WebsiteToolBaseline[] {
  return filterToolDefinitions(ALL_TOOL_DEFINITIONS, { surface: "mcp" }).map(
    toWebsiteToolBaseline,
  );
}

export function getMcpToolNameSet(): Set<string> {
  return new Set(
    filterToolDefinitions(ALL_TOOL_DEFINITIONS, { surface: "mcp" }).map(
      (d: ToolDefinition) => d.name,
    ),
  );
}
