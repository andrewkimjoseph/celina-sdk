/**
 * AgentKarma reputation tools (read-only, optional ecosystem adapter).
 *
 * These expose AgentKarma (https://agentkarma.io) reputation context for Celo
 * agents through the Celina tool catalog. They are pure reads: no signing, no
 * transaction execution, no custody, no routing. `openWorldHint` is set because
 * they call an external service (agentkarma.io), unlike Celina's on-chain reads.
 */
import { z } from "zod";
import {
  optionalBooleanSchema,
  optionalEnumSchema,
  positiveIntSchema,
  requiredWalletAddressSchema,
} from "../schemas/common.js";
import type { ToolDefinition } from "../types.js";

/** Read-only external service: idempotent, open-world (agentkarma.io). */
const readOnlyOpenWorld = {
  readOnlyHint: true,
  idempotentHint: true,
  openWorldHint: true,
} as const;

/**
 * The counterparty is ALWAYS an explicit subject (required `address`). Unlike
 * Celina's on-chain reads, these tools call an external host (agentkarma.io), so
 * they must NOT silently fall back to the operator's signer wallet — that would
 * disclose the operator's identity to a third party. No `resolveWallet`, no
 * signer default: the subject must be named.
 */
const subjectAddressSchema = requiredWalletAddressSchema.describe(
  "Celo 0x address of the agent/counterparty to look up.",
);

/** Optional 0–100 score threshold; tolerates numeric strings and blanks. */
const optionalScoreSchema = z.preprocess((value: unknown) => {
  if (value === undefined || value === null || value === "") return undefined;
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed === "") return undefined;
    const parsed = Number(trimmed);
    return Number.isNaN(parsed) ? value : parsed;
  }
  return value;
}, z.number().int().min(0).max(100).optional());

export const agentKarmaToolDefinitions: ToolDefinition[] = [
  {
    name: "get_agentkarma_reputation",
    description:
      "Read AgentKarma Provider + Consumer reputation for a Celo agent wallet (read-only, agentkarma.io). Optional trust context — never routes, signs, or holds custody.",
    inputSchema: z.object({
      address: subjectAddressSchema,
      face: optionalEnumSchema(["provider", "consumer", "both"]).describe(
        "Karma face to read: provider, consumer, or both (default).",
      ),
    }),
    families: ["read"],
    surfaces: ["mcp"],
    mcp: {
      title: "Get AgentKarma Reputation",
      annotations: readOnlyOpenWorld,
    },
    handler: async (runtime, input) =>
      runtime.celina.agentKarma.getKarma(input.address as string, {
        face:
          (input.face as "provider" | "consumer" | "both" | undefined) ?? "both",
      }),
  },
  {
    name: "get_agentkarma_celo_agent",
    description:
      "Resolve a Celo ERC-8004 agent (identity + reputation) by numeric agent ID via AgentKarma (read-only).",
    inputSchema: z.object({
      agent_id: positiveIntSchema.describe("ERC-8004 agent ID on Celo."),
    }),
    families: ["read"],
    surfaces: ["mcp"],
    mcp: {
      title: "Get AgentKarma Celo Agent",
      annotations: readOnlyOpenWorld,
    },
    handler: async (runtime, input) =>
      runtime.celina.agentKarma.getCeloAgent(input.agent_id as number),
  },
  {
    name: "check_agentkarma_counterparty",
    description:
      "Evaluate a Celo counterparty against a local AgentKarma trust policy (min score, receipt-backed). Returns an explainable allow/deny decision plus the snapshot it read. Read-only — never routes, signs, or holds custody.",
    inputSchema: z.object({
      address: subjectAddressSchema,
      face: optionalEnumSchema(["provider", "consumer"]).describe(
        "Face to score the decision on (default provider).",
      ),
      min_score: optionalScoreSchema.describe(
        "Reject when the face score is below this (0–100).",
      ),
      require_receipt_backed: optionalBooleanSchema.describe(
        "Require at least one Tier-1 receipt-backed signal on the face.",
      ),
    }),
    families: ["read"],
    surfaces: ["mcp"],
    mcp: {
      title: "Check AgentKarma Counterparty",
      annotations: readOnlyOpenWorld,
    },
    handler: async (runtime, input) =>
      runtime.celina.agentKarma.evaluateCounterparty(input.address as string, {
        face: input.face as "provider" | "consumer" | undefined,
        minScore: input.min_score as number | undefined,
        requireReceiptBacked: input.require_receipt_backed as
          | boolean
          | undefined,
      }),
  },
];
