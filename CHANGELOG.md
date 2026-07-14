# Changelog

## 0.15.0

- **`createAAClient({ attributionTags })`** — optional tags applied in `sendPreparedFlow` via `appendCelinaCalldataTag` (same dual legacy + ERC-8021 format as `prepare*`). Omit for pass-through; `[]` still applies platform-only Celina dual tags.
- Docs: Account Abstraction, configuration, and prepared-flow guides updated for AA attribution.

## 0.14.0

- **`createAAClient`** — ERC-4337 Simple Smart Account (EntryPoint 0.7) with app-owned gas sponsorship (`GasSponsorshipService`, v1 Pimlico). `sendPreparedFlow` / `deriveSmartAccountAddress`.
- **Prepared flows** — `PreparedFlow` / `SerializedPreparedFlow` use `chainId: 42220` (`celo.id`) instead of `network: "mainnet"`.
- MCP remains EOA/`CELO_PRIVATE_KEY` for `execute_*`; no Celina-hosted sponsorship API keys.
