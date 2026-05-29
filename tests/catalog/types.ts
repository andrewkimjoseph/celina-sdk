import type { CelinaClient } from "@andrewkimjoseph/celina-sdk";
import type { MainnetFixtures } from "../fixtures/mainnet.js";

export type OperationLayer = "read" | "write" | "prepare";

export type EnvRequirement = "CELO_PRIVATE_KEY" | "SELF_AGENT_PRIVATE_KEY";

export interface OperationSpec {
  /** Stable id, e.g. `token.getTokenBalance`. */
  id: string;
  domain: string;
  layer: OperationLayer;
  requiresEnv?: EnvRequirement[];
  /** On-chain writes (`send_token`, `execute_mento_fx`, Aave supply/withdraw). */
  requiresWrites?: boolean;
  /** Self register / deregister / refresh flows. */
  requiresDestructive?: boolean;
  sdk?: {
    invoke: (client: CelinaClient, fx: MainnetFixtures) => Promise<unknown>;
  };
  mcp?: {
    tool: string;
    arguments: (fx: MainnetFixtures) => Record<string, unknown>;
  };
  assert: (result: unknown, fx: MainnetFixtures) => void;
  skip?: () => string | undefined;
}
