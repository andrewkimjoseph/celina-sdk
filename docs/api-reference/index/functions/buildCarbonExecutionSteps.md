[**@andrewkimjoseph/celina-sdk**](../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../README.md) / [index](../README.md) / buildCarbonExecutionSteps

# Function: buildCarbonExecutionSteps()

> **buildCarbonExecutionSteps**(`from`, `prepared`, `orderMeta`, `deps`): `Promise`\<[`PreparedTx`](../../types/prepared/interfaces/PreparedTx.md)[]\>

Defined in: [src/utils/carbon-execution.ts:133](https://github.com/andrewkimjoseph/celina-sdk/blob/9aa8703fbb6f796ec6f1362b133c7fd2f4baefc2/src/utils/carbon-execution.ts#L133)

Merge ERC-20 approval steps (when needed) with Carbon REST prepared steps for local signing.

## Parameters

### from

`` `0x${string}` ``

### prepared

[`CarbonPrepareResult`](../interfaces/CarbonPrepareResult.md)

### orderMeta

`Record`\<`string`, `unknown`\>

### deps

#### clientFactory

`CeloClientFactory`

#### tokenService

[`TokenService`](../../services/token.service/classes/TokenService.md)

## Returns

`Promise`\<[`PreparedTx`](../../types/prepared/interfaces/PreparedTx.md)[]\>
