import { describe, expect, it, vi } from "vitest";
import { GoodDollarService } from "../../src/services/gooddollar.service.js";
import type { CeloClientFactory } from "../../src/clients/celo-client.js";

const ROOT = "0x1111111111111111111111111111111111111111" as const;
const SECONDARY = "0x2222222222222222222222222222222222222222" as const;

function mockFactory() {
  return {
    getClients: () => ({ public: {} }),
    getConfig: () => ({}),
  } as unknown as CeloClientFactory;
}

describe("GoodDollarService.prepareConnectIdentity", () => {
  it("throws guidance-aware error when signer is not whitelisted root", async () => {
    const service = new GoodDollarService(mockFactory());
    vi.spyOn(service, "getIdentityLink").mockResolvedValue({
      address: ROOT,
      contract: "0x0000000000000000000000000000000000000001",
      whitelistedRoot: null,
      isConnectedWallet: false,
      isWhitelistedRoot: false,
      connectedTo: null,
      checkedAddress: ROOT,
      isWhitelisted: false,
    });
    vi.spyOn(service, "getWhitelistingInfo").mockResolvedValue({
      address: ROOT,
      whitelistedRoot: null,
      isConnectedWallet: false,
      checkedAddress: ROOT,
      isWhitelisted: false,
      contract: "0x0000000000000000000000000000000000000001",
      status: 0,
      statusLabel: "none",
      whitelistedOn: null,
      lastAuthenticatedOn: null,
      fieldDescriptions: {
        whitelistedOn: "",
        lastAuthenticatedOn: "",
      },
      reverification: null,
      identity: {
        dateAuthenticated: 0,
        dateAdded: 0,
        did: "",
        whitelistedOnChainId: 42220,
        status: 0,
        authCount: 0,
      },
    });

    await expect(service.prepareConnectIdentity(ROOT, SECONDARY)).rejects.toThrow(
      /not a whitelisted GoodDollar identity root/,
    );
    await expect(service.prepareConnectIdentity(ROOT, SECONDARY)).rejects.toThrow(
      /execute_connect_gooddollar_identity/,
    );
  });
});
