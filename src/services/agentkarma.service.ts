/**
 * AgentKarma reputation adapter (read-only).
 *
 * AgentKarma (https://agentkarma.io) is the reputation layer for autonomous
 * on-chain agents. This service is a thin, optional ecosystem adapter over
 * `@agentkarma/sdk`: it reads Provider/Consumer karma and ERC-8004 Celo agent
 * data, and evaluates a local trust policy. It is pinned to Celo — the chain
 * Celina operates on.
 *
 * Boundaries (mirrors the AgentKarma SDK's own contract):
 *  - read-only: never signs, never executes a transaction, never holds custody.
 *  - non-routing: never proxies an agent call; it only reads reputation.
 *  - no private keys / no env requirement.
 *
 * It is intentionally NOT wrapped in Celina's Amplitude analytics proxy: this
 * is an external reputation service, not a Celo on-chain read Celina tracks.
 */
import {
  createAgentKarmaClient,
  evaluateTrust,
  type AgentKarmaClient,
  type CeloAgentSnapshot,
  type ClientConfig,
  type KarmaFaceData,
  type KarmaSnapshot,
  type TrustDecision,
  type TrustPolicy,
} from "@agentkarma/sdk";
import {
  agentKarmaTools,
  runAgentKarmaTool,
  type AgentKarmaToolDescriptor,
} from "@agentkarma/sdk/tools";

/** Config for the AgentKarma adapter. Defaults to https://agentkarma.io. */
export type AgentKarmaServiceConfig = ClientConfig;

/** Which karma face(s) to read. A wallet always carries both. */
export type AgentKarmaFace = "provider" | "consumer" | "both";

/** Options for a karma read. */
export interface GetKarmaOptions {
  /** Face to read. Defaults to `"both"`. */
  face?: AgentKarmaFace;
}

/** Result of a local counterparty trust evaluation. */
export interface CounterpartyDecision {
  /** Always `"celo"` — this adapter is Celo-pinned. */
  chain: "celo";
  /** The wallet that was evaluated. */
  wallet: string;
  /** Explainable allow/deny from the local policy (no network, pure function). */
  decision: TrustDecision;
  /** The karma snapshot the decision was computed from. */
  snapshot: KarmaSnapshot;
}

const CELINA_USER_AGENT = "@andrewkimjoseph/celina-sdk (+@agentkarma/sdk adapter)";

/** Celo (EVM) address shape. AgentKarma keys Celo agents by 0x address. */
const CELO_ADDRESS_RE = /^0x[a-fA-F0-9]{40}$/;

function assertCeloAddress(wallet: string): void {
  if (typeof wallet !== "string" || !CELO_ADDRESS_RE.test(wallet)) {
    throw new Error(
      `AgentKarma: wallet must be a Celo 0x address (40 hex chars), got "${wallet}"`,
    );
  }
}

/**
 * Read-only AgentKarma reputation insight for Celo agents.
 *
 * Exposed from `createCelinaClient()` as `client.agentKarma`.
 */
export class AgentKarmaService {
  private readonly client: AgentKarmaClient;

  /** This adapter only ever talks to AgentKarma on the Celo chain. */
  readonly chain = "celo" as const;

  constructor(config: AgentKarmaServiceConfig = {}) {
    this.client = createAgentKarmaClient({
      ...config,
      userAgent: config.userAgent ?? CELINA_USER_AGENT,
    });
  }

  /** AgentKarma API base URL the adapter reads from. */
  get baseUrl(): string {
    return this.client.baseUrl;
  }

  /** The canonical `@agentkarma/sdk/tools` descriptors this adapter draws from. */
  get catalog(): readonly AgentKarmaToolDescriptor[] {
    return agentKarmaTools;
  }

  /**
   * Execute a tool from the canonical `@agentkarma/sdk/tools` catalog,
   * Celo-pinned. This is how Celina consumes the SHARED tool catalog instead of
   * re-implementing each AgentKarma call: the names, schemas, arg-coercion, and
   * handler logic all live in `@agentkarma/sdk`. `chain` is forced to `'celo'`.
   * @param name - A catalog tool name (e.g. `get_karma`, `get_celo_agent`).
   * @param input - Tool arguments; `chain` is overridden to `'celo'`.
   */
  runCatalogTool(
    name: string,
    input: Record<string, unknown> = {},
  ): Promise<unknown> {
    return runAgentKarmaTool(this.client, name, { ...input, chain: "celo" });
  }

  /**
   * Provider + Consumer karma for a Celo agent wallet. Always queries Celo.
   * Routed through the shared catalog's `get_karma` tool.
   * @param wallet - Celo `0x` agent/wallet address to look up.
   * @param options - Optional face selector (defaults to `"both"`).
   */
  async getKarma(
    wallet: string,
    options: GetKarmaOptions = {},
  ): Promise<KarmaSnapshot> {
    assertCeloAddress(wallet);
    return this.runCatalogTool("get_karma", {
      wallet,
      face: options.face ?? "both",
    }) as Promise<KarmaSnapshot>;
  }

  /**
   * Resolve a Celo ERC-8004 agent (IdentityRegistry + ReputationRegistry)
   * and its AgentKarma reputation by numeric agent ID. Routed through the
   * shared catalog's `get_celo_agent` tool.
   * @param agentId - Positive integer ERC-8004 agent ID on Celo.
   */
  async getCeloAgent(agentId: number): Promise<CeloAgentSnapshot> {
    return this.runCatalogTool("get_celo_agent", {
      agent_id: agentId,
    }) as Promise<CeloAgentSnapshot>;
  }

  /**
   * Fetch Celo karma and run a local, explainable trust policy against it.
   * Pure evaluation — no routing, no signing, no side effects.
   *
   * Always fetches BOTH faces so whichever face `policy.face` scores on
   * (`provider` by default) is guaranteed present — there is intentionally no
   * separate fetch-face knob to drift out of sync with the scored face.
   * @param wallet - Celo `0x` counterparty address.
   * @param policy - Local trust policy (face, minScore, requireReceiptBacked, …).
   */
  async evaluateCounterparty(
    wallet: string,
    policy: TrustPolicy = {},
  ): Promise<CounterpartyDecision> {
    const snapshot = await this.getKarma(wallet, { face: "both" });
    const decision = evaluateTrust(snapshot, policy);
    return { chain: "celo", wallet, decision, snapshot };
  }
}

// Re-export the AgentKarma types Celina consumers need so they can type against
// the adapter without taking a direct `@agentkarma/sdk` import.
export type {
  CeloAgentSnapshot,
  KarmaFaceData,
  KarmaSnapshot,
  TrustDecision,
  TrustPolicy,
};
