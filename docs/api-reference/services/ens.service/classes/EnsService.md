[**@andrewkimjoseph/celina-sdk**](../../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../../README.md) / [services/ens.service](../README.md) / EnsService

# Class: EnsService

Defined in: [src/services/ens.service.ts:22](https://github.com/andrewkimjoseph/celina-sdk/blob/16cbfaa4151cb42b8d2ee197ea5b9943e9f75af3/src/services/ens.service.ts#L22)

## Constructors

### Constructor

> **new EnsService**(`ensClientFactory`): `EnsService`

Defined in: [src/services/ens.service.ts:23](https://github.com/andrewkimjoseph/celina-sdk/blob/16cbfaa4151cb42b8d2ee197ea5b9943e9f75af3/src/services/ens.service.ts#L23)

#### Parameters

##### ensClientFactory

`EnsClientFactory`

#### Returns

`EnsService`

## Methods

### resolveAddressOrEns()

> **resolveAddressOrEns**(`input`): `Promise`\<[`ResolvedRecipient`](../type-aliases/ResolvedRecipient.md)\>

Defined in: [src/services/ens.service.ts:89](https://github.com/andrewkimjoseph/celina-sdk/blob/16cbfaa4151cb42b8d2ee197ea5b9943e9f75af3/src/services/ens.service.ts#L89)

Accept a raw `0x` address or ENS name; returns address plus optional ENS metadata.

#### Parameters

##### input

`string`

#### Returns

`Promise`\<[`ResolvedRecipient`](../type-aliases/ResolvedRecipient.md)\>

***

### resolveEns()

> **resolveEns**(`name`, `chain?`): `Promise`\<\{ `address`: `` `0x${string}` ``; `chain`: `"ethereum"`; `coinType`: `string`; `name`: `string`; `normalizedName`: `string`; `resolvedVia?`: `undefined`; \} \| \{ `address`: `` `0x${string}` ``; `chain`: `"celo"`; `coinType`: `string`; `name`: `string`; `normalizedName`: `string`; `resolvedVia`: `"celo"` \| `"ethereum"`; \}\>

Defined in: [src/services/ens.service.ts:26](https://github.com/andrewkimjoseph/celina-sdk/blob/16cbfaa4151cb42b8d2ee197ea5b9943e9f75af3/src/services/ens.service.ts#L26)

Resolve an ENS name on Celo or Ethereum to an address.

#### Parameters

##### name

`string`

##### chain?

[`EnsResolveChain`](../type-aliases/EnsResolveChain.md) = `"celo"`

#### Returns

`Promise`\<\{ `address`: `` `0x${string}` ``; `chain`: `"ethereum"`; `coinType`: `string`; `name`: `string`; `normalizedName`: `string`; `resolvedVia?`: `undefined`; \} \| \{ `address`: `` `0x${string}` ``; `chain`: `"celo"`; `coinType`: `string`; `name`: `string`; `normalizedName`: `string`; `resolvedVia`: `"celo"` \| `"ethereum"`; \}\>
