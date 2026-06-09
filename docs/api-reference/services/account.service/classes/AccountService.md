[**@andrewkimjoseph/celina-sdk**](../../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../../README.md) / [services/account.service](../README.md) / AccountService

# Class: AccountService

Defined in: [src/services/account.service.ts:7](https://github.com/andrewkimjoseph/celina-sdk/blob/799ca3b35fabfa75db63588d6f0b7b89da8e5271/src/services/account.service.ts#L7)

CELO mainnet account snapshot for a wallet or contract address.

## Constructors

### Constructor

> **new AccountService**(`clientFactory`): `AccountService`

Defined in: [src/services/account.service.ts:8](https://github.com/andrewkimjoseph/celina-sdk/blob/799ca3b35fabfa75db63588d6f0b7b89da8e5271/src/services/account.service.ts#L8)

#### Parameters

##### clientFactory

`CeloClientFactory`

#### Returns

`AccountService`

## Methods

### getAccount()

> **getAccount**(`address`): `Promise`\<\{ `address`: `` `0x${string}` ``; `balanceCelo`: `number`; `balanceWei`: `string`; `isContract`: `boolean`; `network`: `string`; `nonce`: `number`; \}\>

Defined in: [src/services/account.service.ts:15](https://github.com/andrewkimjoseph/celina-sdk/blob/799ca3b35fabfa75db63588d6f0b7b89da8e5271/src/services/account.service.ts#L15)

Fetch CELO balance, nonce, and whether the address has contract bytecode.

#### Parameters

##### address

`` `0x${string}` ``

Wallet or contract address on Celo mainnet

#### Returns

`Promise`\<\{ `address`: `` `0x${string}` ``; `balanceCelo`: `number`; `balanceWei`: `string`; `isContract`: `boolean`; `network`: `string`; `nonce`: `number`; \}\>

Balance in wei and CELO, current nonce, and `isContract` flag
