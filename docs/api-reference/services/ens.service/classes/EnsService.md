# EnsService

[**@andrewkimjoseph/celina-sdk**](../../../)

***

[@andrewkimjoseph/celina-sdk](../../../) / [services/ens.service](https://github.com/andrewkimjoseph/celina-sdk/blob/main/docs/api-reference/services/ens.service/README.md) / EnsService

## Class: EnsService

Defined in: [src/services/ens.service.ts:29](https://github.com/andrewkimjoseph/celina-sdk/blob/2ff9e44d247fc85ce400a4b07de79a8872532d5d/src/services/ens.service.ts#L29)

ENS name and address resolution for send/swap recipients.

### Constructors

#### Constructor

> **new EnsService**(`ensClientFactory`): `EnsService`

Defined in: [src/services/ens.service.ts:30](https://github.com/andrewkimjoseph/celina-sdk/blob/2ff9e44d247fc85ce400a4b07de79a8872532d5d/src/services/ens.service.ts#L30)

**Parameters**

**ensClientFactory**

`EnsClientFactory`

**Returns**

`EnsService`

### Methods

#### resolveAddressOrEns()

> **resolveAddressOrEns**(`input`): `Promise`<[`ResolvedRecipient`](https://github.com/andrewkimjoseph/celina-sdk/blob/main/docs/api-reference/services/ens.service/type-aliases/ResolvedRecipient.md)>

Defined in: [src/services/ens.service.ts:104](https://github.com/andrewkimjoseph/celina-sdk/blob/2ff9e44d247fc85ce400a4b07de79a8872532d5d/src/services/ens.service.ts#L104)

Accept a raw `0x` address or ENS name; returns address plus optional ENS metadata.

**Parameters**

**input**

`string`

Hex address or ENS name

**Returns**

`Promise`<[`ResolvedRecipient`](https://github.com/andrewkimjoseph/celina-sdk/blob/main/docs/api-reference/services/ens.service/type-aliases/ResolvedRecipient.md)>

***

#### resolveEns()

> **resolveEns**(`name`, `chain?`): `Promise`<{ `address`: `` `0x${string}` ``; `chain`: `"ethereum"`; `coinType`: `string`; `name`: `string`; `normalizedName`: `string`; `resolvedVia?`: `undefined`; } | { `address`: `` `0x${string}` ``; `chain`: `"celo"`; `coinType`: `string`; `name`: `string`; `normalizedName`: `string`; `resolvedVia`: `"celo"` | `"ethereum"`; }>

Defined in: [src/services/ens.service.ts:38](https://github.com/andrewkimjoseph/celina-sdk/blob/2ff9e44d247fc85ce400a4b07de79a8872532d5d/src/services/ens.service.ts#L38)

Resolve an ENS name on Celo or Ethereum to an address.

**Parameters**

**name**

`string`

ENS name (e.g. `andrewkimjoseph.celo.eth`)

**chain?**

[`EnsResolveChain`](https://github.com/andrewkimjoseph/celina-sdk/blob/main/docs/api-reference/services/ens.service/type-aliases/EnsResolveChain.md) = `"celo"`

`"celo"` tries Celo coin type first, then Ethereum; `"ethereum"` uses ETH only

**Returns**

`Promise`<{ `address`: `` `0x${string}` ``; `chain`: `"ethereum"`; `coinType`: `string`; `name`: `string`; `normalizedName`: `string`; `resolvedVia?`: `undefined`; } | { `address`: `` `0x${string}` ``; `chain`: `"celo"`; `coinType`: `string`; `name`: `string`; `normalizedName`: `string`; `resolvedVia`: `"celo"` | `"ethereum"`; }>

**Throws**

When no address record exists for the name
