[**@andrewkimjoseph/celina-sdk**](../../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../../README.md) / [services/ens.service](../README.md) / ResolvedRecipient

# Type Alias: ResolvedRecipient

> **ResolvedRecipient** = `object`

Defined in: [src/services/ens.service.ts:18](https://github.com/andrewkimjoseph/celina-sdk/blob/970ab720c805303ead8b20406c6579ecdcf2193a/src/services/ens.service.ts#L18)

Address with optional ENS metadata when input was a name.

## Properties

### address

> **address**: `` `0x${string}` ``

Defined in: [src/services/ens.service.ts:19](https://github.com/andrewkimjoseph/celina-sdk/blob/970ab720c805303ead8b20406c6579ecdcf2193a/src/services/ens.service.ts#L19)

***

### ens?

> `optional` **ens?**: `object`

Defined in: [src/services/ens.service.ts:20](https://github.com/andrewkimjoseph/celina-sdk/blob/970ab720c805303ead8b20406c6579ecdcf2193a/src/services/ens.service.ts#L20)

#### name

> **name**: `string`

#### normalizedName

> **normalizedName**: `string`

#### resolvedVia?

> `optional` **resolvedVia?**: `"celo"` \| `"ethereum"`

Present when resolved on Celo (may fall back to Ethereum records).
