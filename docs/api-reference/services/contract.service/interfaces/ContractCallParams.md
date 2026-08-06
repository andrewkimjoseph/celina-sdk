[**@andrewkimjoseph/celina-sdk**](../../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../../README.md) / [services/contract.service](../README.md) / ContractCallParams

# Interface: ContractCallParams

Defined in: [src/services/contract.service.ts:21](https://github.com/andrewkimjoseph/celina-sdk/blob/be01eb873c2753717e97a5aa979160c630e5980b/src/services/contract.service.ts#L21)

Parameters for a contract call on Celo mainnet (read, estimate, or prepare write).

## Properties

### abi

> **abi**: `Abi`

Defined in: [src/services/contract.service.ts:27](https://github.com/andrewkimjoseph/celina-sdk/blob/be01eb873c2753717e97a5aa979160c630e5980b/src/services/contract.service.ts#L27)

Contract ABI JSON (must include `functionName`).

***

### contractAddress

> **contractAddress**: `` `0x${string}` ``

Defined in: [src/services/contract.service.ts:23](https://github.com/andrewkimjoseph/celina-sdk/blob/be01eb873c2753717e97a5aa979160c630e5980b/src/services/contract.service.ts#L23)

Target contract address.

***

### fromAddress?

> `optional` **fromAddress?**: `` `0x${string}` ``

Defined in: [src/services/contract.service.ts:31](https://github.com/andrewkimjoseph/celina-sdk/blob/be01eb873c2753717e97a5aa979160c630e5980b/src/services/contract.service.ts#L31)

Optional `msg.sender` for state-dependent view calls.

***

### functionArgs?

> `optional` **functionArgs?**: `unknown`[]

Defined in: [src/services/contract.service.ts:29](https://github.com/andrewkimjoseph/celina-sdk/blob/be01eb873c2753717e97a5aa979160c630e5980b/src/services/contract.service.ts#L29)

Positional arguments for the function (default `[]`).

***

### functionName

> **functionName**: `string`

Defined in: [src/services/contract.service.ts:25](https://github.com/andrewkimjoseph/celina-sdk/blob/be01eb873c2753717e97a5aa979160c630e5980b/src/services/contract.service.ts#L25)

ABI function name to invoke.

***

### value?

> `optional` **value?**: `string`

Defined in: [src/services/contract.service.ts:33](https://github.com/andrewkimjoseph/celina-sdk/blob/be01eb873c2753717e97a5aa979160c630e5980b/src/services/contract.service.ts#L33)

Wei value as decimal string for payable calls (default `"0"`).
