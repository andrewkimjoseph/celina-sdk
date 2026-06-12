<p align="center">
  <img src="../assets/celina-banner.png" alt="Celina — Give your LLM a wallet on Celo">
</p>

# Celina operations test framework

Live Celo mainnet smoke tests driven by a single operation catalog in `tests/catalog/operations.ts`. Add one `OperationSpec` when you ship a new SDK method or MCP tool.

## Commands

```bash
# celina-sdk
npm test          # live mainnet SDK smoke (catalog)
npm run test:unit # pure helpers (no RPC)

# celina-mcp
npm test          # build + live MCP smoke + registry parity
npm run test:unit # MCP helper unit tests
```

## Environment matrix

| Variable | Effect |
|----------|--------|
| *(none)* | Read-only mainnet smoke tests |
| `CELO_RPC_URL_MAINNET` | Optional RPC override (default: `https://forno.celo.org`) |
| `ETH_RPC_URL_MAINNET` | ENS resolution on Ethereum |
| `CELO_PRIVATE_KEY` | Enables estimates and prepare flows that need a signer address |
| `CELINA_TEST_WRITES=1` | **Plus** `CELO_PRIVATE_KEY`: runs on-chain writes (`send_token`, `execute_mento_fx`, Aave supply/withdraw) |
| `SELF_AGENT_PRIVATE_KEY` | Self auth tools (`sign_self_request`, `authenticated_self_fetch`, `get_self_identity`) |
| `CELINA_TEST_SELF_VERIFY=1` | **Plus** `SELF_AGENT_PRIVATE_KEY`: builds signed fixture for `verify_self_request` |
| `CELINA_TEST_SELF_SESSION` | Poll a pending Self session via `check_self_registration` |
| `CELINA_TEST_DESTRUCTIVE=1` | Self lifecycle mutations (`register_self_agent`, `refresh_self_proof`, `deregister_self_agent`) |

Writes and destructive Self flows are **off by default** so `npm test` does not spend funds or mutate agent state accidentally.

## Adding a new operation

1. Implement the SDK service method in `src/services/` (if applicable).
2. Add the MCP wrapper in `celina-mcp/src/tools/` (if exposed).
3. Append one `OperationSpec` to `tests/catalog/domains/*.ts` (aggregated in `operations.ts`).
4. Run `npm test` in `celina-sdk`, then `celina-mcp`.
5. `registry-parity.test.ts` fails if an MCP tool lacks a catalog entry.

`celina-mcp` imports the shared catalog via `@andrewkimjoseph/celina-sdk/testing` (published with the SDK package).

### OperationSpec shape

```ts
{
  id: "domain.methodName",
  domain: "token",
  layer: "read" | "write" | "prepare",
  requiresEnv?: ["CELO_PRIVATE_KEY" | "SELF_AGENT_PRIVATE_KEY"],
  requiresWrites?: true,       // needs CELINA_TEST_WRITES=1
  requiresDestructive?: true,  // needs CELINA_TEST_DESTRUCTIVE=1
  sdk?: { invoke(client, fixtures) { ... } },
  mcp?: { tool: "snake_case_tool", arguments(fixtures) { ... } },
  assert(result, fixtures) { ... },
  skip?: () => string | undefined,
}
```

At least one of `sdk` or `mcp` must be set. SDK-only prepare methods (no MCP tool yet) still belong in the catalog for SDK regression.

**Naming:** `sdk.invoke` uses the **camelCase** TypeScript client API (`pageSize`, `tokenIn`, …). `mcp.arguments` must use **snake_case tool input keys only** (`page_size`, `token_in`, …) — never copy SDK option names into MCP arguments. Unit tests enforce this for every `MCP_OPERATIONS` entry.

## Fixtures

Stable mainnet constants live in `tests/fixtures/mainnet.ts`. A recent transaction hash is resolved once per process from the latest block.

## Architecture

```
fixtures/mainnet.ts ──► catalog/operations.ts ──► sdk-operations.test.ts
                                              └──► celina-mcp/mcp-tools.test.ts
                                              └──► registry-parity.test.ts
```
