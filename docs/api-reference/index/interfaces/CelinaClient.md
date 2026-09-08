[**@andrewkimjoseph/celina-sdk**](../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../README.md) / [index](../README.md) / CelinaClient

# Interface: CelinaClient

Defined in: [src/index.ts:42](https://github.com/andrewkimjoseph/celina-sdk/blob/d1a92b5baf7555d6145bf2dd87e39acd80d0d9e3/src/index.ts#L42)

Domain services for Celo mainnet reads and unsigned transaction preparation.

## Properties

### aave

> **aave**: [`AaveService`](../../services/aave.service/classes/AaveService.md)

Defined in: [src/index.ts:56](https://github.com/andrewkimjoseph/celina-sdk/blob/d1a92b5baf7555d6145bf2dd87e39acd80d0d9e3/src/index.ts#L56)

Aave V3 `getBalances`, `prepareSupply`, and `prepareWithdraw` on Celo.

***

### account

> **account**: [`AccountService`](../../services/account.service/classes/AccountService.md)

Defined in: [src/index.ts:46](https://github.com/andrewkimjoseph/celina-sdk/blob/d1a92b5baf7555d6145bf2dd87e39acd80d0d9e3/src/index.ts#L46)

CELO balance and nonce for an address.

***

### agentKarma

> **agentKarma**: [`AgentKarmaService`](../../services/agentkarma.service/classes/AgentKarmaService.md)

Defined in: [src/index.ts:78](https://github.com/andrewkimjoseph/celina-sdk/blob/d1a92b5baf7555d6145bf2dd87e39acd80d0d9e3/src/index.ts#L78)

Optional AgentKarma reputation insight (read-only, agentkarma.io).
Ecosystem adapter: Provider/Consumer karma, ERC-8004 Celo agents, and
local trust-policy checks. Never routes, signs, or holds custody.

***

### blockchain

> **blockchain**: [`BlockchainService`](../../services/blockchain.service/classes/BlockchainService.md)

Defined in: [src/index.ts:44](https://github.com/andrewkimjoseph/celina-sdk/blob/d1a92b5baf7555d6145bf2dd87e39acd80d0d9e3/src/index.ts#L44)

Blocks, transactions, and network status.

***

### contract

> **contract**: [`ContractService`](../../services/contract.service/classes/ContractService.md)

Defined in: [src/index.ts:70](https://github.com/andrewkimjoseph/celina-sdk/blob/d1a92b5baf7555d6145bf2dd87e39acd80d0d9e3/src/index.ts#L70)

Generic contract reads, gas estimates, and write prepares.

***

### ens

> **ens**: [`EnsService`](../../services/ens.service/classes/EnsService.md)

Defined in: [src/index.ts:60](https://github.com/andrewkimjoseph/celina-sdk/blob/d1a92b5baf7555d6145bf2dd87e39acd80d0d9e3/src/index.ts#L60)

Celo and Ethereum ENS resolution.

***

### gooddollar

> **gooddollar**: [`GoodDollarService`](../../services/gooddollar.service/classes/GoodDollarService.md)

Defined in: [src/index.ts:58](https://github.com/andrewkimjoseph/celina-sdk/blob/d1a92b5baf7555d6145bf2dd87e39acd80d0d9e3/src/index.ts#L58)

GoodDollar IdentityV4 whitelist, UBI claims, and G$ ↔ USDm reserve swaps.

***

### governance

> **governance**: [`GovernanceService`](../../services/governance.service/classes/GovernanceService.md)

Defined in: [src/index.ts:62](https://github.com/andrewkimjoseph/celina-sdk/blob/d1a92b5baf7555d6145bf2dd87e39acd80d0d9e3/src/index.ts#L62)

Celo governance proposals, LockedGold locking, and voting.

***

### humanness

> **humanness**: [`HumannessService`](../../services/humanness.service/classes/HumannessService.md)

Defined in: [src/index.ts:66](https://github.com/andrewkimjoseph/celina-sdk/blob/d1a92b5baf7555d6145bf2dd87e39acd80d0d9e3/src/index.ts#L66)

Dual-rail humanness verification (Self + GoodDollar).

***

### mentoFx

> **mentoFx**: [`MentoFxService`](../../services/mento-fx.service/classes/MentoFxService.md)

Defined in: [src/index.ts:52](https://github.com/andrewkimjoseph/celina-sdk/blob/d1a92b5baf7555d6145bf2dd87e39acd80d0d9e3/src/index.ts#L52)

Mento FX quotes, estimates, and `prepareFx` flows.

***

### nft

> **nft**: [`NftService`](../../services/nft.service/classes/NftService.md)

Defined in: [src/index.ts:68](https://github.com/andrewkimjoseph/celina-sdk/blob/d1a92b5baf7555d6145bf2dd87e39acd80d0d9e3/src/index.ts#L68)

ERC-721 / ERC-1155 NFT reads.

***

### self

> **self**: [`SelfService`](../../services/self.service/classes/SelfService.md)

Defined in: [src/index.ts:72](https://github.com/andrewkimjoseph/celina-sdk/blob/d1a92b5baf7555d6145bf2dd87e39acd80d0d9e3/src/index.ts#L72)

Self Agent ID on Celo mainnet (ai.self.xyz + on-chain registry).

***

### staking

> **staking**: [`StakingService`](../../services/staking.service/classes/StakingService.md)

Defined in: [src/index.ts:64](https://github.com/andrewkimjoseph/celina-sdk/blob/d1a92b5baf7555d6145bf2dd87e39acd80d0d9e3/src/index.ts#L64)

Validator election staking reads and writes.

***

### token

> **token**: [`TokenService`](../../services/token.service/classes/TokenService.md)

Defined in: [src/index.ts:48](https://github.com/andrewkimjoseph/celina-sdk/blob/d1a92b5baf7555d6145bf2dd87e39acd80d0d9e3/src/index.ts#L48)

Token balances, metadata, and stablecoin scans.

***

### transaction

> **transaction**: [`TransactionService`](../../services/transaction.service/classes/TransactionService.md)

Defined in: [src/index.ts:50](https://github.com/andrewkimjoseph/celina-sdk/blob/d1a92b5baf7555d6145bf2dd87e39acd80d0d9e3/src/index.ts#L50)

Send estimates, gas fees, and `prepareSend` flows.

***

### uniswap

> **uniswap**: [`UniswapService`](../../services/uniswap.service/classes/UniswapService.md)

Defined in: [src/index.ts:54](https://github.com/andrewkimjoseph/celina-sdk/blob/d1a92b5baf7555d6145bf2dd87e39acd80d0d9e3/src/index.ts#L54)

Uniswap v4 quotes, estimates, and `prepareSwap` flows.
