[**@andrewkimjoseph/celina-sdk**](../../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../../README.md) / [services/token.service](../README.md) / TokenService

# Class: TokenService

Defined in: [src/services/token.service.ts:16](https://github.com/andrewkimjoseph/celina-sdk/blob/b6ab035ea248bbfea2d9505d3330e4be605f0253/src/services/token.service.ts#L16)

## Constructors

### Constructor

> **new TokenService**(`clientFactory`): `TokenService`

Defined in: [src/services/token.service.ts:17](https://github.com/andrewkimjoseph/celina-sdk/blob/b6ab035ea248bbfea2d9505d3330e4be605f0253/src/services/token.service.ts#L17)

#### Parameters

##### clientFactory

`CeloClientFactory`

#### Returns

`TokenService`

## Methods

### getBalances()

> **getBalances**(`address`, `tokens?`): `Promise`\<\{ `address`: `` `0x${string}` ``; `balances`: `object`[]; `network`: `string`; \}\>

Defined in: [src/services/token.service.ts:92](https://github.com/andrewkimjoseph/celina-sdk/blob/b6ab035ea248bbfea2d9505d3330e4be605f0253/src/services/token.service.ts#L92)

CELO and ERC-20 balances for specific tokens (defaults: CELO, USDm).

#### Parameters

##### address

`` `0x${string}` ``

##### tokens?

`string`[] = `...`

#### Returns

`Promise`\<\{ `address`: `` `0x${string}` ``; `balances`: `object`[]; `network`: `string`; \}\>

***

### getStablecoinBalances()

> **getStablecoinBalances**(`address`, `options?`): `Promise`\<\{ `address`: `` `0x${string}` ``; `network`: `string`; `stablecoins`: (\{ `address`: `` `0x${string}` ``; `formatted`: `string`; `issuer`: `string`; `raw`: `string`; `readError`: `boolean`; `symbol`: `string`; `useCase`: `string`; \} \| \{ `address`: `` `0x${string}` ``; `formatted`: `string`; `issuer`: `string`; `raw`: `string`; `readError?`: `undefined`; `symbol`: `string`; `useCase`: `string`; \})[]; `totalChecked`: `number`; \}\>

Defined in: [src/services/token.service.ts:148](https://github.com/andrewkimjoseph/celina-sdk/blob/b6ab035ea248bbfea2d9505d3330e4be605f0253/src/services/token.service.ts#L148)

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

> **getTokenBalance**(`tokenAddress`, `accountAddress`): `Promise`\<\{ `accountAddress`: `` `0x${string}` ``; `decimals`: `number`; `formatted`: `string`; `name`: `string`; `network`: `"mainnet"`; `raw`: `string`; `symbol`: `string`; `tokenAddress`: `` `0x${string}` ``; \}\>

Defined in: [src/services/token.service.ts:207](https://github.com/andrewkimjoseph/celina-sdk/blob/b6ab035ea248bbfea2d9505d3330e4be605f0253/src/services/token.service.ts#L207)

ERC-20 balance for a specific token contract address.

#### Parameters

##### tokenAddress

`` `0x${string}` ``

##### accountAddress

`` `0x${string}` ``

#### Returns

`Promise`\<\{ `accountAddress`: `` `0x${string}` ``; `decimals`: `number`; `formatted`: `string`; `name`: `string`; `network`: `"mainnet"`; `raw`: `string`; `symbol`: `string`; `tokenAddress`: `` `0x${string}` ``; \}\>

***

### getTokenInfo()

> **getTokenInfo**(`token`): `Promise`\<\{ `address`: `` `0x${string}` `` \| `"native"`; `decimals`: `number`; `name`: `string`; `network`: `string`; `symbol`: `string`; \}\>

Defined in: [src/services/token.service.ts:50](https://github.com/andrewkimjoseph/celina-sdk/blob/b6ab035ea248bbfea2d9505d3330e4be605f0253/src/services/token.service.ts#L50)

Fetch ERC-20 metadata or native CELO info for a symbol or address.

#### Parameters

##### token

`string`

#### Returns

`Promise`\<\{ `address`: `` `0x${string}` `` \| `"native"`; `decimals`: `number`; `name`: `string`; `network`: `string`; `symbol`: `string`; \}\>

***

### parseAmount()

> **parseAmount**(`amount`, `decimals`): `bigint`

Defined in: [src/services/token.service.ts:260](https://github.com/andrewkimjoseph/celina-sdk/blob/b6ab035ea248bbfea2d9505d3330e4be605f0253/src/services/token.service.ts#L260)

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

Defined in: [src/services/token.service.ts:24](https://github.com/andrewkimjoseph/celina-sdk/blob/b6ab035ea248bbfea2d9505d3330e4be605f0253/src/services/token.service.ts#L24)

Resolve a token symbol or address to metadata (sync, no RPC).

#### Parameters

##### token

`string`

Known symbol (`CELO`, `USDm`, …) or `0x` contract address

#### Returns

[`ResolvedToken`](../interfaces/ResolvedToken.md)

#### Throws

If token is unknown
