[**@andrewkimjoseph/celina-sdk**](../../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../../README.md) / [services/account.service](../README.md) / AccountService

# Class: AccountService

Defined in: [src/services/account.service.ts:3](https://github.com/andrewkimjoseph/celina-sdk/blob/16cbfaa4151cb42b8d2ee197ea5b9943e9f75af3/src/services/account.service.ts#L3)

## Constructors

### Constructor

> **new AccountService**(`clientFactory`): `AccountService`

Defined in: [src/services/account.service.ts:4](https://github.com/andrewkimjoseph/celina-sdk/blob/16cbfaa4151cb42b8d2ee197ea5b9943e9f75af3/src/services/account.service.ts#L4)

#### Parameters

##### clientFactory

`CeloClientFactory`

#### Returns

`AccountService`

## Methods

### getAccount()

> **getAccount**(`address`): `Promise`\<\{ `address`: `` `0x${string}` ``; `balanceCelo`: `number`; `balanceWei`: `string`; `isContract`: `boolean`; `network`: `string`; `nonce`: `number`; \}\>

Defined in: [src/services/account.service.ts:6](https://github.com/andrewkimjoseph/celina-sdk/blob/16cbfaa4151cb42b8d2ee197ea5b9943e9f75af3/src/services/account.service.ts#L6)

#### Parameters

##### address

`` `0x${string}` ``

#### Returns

`Promise`\<\{ `address`: `` `0x${string}` ``; `balanceCelo`: `number`; `balanceWei`: `string`; `isContract`: `boolean`; `network`: `string`; `nonce`: `number`; \}\>
