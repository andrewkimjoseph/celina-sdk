[**@andrewkimjoseph/celina-sdk**](../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../README.md) / [index](../README.md) / CelinaClient

# Interface: CelinaClient

Defined in: [src/index.ts:41](https://github.com/andrewkimjoseph/celina-sdk/blob/be01eb873c2753717e97a5aa979160c630e5980b/src/index.ts#L41)

Domain services for Celo mainnet reads and unsigned transaction preparation.

## Properties

### aave

> **aave**: [`AaveService`](../../services/aave.service/classes/AaveService.md)

Defined in: [src/index.ts:55](https://github.com/andrewkimjoseph/celina-sdk/blob/be01eb873c2753717e97a5aa979160c630e5980b/src/index.ts#L55)

Aave V3 `getBalances`, `prepareSupply`, and `prepareWithdraw` on Celo.

***

### account

> **account**: [`AccountService`](../../services/account.service/classes/AccountService.md)

Defined in: [src/index.ts:45](https://github.com/andrewkimjoseph/celina-sdk/blob/be01eb873c2753717e97a5aa979160c630e5980b/src/index.ts#L45)

CELO balance and nonce for an address.

***

### agentKarma

> **agentKarma**: [`AgentKarmaService`](../../services/agentkarma.service/classes/AgentKarmaService.md)

Defined in: [src/index.ts:77](https://github.com/andrewkimjoseph/celina-sdk/blob/be01eb873c2753717e97a5aa979160c630e5980b/src/index.ts#L77)

Optional AgentKarma reputation insight (read-only, agentkarma.io).
Ecosystem adapter: Provider/Consumer karma, ERC-8004 Celo agents, and
local trust-policy checks. Never routes, signs, or holds custody.

***

### blockchain

> **blockchain**: [`BlockchainService`](../../services/blockchain.service/classes/BlockchainService.md)

Defined in: [src/index.ts:43](https://github.com/andrewkimjoseph/celina-sdk/blob/be01eb873c2753717e97a5aa979160c630e5980b/src/index.ts#L43)

Blocks, transactions, and network status.

***

### contract

> **contract**: [`ContractService`](../../services/contract.service/classes/ContractService.md)

Defined in: [src/index.ts:69](https://github.com/andrewkimjoseph/celina-sdk/blob/be01eb873c2753717e97a5aa979160c630e5980b/src/index.ts#L69)

Generic contract reads, gas estimates, and write prepares.

***

### ens

> **ens**: [`EnsService`](../../services/ens.service/classes/EnsService.md)

Defined in: [src/index.ts:59](https://github.com/andrewkimjoseph/celina-sdk/blob/be01eb873c2753717e97a5aa979160c630e5980b/src/index.ts#L59)

Celo and Ethereum ENS resolution.

***

### gooddollar

> **gooddollar**: [`GoodDollarService`](../../services/gooddollar.service/classes/GoodDollarService.md)

Defined in: [src/index.ts:57](https://github.com/andrewkimjoseph/celina-sdk/blob/be01eb873c2753717e97a5aa979160c630e5980b/src/index.ts#L57)

GoodDollar IdentityV4 whitelist, UBI claims, and G$ ↔ USDm reserve swaps.

***

### governance

> **governance**: [`GovernanceService`](../../services/governance.service/classes/GovernanceService.md)

Defined in: [src/index.ts:61](https://github.com/andrewkimjoseph/celina-sdk/blob/be01eb873c2753717e97a5aa979160c630e5980b/src/index.ts#L61)

Celo governance proposals, LockedGold locking, and voting.

***

### humanness

> **humanness**: [`HumannessService`](../../services/humanness.service/classes/HumannessService.md)

Defined in: [src/index.ts:65](https://github.com/andrewkimjoseph/celina-sdk/blob/be01eb873c2753717e97a5aa979160c630e5980b/src/index.ts#L65)

Dual-rail humanness verification (Self + GoodDollar).

***

### mentoFx

> **mentoFx**: [`MentoFxService`](../../services/mento-fx.service/classes/MentoFxService.md)

Defined in: [src/index.ts:51](https://github.com/andrewkimjoseph/celina-sdk/blob/be01eb873c2753717e97a5aa979160c630e5980b/src/index.ts#L51)

Mento FX quotes, estimates, and `prepareFx` flows.

***

### nft

> **nft**: [`NftService`](../../services/nft.service/classes/NftService.md)

Defined in: [src/index.ts:67](https://github.com/andrewkimjoseph/celina-sdk/blob/be01eb873c2753717e97a5aa979160c630e5980b/src/index.ts#L67)

ERC-721 / ERC-1155 NFT reads.

***

### self

> **self**: [`SelfService`](../../services/self.service/classes/SelfService.md)

Defined in: [src/index.ts:71](https://github.com/andrewkimjoseph/celina-sdk/blob/be01eb873c2753717e97a5aa979160c630e5980b/src/index.ts#L71)

Self Agent ID on Celo mainnet (ai.self.xyz + on-chain registry).

***

### staking

> **staking**: [`StakingService`](../../services/staking.service/classes/StakingService.md)

Defined in: [src/index.ts:63](https://github.com/andrewkimjoseph/celina-sdk/blob/be01eb873c2753717e97a5aa979160c630e5980b/src/index.ts#L63)

Validator election staking reads and writes.

***

### token

> **token**: [`TokenService`](../../services/token.service/classes/TokenService.md)

Defined in: [src/index.ts:47](https://github.com/andrewkimjoseph/celina-sdk/blob/be01eb873c2753717e97a5aa979160c630e5980b/src/index.ts#L47)

Token balances, metadata, and stablecoin scans.

***

### transaction

> **transaction**: [`TransactionService`](../../services/transaction.service/classes/TransactionService.md)

Defined in: [src/index.ts:49](https://github.com/andrewkimjoseph/celina-sdk/blob/be01eb873c2753717e97a5aa979160c630e5980b/src/index.ts#L49)

Send estimates, gas fees, and `prepareSend` flows.

***

### uniswap

> **uniswap**: [`UniswapService`](../../services/uniswap.service/classes/UniswapService.md)

Defined in: [src/index.ts:53](https://github.com/andrewkimjoseph/celina-sdk/blob/be01eb873c2753717e97a5aa979160c630e5980b/src/index.ts#L53)

Uniswap v4 quotes, estimates, and `prepareSwap` flows.
