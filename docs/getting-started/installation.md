# Installation

```bash
npm i @andrewkimjoseph/celina-sdk
```

## Requirements

- **Node.js** ≥ 20
- A Celo mainnet RPC URL (defaults to `https://forno.celo.org`)
- Optional: Ethereum RPC URL for ENS resolution on Ethereum mainnet

## Peer dependencies

The SDK uses [viem](https://viem.sh) internally. For wallet signing in the browser, pair it with [wagmi](https://wagmi.sh):

```bash
npm i wagmi viem @tanstack/react-query
```

Celina SDK prepares unsigned transactions; wagmi/viem handles signing and broadcasting.
