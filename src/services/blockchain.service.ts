/**
 * Chain reads: network status, blocks, and transaction lookups on Celo mainnet.
 */
import type { CeloClientFactory } from "../clients/celo-client.js";

type TransactionSummaryInput = {
  hash: `0x${string}`;
  from: `0x${string}`;
  to: `0x${string}` | null;
  value: bigint;
  nonce: number;
  gas: bigint;
  gasPrice?: bigint | null;
  input: `0x${string}`;
  blockNumber?: bigint | null;
  transactionIndex?: number | null;
  type?: string;
};

function serializeTransactionSummary(
  tx: TransactionSummaryInput,
  extras?: {
    gasUsed: bigint;
    status?: string;
  },
) {
  const base = {
    hash: tx.hash,
    from: tx.from,
    to: tx.to,
    value: tx.value.toString(),
    valueCelo: Number(tx.value) / 1e18,
    nonce: tx.nonce,
    gas: tx.gas.toString(),
    gasPrice: tx.gasPrice?.toString(),
    gasPriceGwei: tx.gasPrice ? Number(tx.gasPrice) / 1e9 : undefined,
    input: tx.input,
    blockNumber: tx.blockNumber?.toString(),
    transactionIndex: tx.transactionIndex,
    type: tx.type,
  };

  if (!extras) {
    return base;
  }

  const gasEfficiency =
    tx.gas > 0n
      ? Number((extras.gasUsed * 10000n) / tx.gas) / 100
      : 0;

  return {
    ...base,
    gasUsed: extras.gasUsed.toString(),
    gasEfficiency,
    ...(extras.status !== undefined ? { status: extras.status } : {}),
  };
}

/** Celo mainnet block and transaction queries. */
export class BlockchainService {
  constructor(private readonly clientFactory: CeloClientFactory) {}

  /**
   * Celo mainnet chain id, latest block number, and current gas price.
   * @returns Network metadata including `chainId`, `blockNumber`, and `gasPriceWei`
   */
  async getNetworkStatus() {
    const { public: client } = this.clientFactory.getClients();
    const [chainId, blockNumber, gasPrice] = await Promise.all([
      client.getChainId(),
      client.getBlockNumber(),
      client.getGasPrice(),
    ]);

    return {
      network: "mainnet",
      chainId,
      blockNumber: blockNumber.toString(),
      gasPriceWei: gasPrice.toString(),
    };
  }

  /**
   * Fetch a block by number, hash, or tag.
   * @param blockId - Block number, hash, `latest`, or `pending`
   * @param options.includeTransactions - When true, include full transaction objects
   * @returns Block header fields and optional transaction list
   * @throws When the block is not found
   */
  async getBlock(
    blockId: number | string | "latest" | "pending",
    options?: { includeTransactions?: boolean },
  ) {
    const { public: client } = this.clientFactory.getClients();
    const includeTransactions = options?.includeTransactions ?? false;

    const blockParams =
      typeof blockId === "number"
        ? {
            blockNumber: BigInt(blockId),
            includeTransactions,
          }
        : blockId === "latest" || blockId === "pending"
          ? {
              blockTag: blockId as "latest" | "pending",
              includeTransactions,
            }
          : {
              blockHash: blockId as `0x${string}`,
              includeTransactions,
            };

    const block = await client.getBlock(blockParams);

    if (!block) {
      throw new Error(`Block not found: ${blockId}`);
    }

    const gasUtilization =
      block.gasLimit > 0n
        ? Number((block.gasUsed * 10000n) / block.gasLimit) / 100
        : 0;

    return {
      number: block.number?.toString(),
      hash: block.hash,
      timestamp: block.timestamp.toString(),
      parentHash: block.parentHash,
      gasUsed: block.gasUsed.toString(),
      gasLimit: block.gasLimit.toString(),
      gasUtilization,
      miner: block.miner,
      transactionCount: block.transactions.length,
      transactions: includeTransactions
        ? block.transactions.map((tx) =>
            typeof tx === "string"
              ? tx
              : serializeTransactionSummary(tx as TransactionSummaryInput),
          )
        : undefined,
    };
  }

  /**
   * List recent blocks ending at the chain tip (newest last in the array).
   * @param count - Number of blocks to return (1–100, default 5)
   * @param offset - Skip this many blocks from the tip before collecting
   * @returns Summary fields per block (no full transaction payloads)
   */
  async getLatestBlocks(count = 5, offset = 0) {
    const { public: client } = this.clientFactory.getClients();
    const latest = await client.getBlockNumber();
    const safeCount = Math.min(Math.max(count, 1), 100);
    const safeOffset = Math.max(offset, 0);
    const start = latest - BigInt(safeOffset + safeCount - 1);

    const blocks = await Promise.all(
      Array.from({ length: safeCount }, (_, index) =>
        client.getBlock({ blockNumber: start + BigInt(index) }),
      ),
    );

    return blocks.filter(Boolean).map((block) => {
      const gasUtilization =
        block!.gasLimit > 0n
          ? Number((block!.gasUsed * 10000n) / block!.gasLimit) / 100
          : 0;
      return {
        number: block!.number?.toString(),
        hash: block!.hash,
        timestamp: block!.timestamp.toString(),
        transactionCount: block!.transactions.length,
        gasUsed: block!.gasUsed.toString(),
        gasLimit: block!.gasLimit.toString(),
        gasUtilization,
      };
    });
  }

  /**
   * Fetch a transaction and its receipt by hash.
   * @param hash - Transaction hash
   * @returns Transaction fields, gas efficiency, and receipt status when mined
   * @throws When the transaction is not found
   */
  async getTransaction(hash: `0x${string}`) {
    const { public: client } = this.clientFactory.getClients();
    const [tx, receipt] = await Promise.all([
      client.getTransaction({ hash }),
      client.getTransactionReceipt({ hash }),
    ]);

    if (!tx) {
      throw new Error(`Transaction not found: ${hash}`);
    }

    return serializeTransactionSummary(tx as TransactionSummaryInput, {
      gasUsed: receipt?.gasUsed ?? 0n,
      status: receipt?.status,
    });
  }
}
