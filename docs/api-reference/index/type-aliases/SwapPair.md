[**@cnvlabskoxyz/celina-sdk**](../../README.md)

***

[@cnvlabskoxyz/celina-sdk](../../README.md) / [index](../README.md) / SwapPair

# Type Alias: SwapPair

> **SwapPair** = `object`

Defined in: [src/services/swap-pairs.ts:17](https://github.com/andrewkimjoseph/celina-sdk/blob/2b7487815780d780ca38b8d2b9ce505b311839e0/src/services/swap-pairs.ts#L17)

One unordered registry-token pair with hop count.

## Properties

### hops

> **hops**: `number`

Defined in: [src/services/swap-pairs.ts:20](https://github.com/andrewkimjoseph/celina-sdk/blob/2b7487815780d780ca38b8d2b9ce505b311839e0/src/services/swap-pairs.ts#L20)

***

### token\_a

> **token\_a**: `string`

Defined in: [src/services/swap-pairs.ts:18](https://github.com/andrewkimjoseph/celina-sdk/blob/2b7487815780d780ca38b8d2b9ce505b311839e0/src/services/swap-pairs.ts#L18)

***

### token\_b

> **token\_b**: `string`

Defined in: [src/services/swap-pairs.ts:19](https://github.com/andrewkimjoseph/celina-sdk/blob/2b7487815780d780ca38b8d2b9ce505b311839e0/src/services/swap-pairs.ts#L19)

***

### venues?

> `optional` **venues?**: `UniswapVenue`[]

Defined in: [src/services/swap-pairs.ts:22](https://github.com/andrewkimjoseph/celina-sdk/blob/2b7487815780d780ca38b8d2b9ce505b311839e0/src/services/swap-pairs.ts#L22)

Set on Uniswap listings. Omitted for Mento pairs.
