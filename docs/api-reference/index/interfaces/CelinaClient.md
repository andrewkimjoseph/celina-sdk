[**@andrewkimjoseph/celina-sdk**](../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../README.md) / [index](../README.md) / CelinaClient

# Interface: CelinaClient

Defined in: [src/index.ts:27](https://github.com/andrewkimjoseph/celina-sdk/blob/b6ab035ea248bbfea2d9505d3330e4be605f0253/src/index.ts#L27)

Domain services for Celo mainnet reads and unsigned transaction preparation.

## Properties

### aave

> **aave**: [`AaveService`](../../services/aave.service/classes/AaveService.md)

Defined in: [src/index.ts:39](https://github.com/andrewkimjoseph/celina-sdk/blob/b6ab035ea248bbfea2d9505d3330e4be605f0253/src/index.ts#L39)

Aave V3 `prepareSupply` and `prepareWithdraw` flows on Celo.

***

### account

> **account**: [`AccountService`](../../services/account.service/classes/AccountService.md)

Defined in: [src/index.ts:31](https://github.com/andrewkimjoseph/celina-sdk/blob/b6ab035ea248bbfea2d9505d3330e4be605f0253/src/index.ts#L31)

CELO balance and nonce for an address.

***

### blockchain

> **blockchain**: [`BlockchainService`](../../services/blockchain.service/classes/BlockchainService.md)

Defined in: [src/index.ts:29](https://github.com/andrewkimjoseph/celina-sdk/blob/b6ab035ea248bbfea2d9505d3330e4be605f0253/src/index.ts#L29)

Blocks, transactions, and network status.

***

### contract

> **contract**: [`ContractService`](../../services/contract.service/classes/ContractService.md)

Defined in: [src/index.ts:51](https://github.com/andrewkimjoseph/celina-sdk/blob/b6ab035ea248bbfea2d9505d3330e4be605f0253/src/index.ts#L51)

Generic read-only contract calls and gas estimates.

***

### ens

> **ens**: [`EnsService`](../../services/ens.service/classes/EnsService.md)

Defined in: [src/index.ts:43](https://github.com/andrewkimjoseph/celina-sdk/blob/b6ab035ea248bbfea2d9505d3330e4be605f0253/src/index.ts#L43)

Celo and Ethereum ENS resolution.

***

### gooddollar

> **gooddollar**: [`GoodDollarService`](../../services/gooddollar.service/classes/GoodDollarService.md)

Defined in: [src/index.ts:41](https://github.com/andrewkimjoseph/celina-sdk/blob/b6ab035ea248bbfea2d9505d3330e4be605f0253/src/index.ts#L41)

GoodDollar IdentityV4 whitelist status.

***

### governance

> **governance**: [`GovernanceService`](../../services/governance.service/classes/GovernanceService.md)

Defined in: [src/index.ts:45](https://github.com/andrewkimjoseph/celina-sdk/blob/b6ab035ea248bbfea2d9505d3330e4be605f0253/src/index.ts#L45)

Celo governance proposals and details.

***

### mentoFx

> **mentoFx**: [`MentoFxService`](../../services/mento-fx.service/classes/MentoFxService.md)

Defined in: [src/index.ts:37](https://github.com/andrewkimjoseph/celina-sdk/blob/b6ab035ea248bbfea2d9505d3330e4be605f0253/src/index.ts#L37)

Mento FX quotes, estimates, and `prepareFx` flows.

***

### nft

> **nft**: [`NftService`](../../services/nft.service/classes/NftService.md)

Defined in: [src/index.ts:49](https://github.com/andrewkimjoseph/celina-sdk/blob/b6ab035ea248bbfea2d9505d3330e4be605f0253/src/index.ts#L49)

ERC-721 / ERC-1155 NFT reads.

***

### staking

> **staking**: [`StakingService`](../../services/staking.service/classes/StakingService.md)

Defined in: [src/index.ts:47](https://github.com/andrewkimjoseph/celina-sdk/blob/b6ab035ea248bbfea2d9505d3330e4be605f0253/src/index.ts#L47)

Validator election staking reads.

***

### token

> **token**: [`TokenService`](../../services/token.service/classes/TokenService.md)

Defined in: [src/index.ts:33](https://github.com/andrewkimjoseph/celina-sdk/blob/b6ab035ea248bbfea2d9505d3330e4be605f0253/src/index.ts#L33)

Token balances, metadata, and stablecoin scans.

***

### transaction

> **transaction**: [`TransactionService`](../../services/transaction.service/classes/TransactionService.md)

Defined in: [src/index.ts:35](https://github.com/andrewkimjoseph/celina-sdk/blob/b6ab035ea248bbfea2d9505d3330e4be605f0253/src/index.ts#L35)

Send estimates, gas fees, and `prepareSend` flows.
