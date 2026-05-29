import type { CelinaClient } from "@andrewkimjoseph/celina-sdk";
import { getSignerAddress } from "../helpers/env.js";

export interface MainnetFixtures {
  wallet: `0x${string}`;
  usdm: `0x${string}`;
  saidContract: `0x${string}`;
  saidOwner: `0x${string}`;
  saidTokenId: string;
  validatorGroup: `0x${string}`;
  proposalId: number;
  ensName: string;
  selfAgentId: number;
  /** Known registered Self agent for read-only verification. */
  selfAgentAddress: `0x${string}`;
  erc20SymbolAbi: readonly [
    {
      readonly type: "function";
      readonly name: "symbol";
      readonly stateMutability: "view";
      readonly inputs: readonly [];
      readonly outputs: readonly [{ readonly type: "string" }];
    },
  ];
  knownTxHash: `0x${string}`;
  latestBlockNumber: bigint;
  signerAddress?: `0x${string}`;
  /** Populated by MCP enrichment when SELF_AGENT_PRIVATE_KEY is set. */
  selfVerifyRequestArgs?: Record<string, unknown>;
}

export const MAINNET_STATIC = {
  wallet: "0x471EcE3750Da237f93B8E339c536989b8978a438" as const,
  usdm: "0x765DE816845861e75A25fCA122bb6898B8B1282a" as const,
  saidContract: "0xaC3DF9ABf80d0F5c020C06B04Cced27763355944" as const,
  saidOwner: "0x62fD20ca524C13Ce836Def1c0FF8e5119476868D" as const,
  saidTokenId: "1",
  validatorGroup: "0x0861a61Bf679A30680510EcC238ee43B82C5e843" as const,
  proposalId: 293,
  ensName: "celina.eth",
  selfAgentId: 1,
  selfAgentAddress: "0xC1C860804EFdA544fe79194d1a37e60b846CEdeb" as const,
  erc20SymbolAbi: [
    {
      type: "function",
      name: "symbol",
      stateMutability: "view",
      inputs: [],
      outputs: [{ type: "string" }],
    },
  ] as const,
};

let cachedFixtures: MainnetFixtures | null = null;

/** Load stable mainnet fixtures, resolving a recent tx hash once per process. */
export async function getMainnetFixtures(
  client: CelinaClient,
): Promise<MainnetFixtures> {
  if (cachedFixtures) {
    return cachedFixtures;
  }

  const status = await client.blockchain.getNetworkStatus();
  const latestBlockNumber = BigInt(status.blockNumber);
  const block = await client.blockchain.getBlock(Number(latestBlockNumber), {
    includeTransactions: true,
  });

  const txs = block.transactions as Array<{ hash?: `0x${string}` } | string>;
  const firstTx = txs[0];
  const knownTxHash =
    typeof firstTx === "string"
      ? (firstTx as `0x${string}`)
      : (firstTx?.hash as `0x${string}`);

  if (!knownTxHash) {
    throw new Error("Could not resolve a mainnet transaction hash from latest block");
  }

  cachedFixtures = {
    ...MAINNET_STATIC,
    knownTxHash,
    latestBlockNumber,
    signerAddress: getSignerAddress(),
  };

  return cachedFixtures;
}

export function resetMainnetFixturesCache(): void {
  cachedFixtures = null;
}
