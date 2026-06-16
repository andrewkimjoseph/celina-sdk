[**@andrewkimjoseph/celina-sdk**](../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../README.md) / [index](../README.md) / CelinaClient

# Interface: CelinaClient

Defined in: [src/index.ts:30](https://github.com/andrewkimjoseph/celina-sdk/blob/5ca8be517fae54f45a80efded22f3312ee23795e/src/index.ts#L30)

Domain services for Celo mainnet reads and unsigned transaction preparation.

## Properties

### aave

> **aave**: [`AaveService`](../../services/aave.service/classes/AaveService.md)

Defined in: [src/index.ts:44](https://github.com/andrewkimjoseph/celina-sdk/blob/5ca8be517fae54f45a80efded22f3312ee23795e/src/index.ts#L44)

Aave V3 `getBalances`, `prepareSupply`, and `prepareWithdraw` on Celo.

***

### account

> **account**: [`AccountService`](../../services/account.service/classes/AccountService.md)

Defined in: [src/index.ts:34](https://github.com/andrewkimjoseph/celina-sdk/blob/5ca8be517fae54f45a80efded22f3312ee23795e/src/index.ts#L34)

CELO balance and nonce for an address.

***

### blockchain

> **blockchain**: [`BlockchainService`](../../services/blockchain.service/classes/BlockchainService.md)

Defined in: [src/index.ts:32](https://github.com/andrewkimjoseph/celina-sdk/blob/5ca8be517fae54f45a80efded22f3312ee23795e/src/index.ts#L32)

Blocks, transactions, and network status.

***

### contract

> **contract**: [`ContractService`](../../services/contract.service/classes/ContractService.md)

Defined in: [src/index.ts:56](https://github.com/andrewkimjoseph/celina-sdk/blob/5ca8be517fae54f45a80efded22f3312ee23795e/src/index.ts#L56)

Generic read-only contract calls and gas estimates.

***

### ens

> **ens**: [`EnsService`](../../services/ens.service/classes/EnsService.md)

Defined in: [src/index.ts:48](https://github.com/andrewkimjoseph/celina-sdk/blob/5ca8be517fae54f45a80efded22f3312ee23795e/src/index.ts#L48)

Celo and Ethereum ENS resolution.

***

### gooddollar

> **gooddollar**: [`GoodDollarService`](../../services/gooddollar.service/classes/GoodDollarService.md)

Defined in: [src/index.ts:46](https://github.com/andrewkimjoseph/celina-sdk/blob/5ca8be517fae54f45a80efded22f3312ee23795e/src/index.ts#L46)

GoodDollar IdentityV4 whitelist, UBI claims, and G$ ↔ USDm reserve swaps.

***

### governance

> **governance**: [`GovernanceService`](../../services/governance.service/classes/GovernanceService.md)

Defined in: [src/index.ts:50](https://github.com/andrewkimjoseph/celina-sdk/blob/5ca8be517fae54f45a80efded22f3312ee23795e/src/index.ts#L50)

Celo governance proposals and details.

***

### mentoFx

> **mentoFx**: [`MentoFxService`](../../services/mento-fx.service/classes/MentoFxService.md)

Defined in: [src/index.ts:40](https://github.com/andrewkimjoseph/celina-sdk/blob/5ca8be517fae54f45a80efded22f3312ee23795e/src/index.ts#L40)

Mento FX quotes, estimates, and `prepareFx` flows.

***

### nft

> **nft**: [`NftService`](../../services/nft.service/classes/NftService.md)

Defined in: [src/index.ts:54](https://github.com/andrewkimjoseph/celina-sdk/blob/5ca8be517fae54f45a80efded22f3312ee23795e/src/index.ts#L54)

ERC-721 / ERC-1155 NFT reads.

***

### self

> **self**: [`SelfService`](../../services/self.service/classes/SelfService.md)

Defined in: [src/index.ts:58](https://github.com/andrewkimjoseph/celina-sdk/blob/5ca8be517fae54f45a80efded22f3312ee23795e/src/index.ts#L58)

Self Agent ID on Celo mainnet (ai.self.xyz + on-chain registry).

***

### staking

> **staking**: [`StakingService`](../../services/staking.service/classes/StakingService.md)

Defined in: [src/index.ts:52](https://github.com/andrewkimjoseph/celina-sdk/blob/5ca8be517fae54f45a80efded22f3312ee23795e/src/index.ts#L52)

Validator election staking reads.

***

### token

> **token**: [`TokenService`](../../services/token.service/classes/TokenService.md)

Defined in: [src/index.ts:36](https://github.com/andrewkimjoseph/celina-sdk/blob/5ca8be517fae54f45a80efded22f3312ee23795e/src/index.ts#L36)

Token balances, metadata, and stablecoin scans.

***

### transaction

> **transaction**: [`TransactionService`](../../services/transaction.service/classes/TransactionService.md)

Defined in: [src/index.ts:38](https://github.com/andrewkimjoseph/celina-sdk/blob/5ca8be517fae54f45a80efded22f3312ee23795e/src/index.ts#L38)

Send estimates, gas fees, and `prepareSend` flows.

***

### uniswap

> **uniswap**: [`UniswapService`](../../services/uniswap.service/classes/UniswapService.md)

Defined in: [src/index.ts:42](https://github.com/andrewkimjoseph/celina-sdk/blob/5ca8be517fae54f45a80efded22f3312ee23795e/src/index.ts#L42)

Uniswap v4 quotes, estimates, and `prepareSwap` flows.
