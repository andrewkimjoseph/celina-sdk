import { selfDemoUrl } from "../../config/self.js";
import { z } from "zod";
import {
  addressSchema,
  httpRequestPathSchema,
  optionalAgeLiteralSchema,
  optionalBooleanSchema,
  optionalEnumSchema,
  optionalHexKeySchema,
  optionalPositiveIntSchema,
  optionalStringSchema,
  positiveIntSchema,
} from "../schemas/common.js";
import type { ToolDefinition } from "../types.js";

const SELF_DEMO_VERIFY_URL = selfDemoUrl("/api/demo/verify");

const selfRegistrationModeSchema = optionalEnumSchema([
  "wallet-free",
  "linked",
  "smartwallet",
  "self-custody",
  "ed25519",
  "ed25519-linked",
]);

function requireSelf(runtime: import("../types.js").ToolRuntime) {
  const self = runtime.executors?.self;
  if (!self) {
    throw new Error("Self executor not configured.");
  }
  return self;
}

export const selfToolDefinitions: ToolDefinition[] = [
  {
    name: "verify_self_agent",
    description:
      "Verify whether an agent address is backed by a real human on Self Agent ID (Celo mainnet). Defaults to requiring age 18+ and OFAC-clear credentials; pass require_age: 0 or require_ofac: false to relax.",
    inputSchema: z.object({
      agent_address: addressSchema,
      require_age: optionalAgeLiteralSchema,
      require_ofac: optionalBooleanSchema,
      require_self_provider: optionalBooleanSchema,
    }),
    families: ["read"],
    surfaces: ["mcp"],
    mcp: {
      title: "Verify Self Agent",
      annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
    handler: async (runtime, input) =>
      requireSelf(runtime).verifyAgent(input),
  },
  {
    name: "lookup_self_agent",
    description:
      "Look up a Self Agent ID by numeric on-chain ID. Returns credentials with ofac_clear (all OFAC checks passed) and ofac_checks — a labeled array where clear: true means not on that sanctions list.",
    inputSchema: z.object({
      agent_id: positiveIntSchema,
    }),
    families: ["read"],
    surfaces: ["mcp"],
    mcp: {
      title: "Look Up Self Agent",
      annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
    handler: async (runtime, input) =>
      requireSelf(runtime).lookupAgent(input.agent_id as number),
  },
  {
    name: "verify_self_request",
    description:
      "Verify incoming HTTP request headers signed by a Self Agent (not file system access).",
    inputSchema: z.object({
      agent_signature: z.string().regex(/^0x[a-fA-F0-9]+$/),
      agent_timestamp: z.string(),
      method: z.string(),
      request_path: httpRequestPathSchema,
      body: optionalStringSchema,
      keytype: optionalStringSchema,
      agent_key: optionalHexKeySchema,
    }),
    families: ["read"],
    surfaces: ["mcp"],
    mcp: {
      title: "Verify Self Agent Request",
      annotations: { readOnlyHint: true, idempotentHint: true },
    },
    handler: async (runtime, input) =>
      requireSelf(runtime).verifyRequest(input),
  },
  {
    name: "register_self_agent",
    description:
      "Start Self Agent ID registration. Returns qr_code_url and deep_link — present BOTH to the user. Default mode: wallet-free — omit mode for a standalone agent wallet. Use linked only when binding to a human's existing wallet (pass human_address). Defaults to minimum_age 18, nationality disclosure, and OFAC screening (Self agents must not be tied to OFAC-listed humans). Pass minimum_age: 0, nationality: false, or ofac: false to opt out.",
    inputSchema: z.object({
      mode: selfRegistrationModeSchema.describe(
        "Registration mode. Default wallet-free when omitted. Use linked only with human_address to tie the agent to an existing human wallet.",
      ),
      minimum_age: optionalAgeLiteralSchema,
      ofac: optionalBooleanSchema,
      nationality: optionalBooleanSchema,
      human_address: addressSchema.optional(),
      agent_name: optionalStringSchema,
      agent_description: optionalStringSchema,
    }),
    families: ["execute"],
    surfaces: ["mcp"],
    requiresEnv: ["SELF_SESSION"],
    mcp: {
      title: "Register Self Agent",
      annotations: { destructiveHint: true, openWorldHint: true },
      responseKind: "self_session",
    },
    handler: async (runtime, input) =>
      requireSelf(runtime).registerAgent(input),
  },
  {
    name: "check_self_registration",
    description:
      "Poll a pending Self registration, proof refresh, or deregistration session.",
    inputSchema: z.object({
      session_id: z.string(),
    }),
    families: ["read"],
    surfaces: ["mcp"],
    requiresEnv: ["SELF_SESSION"],
    mcp: {
      title: "Check Self Registration",
      annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
    handler: async (runtime, input) =>
      requireSelf(runtime).checkRegistration(input.session_id as string),
  },
  {
    name: "get_self_identity",
    description:
      "Return the configured Self agent identity. Requires SELF_AGENT_PRIVATE_KEY.",
    inputSchema: z.object({}),
    families: ["read"],
    surfaces: ["mcp"],
    requiresEnv: ["SELF_AGENT_PRIVATE_KEY"],
    mcp: {
      title: "Get Self Agent Identity",
      annotations: { readOnlyHint: true, idempotentHint: true },
    },
    handler: async (runtime) => requireSelf(runtime).getIdentity(),
  },
  {
    name: "refresh_self_proof",
    description:
      "Start a human proof refresh after on-chain proof expiry. Returns qr_code_url and deep_link.",
    inputSchema: z.object({
      agent_id: optionalPositiveIntSchema,
    }),
    families: ["execute"],
    surfaces: ["mcp"],
    requiresEnv: ["SELF_AGENT_PRIVATE_KEY"],
    mcp: {
      title: "Refresh Self Proof",
      annotations: { openWorldHint: true },
      responseKind: "self_session",
    },
    handler: async (runtime, input) =>
      requireSelf(runtime).refreshProof(input),
  },
  {
    name: "deregister_self_agent",
    description:
      "Start irreversible Self agent deregistration. Returns qr_code_url and deep_link.",
    inputSchema: z.object({}),
    families: ["execute"],
    surfaces: ["mcp"],
    requiresEnv: ["SELF_AGENT_PRIVATE_KEY"],
    mcp: {
      title: "Deregister Self Agent",
      annotations: { destructiveHint: true, openWorldHint: true },
      responseKind: "self_session",
    },
    handler: async (runtime) => requireSelf(runtime).deregisterAgent(),
  },
  {
    name: "sign_self_request",
    description: `Sign an HTTP request with the configured Self agent. Demo verify: POST ${SELF_DEMO_VERIFY_URL}`,
    inputSchema: z.object({
      method: z.enum(["GET", "POST", "PUT", "DELETE"]),
      url: z.string().url(),
      body: optionalStringSchema,
    }),
    families: ["read"],
    surfaces: ["mcp"],
    requiresEnv: ["SELF_AGENT_PRIVATE_KEY"],
    mcp: {
      title: "Sign Self Agent Request",
      annotations: { readOnlyHint: true, idempotentHint: true },
    },
    handler: async (runtime, input) => requireSelf(runtime).signRequest(input),
  },
  {
    name: "authenticated_self_fetch",
    description: `HTTP request with Self Agent ID auth headers. Demo: ?network=celo-mainnet — ${SELF_DEMO_VERIFY_URL}`,
    inputSchema: z.object({
      method: z.enum(["GET", "POST", "PUT", "DELETE"]),
      url: z.string().url(),
      body: optionalStringSchema,
      content_type: optionalStringSchema,
    }),
    families: ["execute"],
    surfaces: ["mcp"],
    requiresEnv: ["SELF_AGENT_PRIVATE_KEY"],
    mcp: {
      title: "Authenticated Self Fetch",
      annotations: { openWorldHint: true },
    },
    handler: async (runtime, input) =>
      requireSelf(runtime).authenticatedFetch(input),
  },
];
