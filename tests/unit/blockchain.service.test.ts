import { describe, expect, it, vi } from "vitest";
import type { PublicClient } from "viem";
import type { CeloClientFactory } from "../../src/clients/celo-client.js";
import { BlockchainService } from "../../src/services/blockchain.service.js";

describe("BlockchainService.getBlock", () => {
  it("returns JSON-serializable transactions when includeTransactions is true", async () => {
    const mockBlock = {
      number: 68_614_021n,
      hash: "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" as const,
      timestamp: 1_700_000_000n,
      parentHash:
        "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb" as const,
      gasUsed: 15_000_000n,
      gasLimit: 30_000_000n,
      miner: "0xcccccccccccccccccccccccccccccccccccccccc" as const,
      transactions: [
        {
          hash: "0xdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd" as const,
          from: "0x1111111111111111111111111111111111111111" as const,
          to: "0x2222222222222222222222222222222222222222" as const,
          value: 1_000_000_000_000_000_000n,
          nonce: 42,
          gas: 21_000n,
          gasPrice: 5_000_000_000n,
          input: "0x" as const,
          blockNumber: 68_614_021n,
          transactionIndex: 0,
          type: "legacy",
        },
      ],
    };

    const getBlock = vi.fn().mockResolvedValue(mockBlock);
    const clientFactory = {
      getClients: () => ({
        public: { getBlock } as unknown as PublicClient,
      }),
    } as CeloClientFactory;

    const service = new BlockchainService(clientFactory);
    const result = await service.getBlock(68_614_021, {
      includeTransactions: true,
    });

    expect(getBlock).toHaveBeenCalledWith({
      blockNumber: 68_614_021n,
      includeTransactions: true,
    });
    expect(() => JSON.stringify(result)).not.toThrow();
    expect(result.transactions).toEqual([
      expect.objectContaining({
        hash: mockBlock.transactions[0]!.hash,
        value: "1000000000000000000",
        gas: "21000",
        gasPrice: "5000000000",
        blockNumber: "68614021",
      }),
    ]);
  });
});
