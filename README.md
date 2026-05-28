# Celina SDK

Celina-linked mainnet library for frontend apps: **reads** and **unsigned transaction preparation** (no private keys).

Pair with [wagmi](https://wagmi.sh) / viem — users sign prepared transactions in their wallet.

## Install

```bash
npm i @andrewkimjoseph/celina-sdk
```

Requires Node.js ≥ 20.

## Documentation

**Full docs:** [celina-sdk on GitBook](https://andrewkimjoseph.gitbook.io/celina-sdk)

- [Quick start](https://andrewkimjoseph.gitbook.io/celina-sdk/getting-started/quick-start)
- [wagmi integration](https://andrewkimjoseph.gitbook.io/celina-sdk/guides/wagmi-integration)
- [API reference](https://andrewkimjoseph.gitbook.io/celina-sdk/api-reference)

Docs source lives in [`docs/`](docs/) in this repository.

## Quick example

```ts
import { createCelinaClient } from "@andrewkimjoseph/celina-sdk";

const celina = createCelinaClient();

await celina.token.getStablecoinBalances("0xYourAddress");

const flow = await celina.transaction.prepareSend("0xFrom", "0xTo", "USDm", "10");
// flow.steps → pass to wagmi sendTransaction
```

## Related packages

- [`@andrewkimjoseph/celina-mcp`](https://www.npmjs.com/package/@andrewkimjoseph/celina-mcp) — MCP server for IDE/CLI agents
- [`@selfxyz/agent-sdk`](https://www.npmjs.com/package/@selfxyz/agent-sdk) — Self Agent ID

## License

MIT
