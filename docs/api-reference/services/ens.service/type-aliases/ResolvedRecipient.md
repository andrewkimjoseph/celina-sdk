[**@andrewkimjoseph/celina-sdk**](../../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../../README.md) / [services/ens.service](../README.md) / ResolvedRecipient

# Type Alias: ResolvedRecipient

> **ResolvedRecipient** = `object`

Defined in: [src/services/ens.service.ts:18](https://github.com/andrewkimjoseph/celina-sdk/blob/15da21d7e6ad751c0106bbc57bbb0d6fb8e87371/src/services/ens.service.ts#L18)

Address with optional ENS metadata when input was a name.

## Properties

### address

> **address**: `` `0x${string}` ``

Defined in: [src/services/ens.service.ts:19](https://github.com/andrewkimjoseph/celina-sdk/blob/15da21d7e6ad751c0106bbc57bbb0d6fb8e87371/src/services/ens.service.ts#L19)

***

### ens?

> `optional` **ens?**: `object`

Defined in: [src/services/ens.service.ts:20](https://github.com/andrewkimjoseph/celina-sdk/blob/15da21d7e6ad751c0106bbc57bbb0d6fb8e87371/src/services/ens.service.ts#L20)

#### name

> **name**: `string`

#### normalizedName

> **normalizedName**: `string`

#### resolvedVia?

> `optional` **resolvedVia?**: `"celo"` \| `"ethereum"`

Present when resolved on Celo (may fall back to Ethereum records).
