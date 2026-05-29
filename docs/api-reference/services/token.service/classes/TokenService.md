[**@andrewkimjoseph/celina-sdk**](../../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../../README.md) / [services/token.service](../README.md) / TokenService

# Class: TokenService

Defined in: [src/services/token.service.ts:17](https://github.com/andrewkimjoseph/celina-sdk/blob/16cbfaa4151cb42b8d2ee197ea5b9943e9f75af3/src/services/token.service.ts#L17)

## Constructors

### Constructor

> **new TokenService**(`clientFactory`): `TokenService`

Defined in: [src/services/token.service.ts:18](https://github.com/andrewkimjoseph/celina-sdk/blob/16cbfaa4151cb42b8d2ee197ea5b9943e9f75af3/src/services/token.service.ts#L18)

#### Parameters

##### clientFactory

`CeloClientFactory`

#### Returns

`TokenService`

## Methods

### getBalances()

> **getBalances**(`address`, `tokens?`): `Promise`\<\{ `address`: `` `0x${string}` ``; `balances`: (\{ `address`: `"native"`; `formatted`: `string`; `raw`: `string`; `token`: `string`; \} \| \{ `address`: `` `0x${string}` ``; `formatted`: `string`; `raw`: `string`; `token`: `string`; \})[]; `network`: `"mainnet"`; \}\>

Defined in: [src/services/token.service.ts:60](https://github.com/andrewkimjoseph/celina-sdk/blob/16cbfaa4151cb42b8d2ee197ea5b9943e9f75af3/src/services/token.service.ts#L60)

CELO and ERC-20 balances for registry tokens (defaults: CELO, USDm).

#### Parameters

##### address

`` `0x${string}` ``

##### tokens?

`string`[] = `...`

#### Returns

`Promise`\<\{ `address`: `` `0x${string}` ``; `balances`: (\{ `address`: `"native"`; `formatted`: `string`; `raw`: `string`; `token`: `string`; \} \| \{ `address`: `` `0x${string}` ``; `formatted`: `string`; `raw`: `string`; `token`: `string`; \})[]; `network`: `"mainnet"`; \}\>

***

### getStablecoinBalances()

> **getStablecoinBalances**(`address`, `options?`): `Promise`\<\{ `address`: `` `0x${string}` ``; `network`: `string`; `stablecoins`: (\{ `address`: `` `0x${string}` ``; `formatted`: `string`; `issuer`: `string`; `raw`: `string`; `readError`: `boolean`; `symbol`: `string`; `useCase`: `string`; \} \| \{ `address`: `` `0x${string}` ``; `formatted`: `string`; `issuer`: `string`; `raw`: `string`; `readError?`: `undefined`; `symbol`: `string`; `useCase`: `string`; \})[]; `totalChecked`: `number`; \}\>

Defined in: [src/services/token.service.ts:105](https://github.com/andrewkimjoseph/celina-sdk/blob/16cbfaa4151cb42b8d2ee197ea5b9943e9f75af3/src/services/token.service.ts#L105)

Scan registry stablecoins for an address; omits zero balances by default.

#### Parameters

##### address

`` `0x${string}` ``

Wallet to scan

##### options?

###### includeZero?

`boolean`

Include tokens with zero balance

###### stablecoins?

`string`[]

Subset of registry symbols to check

#### Returns

`Promise`\<\{ `address`: `` `0x${string}` ``; `network`: `string`; `stablecoins`: (\{ `address`: `` `0x${string}` ``; `formatted`: `string`; `issuer`: `string`; `raw`: `string`; `readError`: `boolean`; `symbol`: `string`; `useCase`: `string`; \} \| \{ `address`: `` `0x${string}` ``; `formatted`: `string`; `issuer`: `string`; `raw`: `string`; `readError?`: `undefined`; `symbol`: `string`; `useCase`: `string`; \})[]; `totalChecked`: `number`; \}\>

***

### getTokenBalance()

> **getTokenBalance**(`token`, `accountAddress`): `Promise`\<\{ `accountAddress`: `` `0x${string}` ``; `decimals`: `number`; `formatted`: `string`; `name`: `string`; `network`: `"mainnet"`; `raw`: `string`; `symbol`: `string`; `tokenAddress`: `"native"`; \} \| \{ `accountAddress`: `` `0x${string}` ``; `decimals`: `number`; `formatted`: `string`; `name`: `string`; `network`: `"mainnet"`; `raw`: `string`; `symbol`: `string`; `tokenAddress`: `` `0x${string}` ``; \}\>

Defined in: [src/services/token.service.ts:164](https://github.com/andrewkimjoseph/celina-sdk/blob/16cbfaa4151cb42b8d2ee197ea5b9943e9f75af3/src/services/token.service.ts#L164)

Balance for a Celo mainnet registry token (symbol or registry address).

#### Parameters

##### token

`string`

##### accountAddress

`` `0x${string}` ``

#### Returns

`Promise`\<\{ `accountAddress`: `` `0x${string}` ``; `decimals`: `number`; `formatted`: `string`; `name`: `string`; `network`: `"mainnet"`; `raw`: `string`; `symbol`: `string`; `tokenAddress`: `"native"`; \} \| \{ `accountAddress`: `` `0x${string}` ``; `decimals`: `number`; `formatted`: `string`; `name`: `string`; `network`: `"mainnet"`; `raw`: `string`; `symbol`: `string`; `tokenAddress`: `` `0x${string}` ``; \}\>

***

### getTokenInfo()

> **getTokenInfo**(`token`): `Promise`\<\{ `address`: `` `0x${string}` `` \| `"native"`; `decimals`: `number`; `name`: `string`; `network`: `"mainnet"`; `symbol`: `string`; \}\>

Defined in: [src/services/token.service.ts:47](https://github.com/andrewkimjoseph/celina-sdk/blob/16cbfaa4151cb42b8d2ee197ea5b9943e9f75af3/src/services/token.service.ts#L47)

Fetch registry token metadata on Celo mainnet.

#### Parameters

##### token

`string`

#### Returns

`Promise`\<\{ `address`: `` `0x${string}` `` \| `"native"`; `decimals`: `number`; `name`: `string`; `network`: `"mainnet"`; `symbol`: `string`; \}\>

***

### parseAmount()

> **parseAmount**(`amount`, `decimals`): `bigint`

Defined in: [src/services/token.service.ts:202](https://github.com/andrewkimjoseph/celina-sdk/blob/16cbfaa4151cb42b8d2ee197ea5b9943e9f75af3/src/services/token.service.ts#L202)

#### Parameters

##### amount

`string`

##### decimals

`number`

#### Returns

`bigint`

***

### resolveToken()

> **resolveToken**(`token`): [`ResolvedToken`](../interfaces/ResolvedToken.md)

Defined in: [src/services/token.service.ts:24](https://github.com/andrewkimjoseph/celina-sdk/blob/16cbfaa4151cb42b8d2ee197ea5b9943e9f75af3/src/services/token.service.ts#L24)

Resolve a Celo mainnet registry token by symbol, alias, or registry address.

#### Parameters

##### token

`string`

#### Returns

[`ResolvedToken`](../interfaces/ResolvedToken.md)

#### Throws

If the token is not in the Celo registry
