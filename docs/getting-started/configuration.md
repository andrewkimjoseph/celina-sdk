# Configuration

## createCelinaClient options

```ts
import { createCelinaClient } from "@andrewkimjoseph/celina-sdk";

const celina = createCelinaClient({
  rpcUrl: "https://forno.celo.org",
  ethRpcUrl: "https://ethereum.publicnode.com",
});
```

| Option | Type | Default | Purpose |
|--------|------|---------|---------|
| `rpcUrl` | `string` | `https://forno.celo.org` | Celo mainnet JSON-RPC endpoint |
| `ethRpcUrl` | `string` | — | Ethereum mainnet RPC for ENS resolution |
| `attributionTags` | `string[]` | — | Custom on-chain calldata tags after `CELINA` (see below) |

All options are optional. Omit them to use the public Celo Forno endpoint.

## Attribution tags

Pass optional tags when creating the client so every `prepare*` step includes them in **both** attribution suffix layers (legacy UTF-8 + ERC-8021):

```ts
const celina = createCelinaClient({
  attributionTags: ["celo_862c21dd97a7", "my_app"],
  // legacy → CELINA|celo_862c21dd97a7|MY_APP
  // ERC-8021 → toDataSuffix(["celina", "celo_862c21dd97a7", "my_app"])
});
```

Case normalization:

- **Legacy layer:** app tags uppercase (`MY_APP`); `celo_<12 hex>` lowercase
- **ERC-8021 layer:** all codes lowercase (`celina`, `celo_862c21dd97a7`, `my_app`)
- Tags are deduped in first-seen order; the literal tag `CELINA` is never duplicated

Prefer `check_attribution_tag` (MCP/browser tool) or `checkAttributionInCalldata` from the SDK to list custom tags or confirm one. Use `verify_attribution_tag` / `verifyAttributionInCalldata` when you need the raw legacy and ERC-8021 layers.

See [Prepared flows](../concepts/prepared-flows.md) for how the suffix is applied.

## SdkConfig type

```ts
import type { SdkConfig, CelinaClientOptions } from "@andrewkimjoseph/celina-sdk";

// CelinaClientOptions is Partial<SdkConfig>
```

## RPC recommendations

- **Development:** Public Forno (`https://forno.celo.org`) works for reads and gas estimates.
- **Production:** Use a dedicated RPC provider (Alchemy, Infura, QuickNode) for rate limits and reliability.
- **ENS:** `ethRpcUrl` is only needed for `celina.ens.resolveEns(name, "ethereum")`. Celo ENS works through the Celo RPC.

## Network scope

The SDK targets **Celo mainnet** only. All prepared flows return `chainId: 42220` (`celo.id` / `CHAIN.id`).

## Account Abstraction

Sponsored UserOps use a separate factory — **`createAAClient`** — with an explicit `gasSponsorship` provider object (v1: `provider: "pimlico"` + `pimlico.apiKey`). Credentials stay in your app; Celina MCP does not host them.

Optional **`attributionTags`** on `createAAClient` apply Celina dual tags in `sendPreparedFlow` (same as `createCelinaClient` / `prepare*`). Omit them to pass step calldata through unchanged.

See [Account Abstraction](../guides/account-abstraction.md).
