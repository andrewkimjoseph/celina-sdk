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

All options are optional. Omit them to use the public Celo Forno endpoint.

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
