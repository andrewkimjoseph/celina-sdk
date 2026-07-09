# AccountService

[**@andrewkimjoseph/celina-sdk**](../../../)

***

[@andrewkimjoseph/celina-sdk](../../../) / [services/account.service](https://github.com/andrewkimjoseph/celina-sdk/blob/main/docs/api-reference/services/account.service/README.md) / AccountService

## Class: AccountService

Defined in: [src/services/account.service.ts:7](https://github.com/andrewkimjoseph/celina-sdk/blob/2ff9e44d247fc85ce400a4b07de79a8872532d5d/src/services/account.service.ts#L7)

CELO mainnet account snapshot for a wallet or contract address.

### Constructors

#### Constructor

> **new AccountService**(`clientFactory`): `AccountService`

Defined in: [src/services/account.service.ts:8](https://github.com/andrewkimjoseph/celina-sdk/blob/2ff9e44d247fc85ce400a4b07de79a8872532d5d/src/services/account.service.ts#L8)

**Parameters**

**clientFactory**

`CeloClientFactory`

**Returns**

`AccountService`

### Methods

#### getAccount()

> **getAccount**(`address`): `Promise`<{ `address`: `` `0x${string}` ``; `balanceCelo`: `number`; `balanceWei`: `string`; `isContract`: `boolean`; `network`: `string`; `nonce`: `number`; }>

Defined in: [src/services/account.service.ts:15](https://github.com/andrewkimjoseph/celina-sdk/blob/2ff9e44d247fc85ce400a4b07de79a8872532d5d/src/services/account.service.ts#L15)

Fetch CELO balance, nonce, and whether the address has contract bytecode.

**Parameters**

**address**

`` `0x${string}` ``

Wallet or contract address on Celo mainnet

**Returns**

`Promise`<{ `address`: `` `0x${string}` ``; `balanceCelo`: `number`; `balanceWei`: `string`; `isContract`: `boolean`; `network`: `string`; `nonce`: `number`; }>

Balance in wei and CELO, current nonce, and `isContract` flag
