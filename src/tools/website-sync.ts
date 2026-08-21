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
  | "Humanness"
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
  check_attribution_tag: "Blockchain",
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
  get_celo_account_registration: "Account",
  execute_register_celo_account: "Account",
  prepare_register_celo_account: "Account",
  get_gooddollar_face_verification_link: "GoodDollar",
  execute_connect_gooddollar_identity: "GoodDollar",
  execute_disconnect_gooddollar_identity: "GoodDollar",
  prepare_connect_gooddollar_identity: "GoodDollar",
  prepare_disconnect_gooddollar_identity: "GoodDollar",
  get_governance_proposals: "Governance",
  get_proposal_details: "Governance",
  get_locked_celo_balance: "Governance",
  get_pending_withdrawals: "Governance",
  get_votable_proposals: "Governance",
  get_queued_proposals: "Governance",
  get_actionable_governance_proposals: "Governance",
  get_governance_votes: "Governance",
  execute_lock_celo: "Governance",
  execute_unlock_celo: "Governance",
  execute_relock_celo: "Governance",
  execute_withdraw_celo: "Governance",
  execute_vote: "Governance",
  execute_upvote: "Governance",
  execute_revoke_governance_votes: "Governance",
  execute_revoke_governance_upvote: "Governance",
  prepare_lock_celo: "Governance",
  prepare_unlock_celo: "Governance",
  prepare_relock_celo: "Governance",
  prepare_withdraw_celo: "Governance",
  prepare_vote: "Governance",
  prepare_upvote: "Governance",
  prepare_revoke_governance_votes: "Governance",
  prepare_revoke_governance_upvote: "Governance",
  get_staking_balances: "Staking",
  get_validator_groups: "Staking",
  get_validator_group_details: "Staking",
  get_activatable_stakes: "Staking",
  get_total_staking_info: "Staking",
  get_delegation_info: "Staking",
  get_governance_delegates: "Staking",
  get_governance_delegate_details: "Staking",
  get_stake_eligibility: "Staking",
  execute_stake: "Staking",
  execute_activate_stake: "Staking",
  execute_unstake: "Staking",
  execute_delegate_power: "Staking",
  execute_undelegate_power: "Staking",
  prepare_stake: "Staking",
  prepare_activate_stake: "Staking",
  prepare_unstake: "Staking",
  prepare_delegate_power: "Staking",
  prepare_undelegate_power: "Staking",
  check_humanness: "Humanness",
  get_nft_info: "NFT",
  get_nft_balance: "NFT",
  call_contract_function: "Contract",
  estimate_contract_gas: "Contract",
  execute_contract_function: "Contract",
  prepare_contract_function: "Contract",
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
    schema?: unknown;
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

/** Peel ZodEffects (preprocess/refine) and optional/default wrappers to the core type. */
function unwrapZodLayers(schema: unknown): unknown {
  let current = schema;
  for (let i = 0; i < 8; i++) {
    const zod = unwrapZodSchema(current);
    const typeName = zod?._def?.typeName;
    if (typeName === "ZodEffects" && zod?._def?.schema !== undefined) {
      current = zod._def.schema;
      continue;
    }
    if (
      (typeName === "ZodOptional" || typeName === "ZodDefault") &&
      zod?._def?.innerType !== undefined
    ) {
      current = zod._def.innerType;
      continue;
    }
    break;
  }
  return current;
}

function isZodOptional(schema: unknown): boolean {
  let current = schema;
  for (let i = 0; i < 8; i++) {
    const zod = unwrapZodSchema(current);
    const typeName = zod?._def?.typeName;
    if (typeName === "ZodOptional" || typeName === "ZodDefault") {
      return true;
    }
    if (typeName === "ZodEffects" && zod?._def?.schema !== undefined) {
      current = zod._def.schema;
      continue;
    }
    break;
  }
  return false;
}

function zodInnerSchema(schema: unknown): unknown {
  return unwrapZodLayers(schema);
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
  const typeName = zod?._def?.typeName;
  if (typeName === "ZodEffects" && zod?._def?.schema !== undefined) {
    return zodFieldDescription(zod._def.schema, fallback);
  }
  if (typeName === "ZodOptional" || typeName === "ZodDefault") {
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
