[**@andrewkimjoseph/celina-sdk**](../../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../../README.md) / [services/contract.service](../README.md) / ContractCallParams

# Interface: ContractCallParams

Defined in: [src/services/contract.service.ts:14](https://github.com/andrewkimjoseph/celina-sdk/blob/2ff9e44d247fc85ce400a4b07de79a8872532d5d/src/services/contract.service.ts#L14)

Parameters for a read-only or gas-estimated contract call on Celo mainnet.

## Properties

### abi

> **abi**: `Abi`

Defined in: [src/services/contract.service.ts:20](https://github.com/andrewkimjoseph/celina-sdk/blob/2ff9e44d247fc85ce400a4b07de79a8872532d5d/src/services/contract.service.ts#L20)

Contract ABI JSON (must include `functionName`).

***

### contractAddress

> **contractAddress**: `` `0x${string}` ``

Defined in: [src/services/contract.service.ts:16](https://github.com/andrewkimjoseph/celina-sdk/blob/2ff9e44d247fc85ce400a4b07de79a8872532d5d/src/services/contract.service.ts#L16)

Target contract address.

***

### fromAddress?

> `optional` **fromAddress?**: `` `0x${string}` ``

Defined in: [src/services/contract.service.ts:24](https://github.com/andrewkimjoseph/celina-sdk/blob/2ff9e44d247fc85ce400a4b07de79a8872532d5d/src/services/contract.service.ts#L24)

Optional `msg.sender` for state-dependent view calls.

***

### functionArgs?

> `optional` **functionArgs?**: `unknown`[]

Defined in: [src/services/contract.service.ts:22](https://github.com/andrewkimjoseph/celina-sdk/blob/2ff9e44d247fc85ce400a4b07de79a8872532d5d/src/services/contract.service.ts#L22)

Positional arguments for the function (default `[]`).

***

### functionName

> **functionName**: `string`

Defined in: [src/services/contract.service.ts:18](https://github.com/andrewkimjoseph/celina-sdk/blob/2ff9e44d247fc85ce400a4b07de79a8872532d5d/src/services/contract.service.ts#L18)

ABI function name to invoke.

***

### value?

> `optional` **value?**: `string`

Defined in: [src/services/contract.service.ts:26](https://github.com/andrewkimjoseph/celina-sdk/blob/2ff9e44d247fc85ce400a4b07de79a8872532d5d/src/services/contract.service.ts#L26)

Wei value as decimal string for payable calls (default `"0"`).
