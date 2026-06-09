[**@andrewkimjoseph/celina-sdk**](../../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../../README.md) / [services/token.service](../README.md) / ResolvedToken

# Interface: ResolvedToken

Defined in: [src/services/token.service.ts:15](https://github.com/andrewkimjoseph/celina-sdk/blob/799ca3b35fabfa75db63588d6f0b7b89da8e5271/src/services/token.service.ts#L15)

Resolved Celo mainnet registry token (symbol, address, decimals).

## Properties

### address

> **address**: `` `0x${string}` `` \| `"native"`

Defined in: [src/services/token.service.ts:17](https://github.com/andrewkimjoseph/celina-sdk/blob/799ca3b35fabfa75db63588d6f0b7b89da8e5271/src/services/token.service.ts#L17)

Registry address, or `"native"` for CELO.

***

### decimals

> **decimals**: `number`

Defined in: [src/services/token.service.ts:21](https://github.com/andrewkimjoseph/celina-sdk/blob/799ca3b35fabfa75db63588d6f0b7b89da8e5271/src/services/token.service.ts#L21)

Token decimals for amount parsing.

***

### symbol

> **symbol**: `string`

Defined in: [src/services/token.service.ts:19](https://github.com/andrewkimjoseph/celina-sdk/blob/799ca3b35fabfa75db63588d6f0b7b89da8e5271/src/services/token.service.ts#L19)

Canonical registry symbol (e.g. `USDm`, `GoodDollar`).
