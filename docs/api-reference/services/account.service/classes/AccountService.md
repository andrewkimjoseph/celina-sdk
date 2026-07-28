[**@andrewkimjoseph/celina-sdk**](../../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../../README.md) / [services/account.service](../README.md) / AccountService

# Class: AccountService

Defined in: [src/services/account.service.ts:19](https://github.com/andrewkimjoseph/celina-sdk/blob/108a06415a8ecf8f0740dcf787117e653a3ffce0/src/services/account.service.ts#L19)

CELO mainnet account snapshot for a wallet or contract address.

## Constructors

### Constructor

> **new AccountService**(`clientFactory`): `AccountService`

Defined in: [src/services/account.service.ts:22](https://github.com/andrewkimjoseph/celina-sdk/blob/108a06415a8ecf8f0740dcf787117e653a3ffce0/src/services/account.service.ts#L22)

#### Parameters

##### clientFactory

`CeloClientFactory`

#### Returns

`AccountService`

## Methods

### getAccount()

> **getAccount**(`address`): `Promise`\<\{ `address`: `` `0x${string}` ``; `balanceCelo`: `number`; `balanceWei`: `string`; `isContract`: `boolean`; `network`: `string`; `nonce`: `number`; \}\>

Defined in: [src/services/account.service.ts:31](https://github.com/andrewkimjoseph/celina-sdk/blob/108a06415a8ecf8f0740dcf787117e653a3ffce0/src/services/account.service.ts#L31)

Fetch CELO balance, nonce, and whether the address has contract bytecode.

#### Parameters

##### address

`` `0x${string}` ``

Wallet or contract address on Celo mainnet

#### Returns

`Promise`\<\{ `address`: `` `0x${string}` ``; `balanceCelo`: `number`; `balanceWei`: `string`; `isContract`: `boolean`; `network`: `string`; `nonce`: `number`; \}\>

Balance in wei and CELO, current nonce, and `isContract` flag

***

### getAccountRegistration()

> **getAccountRegistration**(`address`): `Promise`\<\{ `accountsContract`: `"0x7d21685C17607338b313a7174bAb6620baD0aaB7"`; `address`: `` `0x${string}` ``; `isRegistered`: `boolean`; `message`: `string`; `network`: `"mainnet"`; \}\>

Defined in: [src/services/account.service.ts:53](https://github.com/andrewkimjoseph/celina-sdk/blob/108a06415a8ecf8f0740dcf787117e653a3ffce0/src/services/account.service.ts#L53)

Whether an address is registered in the Celo Accounts contract.
Required before LockedGold lock/unlock operations.

#### Parameters

##### address

`` `0x${string}` ``

#### Returns

`Promise`\<\{ `accountsContract`: `"0x7d21685C17607338b313a7174bAb6620baD0aaB7"`; `address`: `` `0x${string}` ``; `isRegistered`: `boolean`; `message`: `string`; `network`: `"mainnet"`; \}\>

***

### prepareRegisterAccount()

> **prepareRegisterAccount**(`from`): `Promise`\<[`SerializedPreparedFlow`](../../../types/prepared/interfaces/SerializedPreparedFlow.md)\>

Defined in: [src/services/account.service.ts:76](https://github.com/andrewkimjoseph/celina-sdk/blob/108a06415a8ecf8f0740dcf787117e653a3ffce0/src/services/account.service.ts#L76)

Build unsigned Accounts.createAccount() step.

#### Parameters

##### from

`` `0x${string}` ``

#### Returns

`Promise`\<[`SerializedPreparedFlow`](../../../types/prepared/interfaces/SerializedPreparedFlow.md)\>
