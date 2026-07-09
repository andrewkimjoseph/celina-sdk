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

Pass optional tags when creating the client so every `prepare*` step includes them in the calldata suffix:

```ts
const celina = createCelinaClient({
  attributionTags: ["celo_862c21dd97a7", "my_app"],
  // on-chain suffix → CELINA|celo_862c21dd97a7|MY_APP
});
```

Case normalization:

- **App tags** (e.g. `my_app`, `celeste_ai`) → uppercase (`MY_APP`, `CELESTE_AI`)
- **Celo Builders tags** matching `celo_<12 hex>` → lowercase (e.g. `celo_862c21dd97a7`)
- Tags are deduped in first-seen order; the literal tag `CELINA` is never duplicated

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

The SDK targets **Celo mainnet** only. All prepared flows return `network: "mainnet"`.
