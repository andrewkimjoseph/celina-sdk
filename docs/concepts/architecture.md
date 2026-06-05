# Architecture

## Design principles

`createCelinaClient()` wires `CeloClientFactory` and `EnsClientFactory` into domain services. The SDK:

- Performs **public RPC reads** (balances, quotes, governance data)
- Builds **unsigned transaction payloads** for a caller-supplied `from` address
- **Does not hold CELO wallet keys** — pass prepared `steps` to wagmi/viem for signing
- **Self Agent ID** (`client.self`) optionally uses `selfAgentPrivateKey` for agent signing tools (Node only); registration sessions are in-memory (~10 min TTL)
- **Telemetry** (Node only): catalog-mapped reads emit Amplitude events named after MCP tools; opt out with `CELINA_ANALYTICS_DISABLED=1` or `analyticsEnabled: false` — see [Telemetry](../guides/telemetry.md)

Consumers pass prepared `steps` to wagmi/viem for wallet signing.

```mermaid
flowchart LR
  app[Your app]
  sdk[Celina SDK]
  rpc[Celo RPC]
  wallet[User wallet via wagmi]

  app -->|createCelinaClient| sdk
  sdk -->|reads| rpc
  app -->|prepareSend etc.| sdk
  sdk -->|SerializedPreparedFlow| app
  app -->|sendTransaction| wallet
  wallet -->|signed tx| rpc
```

## Celina stack

Celina is layered from chain logic through agent tooling:

```mermaid
flowchart TB
  sdk["celina-sdk<br/>reads + prepare* + /tools catalog"]
  mcp["celina-mcp<br/>registerSdkTools"]
  host["celina-mcp-host<br/>Streamable HTTP"]
  browser["Browser agent hosts<br/>surface: browser"]

  sdk --> mcp
  mcp --> host
  sdk --> browser
```

| Layer | Role |
|-------|------|
| **SDK** (this package) | Chain logic, `SerializedPreparedFlow`, Carbon REST hybrid, CELINA calldata tag, and `@andrewkimjoseph/celina-sdk/tools` — shared catalog for MCP and browser surfaces |
| **MCP** | Registers filtered `ALL_TOOL_DEFINITIONS`; stdio `execute_*` with server keys; hosted profile omits `execute_carbon_*` |
| **MCP host** | Public `https://mcp.usecelina.xyz/api/mcp` — **72 tools** (reads + Carbon prepare; no `execute_carbon_*`) |
| **Browser hosts** | `filterToolDefinitions(..., { surface: "browser" })` — user signs in wallet; no server keys |

Third-party apps can use the programmatic client only, or wire the tool catalog into chat APIs — see [Tool catalog](../guides/tool-catalog.md).

### Wallet address: SDK vs MCP

| Consumer | Pattern |
|----------|---------|
| **SDK in a web app** | Pass `0xYourAddress` on every read/prepare (from wagmi, Privy, etc.) |
| **celina-mcp stdio + `CELO_PRIVATE_KEY`** | Omit `address` / `wallet_address` / `from` on wallet-scoped MCP tools; optional **`get_wallet_address`** when the agent needs the string |
| **Hosted MCP** | No server key — always pass explicit addresses |

See [MCP session wallet](../guides/mcp-session-wallet.md) and [Carbon DeFi](../guides/carbon.md) for tool splits.

## Key utilities

| Export | Purpose |
|--------|---------|
| `@andrewkimjoseph/celina-sdk/tools` | Shared LLM tool catalog (`ToolDefinition`, `filterToolDefinitions`) — see [Tool catalog](../guides/tool-catalog.md) |
| `finalizeCarbonPrepare` | Merge ERC-20 approve steps into Carbon `preparedFlow.steps` after REST prepare |
| `buildCarbonExecutionSteps` | Build approve + Carbon controller steps for local signing (stdio `execute_carbon_*`) |
| `appendCelinaCalldataTag` | Append CELINA attribution suffix to prepared calldata |
| `carbonActivityDeepLink` | Post-execution activity explorer URL on celo.carbondefi.xyz |

These live in `src/utils/` and `src/config/celina-tag.ts` and are re-exported from the package entry.

## Client composition

| Property | Service | Responsibility |
|----------|---------|----------------|
| `blockchain` | BlockchainService | Blocks, transactions, network status |
| `account` | AccountService | CELO balance, nonce |
| `token` | TokenService | Balances, token registry, stablecoin scans |
| `transaction` | TransactionService | Sends, gas fees |
| `mentoFx` | MentoFxService | Mento FX quotes and swaps |
| `uniswap` | UniswapService | Uniswap v4 quotes and swaps |
| `aave` | AaveService | Aave V3 supply/withdraw |
| `gooddollar` | GoodDollarService | Identity whitelist, UBI entitlement, `prepareClaimUbi` |
| `ens` | EnsService | ENS resolution (Celo + Ethereum) |
| `governance` | GovernanceService | Celo governance proposals |
| `staking` | StakingService | Validator election staking |
| `nft` | NftService | ERC-721 / ERC-1155 reads |
| `contract` | ContractService | Generic contract calls |
| `carbon` | CarbonService | Carbon DeFi reads and unsigned prepares (REST + SDK) |
| `self` | SelfService | Self Agent ID verify, register, proof refresh (ai.self.xyz + on-chain registry) |

## Source layout

| Path | Purpose |
|------|---------|
| `src/index.ts` | Public entry — `createCelinaClient()` and type exports |
| `src/tools/` | LLM tool catalog — exported as `@andrewkimjoseph/celina-sdk/tools` |
| `src/clients/` | viem public clients (Celo + Ethereum for ENS) |
| `src/config/` | Token registry, Aave/GoodDollar/Uniswap/Carbon constants, `celina-tag` |
| `src/services/` | Domain logic — reads and `prepare*` methods |
| `src/types/prepared.ts` | `SerializedPreparedFlow` contract |
| `src/utils/` | Shared helpers — allowance simulation, `finalizeCarbonPrepare`, Carbon token normalization |

## Adding a service

1. Create `src/services/my-feature.service.ts` accepting `CeloClientFactory` in the constructor.
2. Register the instance in `src/index.ts` on `CelinaClient`.
3. Export public types from `src/index.ts` if needed by consumers.
4. Run `npm run build`, `npm run docs:api`, and bump the package version before publishing.

## Publishing

```bash
npm version patch   # or minor/major
npm run docs:api
npm publish --access public
```
