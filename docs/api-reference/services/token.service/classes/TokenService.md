[**@andrewkimjoseph/celina-sdk**](../../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../../README.md) / [services/token.service](../README.md) / TokenService

# Class: TokenService

Defined in: [src/services/token.service.ts:25](https://github.com/andrewkimjoseph/celina-sdk/blob/c4138c1333e37c3188f9b6d876cbd4e95b2408f1/src/services/token.service.ts#L25)

Celo mainnet token registry lookups and balance reads.

## Constructors

### Constructor

> **new TokenService**(`clientFactory`): `TokenService`

Defined in: [src/services/token.service.ts:26](https://github.com/andrewkimjoseph/celina-sdk/blob/c4138c1333e37c3188f9b6d876cbd4e95b2408f1/src/services/token.service.ts#L26)

#### Parameters

##### clientFactory

`CeloClientFactory`

#### Returns

`TokenService`

## Methods

### assertSpendableBalance()

> **assertSpendableBalance**(`owner`, `resolved`, `amount`, `options?`): `Promise`\<`void`\>

Defined in: [src/services/token.service.ts:224](https://github.com/andrewkimjoseph/celina-sdk/blob/c4138c1333e37c3188f9b6d876cbd4e95b2408f1/src/services/token.service.ts#L224)

Ensure `owner` holds at least `amount` of the input token before swap/route work.

#### Parameters

##### owner

`` `0x${string}` ``

##### resolved

[`ResolvedToken`](../interfaces/ResolvedToken.md)

##### amount

`string`

##### options?

###### hint?

`string`

###### spendToken?

`` `0x${string}` `` \| `"native"`

#### Returns

`Promise`\<`void`\>

***

### getBalances()

> **getBalances**(`address`, `tokens?`): `Promise`\<\{ `address`: `` `0x${string}` ``; `balances`: (\{ `address`: `"native"`; `formatted`: `string`; `raw`: `string`; `token`: `string`; \} \| \{ `address`: `` `0x${string}` ``; `formatted`: `string`; `raw`: `string`; `token`: `string`; \})[]; `network`: `"mainnet"`; \}\>

Defined in: [src/services/token.service.ts:68](https://github.com/andrewkimjoseph/celina-sdk/blob/c4138c1333e37c3188f9b6d876cbd4e95b2408f1/src/services/token.service.ts#L68)

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

Defined in: [src/services/token.service.ts:114](https://github.com/andrewkimjoseph/celina-sdk/blob/c4138c1333e37c3188f9b6d876cbd4e95b2408f1/src/services/token.service.ts#L114)

Scan fiat-pegged registry stablecoins for an address; omits zero balances by default.
GoodDollar and WETH are excluded — use `getTokenBalance` or GoodDollar tools.

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

Defined in: [src/services/token.service.ts:173](https://github.com/andrewkimjoseph/celina-sdk/blob/c4138c1333e37c3188f9b6d876cbd4e95b2408f1/src/services/token.service.ts#L173)

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

Defined in: [src/services/token.service.ts:55](https://github.com/andrewkimjoseph/celina-sdk/blob/c4138c1333e37c3188f9b6d876cbd4e95b2408f1/src/services/token.service.ts#L55)

Fetch registry token metadata on Celo mainnet.

#### Parameters

##### token

`string`

#### Returns

`Promise`\<\{ `address`: `` `0x${string}` `` \| `"native"`; `decimals`: `number`; `name`: `string`; `network`: `"mainnet"`; `symbol`: `string`; \}\>

***

### parseAmount()

> **parseAmount**(`amount`, `decimals`): `bigint`

Defined in: [src/services/token.service.ts:216](https://github.com/andrewkimjoseph/celina-sdk/blob/c4138c1333e37c3188f9b6d876cbd4e95b2408f1/src/services/token.service.ts#L216)

Parse a human-readable amount string to base units for the given decimals.

#### Parameters

##### amount

`string`

Decimal string (e.g. `"10"` or `"0.05"`)

##### decimals

`number`

Token decimals from `resolveToken`

#### Returns

`bigint`

***

### resolveToken()

> **resolveToken**(`token`): [`ResolvedToken`](../interfaces/ResolvedToken.md)

Defined in: [src/services/token.service.ts:32](https://github.com/andrewkimjoseph/celina-sdk/blob/c4138c1333e37c3188f9b6d876cbd4e95b2408f1/src/services/token.service.ts#L32)

Resolve a Celo mainnet registry token by symbol, alias, or registry address.

#### Parameters

##### token

`string`

#### Returns

[`ResolvedToken`](../interfaces/ResolvedToken.md)

#### Throws

If the token is not in the Celo registry
