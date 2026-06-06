[**@andrewkimjoseph/celina-sdk**](../../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../../README.md) / [services/token.service](../README.md) / ResolvedToken

# Interface: ResolvedToken

Defined in: [src/services/token.service.ts:15](https://github.com/andrewkimjoseph/celina-sdk/blob/e071b6ef176a1c725fb3cc7d17c5bc0b9767d108/src/services/token.service.ts#L15)

Resolved Celo mainnet registry token (symbol, address, decimals).

## Properties

### address

> **address**: `` `0x${string}` `` \| `"native"`

Defined in: [src/services/token.service.ts:17](https://github.com/andrewkimjoseph/celina-sdk/blob/e071b6ef176a1c725fb3cc7d17c5bc0b9767d108/src/services/token.service.ts#L17)

Registry address, or `"native"` for CELO.

***

### decimals

> **decimals**: `number`

Defined in: [src/services/token.service.ts:21](https://github.com/andrewkimjoseph/celina-sdk/blob/e071b6ef176a1c725fb3cc7d17c5bc0b9767d108/src/services/token.service.ts#L21)

Token decimals for amount parsing.

***

### symbol

> **symbol**: `string`

Defined in: [src/services/token.service.ts:19](https://github.com/andrewkimjoseph/celina-sdk/blob/e071b6ef176a1c725fb3cc7d17c5bc0b9767d108/src/services/token.service.ts#L19)

Canonical registry symbol (e.g. `USDm`, `GoodDollar`).
