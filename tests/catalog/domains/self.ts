import type { OperationSpec } from "../types.js";
import { assertHasKeys } from "../../helpers/assert.js";

const SELF_DEMO_VERIFY_URL =
  "https://app.ai.self.xyz/api/demo/verify?network=celo-mainnet";

export const selfOperations: OperationSpec[] = [
  {
    id: "self.verifySelfAgent",
    domain: "self",
    layer: "read",
    sdk: {
      invoke: (client, fx) =>
        client.self.verifyAgent({ agentAddress: fx.selfAgentAddress }),
    },
    mcp: {
      tool: "verify_self_agent",
      arguments: (fx) => ({
        agent_address: fx.selfAgentAddress,
      }),
    },
    assert: (result) => {
      assertHasKeys(result, ["verified"]);
    },
  },
  {
    id: "self.lookupSelfAgent",
    domain: "self",
    layer: "read",
    sdk: {
      invoke: (client, fx) => client.self.lookupAgent(fx.selfAgentId),
    },
    mcp: {
      tool: "lookup_self_agent",
      arguments: (fx) => ({
        agent_id: fx.selfAgentId,
      }),
    },
    assert: (result) => {
      assertHasKeys(result, ["agentId"]);
    },
  },
  {
    id: "self.verifySelfRequest",
    domain: "self",
    layer: "read",
    requiresEnv: ["SELF_AGENT_PRIVATE_KEY"],
    sdk: {
      invoke: (client, fx) => {
        const args = fx.selfVerifyRequestArgs ?? {};
        return client.self.verifyRequest({
          agentSignature: args.agent_signature as `0x${string}`,
          agentTimestamp: String(args.agent_timestamp),
          method: String(args.method),
          path: String(args.request_path ?? args.path),
          body: typeof args.body === "string" ? args.body : undefined,
          keytype: typeof args.keytype === "string" ? args.keytype : undefined,
          agentKey: args.agent_key as `0x${string}` | undefined,
        });
      },
    },
    mcp: {
      tool: "verify_self_request",
      arguments: (fx) => fx.selfVerifyRequestArgs ?? {},
    },
    skip: () =>
      process.env.CELINA_TEST_SELF_VERIFY === "1"
        ? undefined
        : "Set CELINA_TEST_SELF_VERIFY=1 (MCP suite enriches signed fixture in beforeAll)",
    assert: (result) => {
      assertHasKeys(result, ["valid"]);
    },
  },
  {
    id: "self.registerSelfAgent",
    domain: "self",
    layer: "write",
    requiresDestructive: true,
    sdk: {
      invoke: (client) =>
        client.self.registerAgent({
          mode: "wallet-free",
          agentName: "celina-test",
        }),
    },
    mcp: {
      tool: "register_self_agent",
      arguments: () => ({
        mode: "wallet-free",
        agent_name: "celina-test",
      }),
    },
    assert: (result) => {
      assertHasKeys(result, ["session_id"]);
    },
  },
  {
    id: "self.checkSelfRegistration",
    domain: "self",
    layer: "read",
    sdk: {
      invoke: (client) =>
        client.self.checkRegistration(
          process.env.CELINA_TEST_SELF_SESSION ?? "missing-session",
        ),
    },
    mcp: {
      tool: "check_self_registration",
      arguments: () => ({
        session_id: process.env.CELINA_TEST_SELF_SESSION ?? "missing-session",
      }),
    },
    skip: () =>
      process.env.CELINA_TEST_SELF_SESSION
        ? undefined
        : "Set CELINA_TEST_SELF_SESSION to poll a pending Self session",
    assert: (result) => {
      assertHasKeys(result, ["status"]);
    },
  },
  {
    id: "self.getSelfIdentity",
    domain: "self",
    layer: "read",
    requiresEnv: ["SELF_AGENT_PRIVATE_KEY"],
    sdk: {
      invoke: (client) => client.self.getIdentity(),
    },
    mcp: {
      tool: "get_self_identity",
      arguments: () => ({}),
    },
    assert: (result) => {
      const obj = result as Record<string, unknown>;
      assertHasKeys(obj, obj.registered === false ? ["registered"] : ["address"]);
    },
  },
  {
    id: "self.refreshSelfProof",
    domain: "self",
    layer: "write",
    requiresEnv: ["SELF_AGENT_PRIVATE_KEY"],
    requiresDestructive: true,
    sdk: {
      invoke: (client) => client.self.refreshProof(),
    },
    mcp: {
      tool: "refresh_self_proof",
      arguments: () => ({}),
    },
    assert: (result) => {
      assertHasKeys(result, ["session_id"]);
    },
  },
  {
    id: "self.deregisterSelfAgent",
    domain: "self",
    layer: "write",
    requiresEnv: ["SELF_AGENT_PRIVATE_KEY"],
    requiresDestructive: true,
    sdk: {
      invoke: (client) => client.self.deregisterAgent(),
    },
    mcp: {
      tool: "deregister_self_agent",
      arguments: () => ({}),
    },
    assert: (result) => {
      assertHasKeys(result, ["session_id"]);
    },
  },
  {
    id: "self.signSelfRequest",
    domain: "self",
    layer: "read",
    requiresEnv: ["SELF_AGENT_PRIVATE_KEY"],
    sdk: {
      invoke: (client) =>
        client.self.signRequest({
          method: "GET",
          url: SELF_DEMO_VERIFY_URL,
        }),
    },
    mcp: {
      tool: "sign_self_request",
      arguments: () => ({
        method: "GET",
        url: SELF_DEMO_VERIFY_URL,
      }),
    },
    assert: (result) => {
      assertHasKeys(result, ["headers"]);
    },
  },
  {
    id: "self.authenticatedSelfFetch",
    domain: "self",
    layer: "read",
    requiresEnv: ["SELF_AGENT_PRIVATE_KEY"],
    sdk: {
      invoke: (client) =>
        client.self.authenticatedFetch({
          method: "POST",
          url: SELF_DEMO_VERIFY_URL,
          body: JSON.stringify({ ping: true }),
        }),
    },
    mcp: {
      tool: "authenticated_self_fetch",
      arguments: () => ({
        method: "POST",
        url: SELF_DEMO_VERIFY_URL,
        body: JSON.stringify({ ping: true }),
      }),
    },
    assert: (result) => {
      assertHasKeys(result, ["status"]);
    },
  },
];
