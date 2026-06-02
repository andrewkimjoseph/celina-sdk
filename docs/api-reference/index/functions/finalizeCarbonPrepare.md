[**@andrewkimjoseph/celina-sdk**](../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../README.md) / [index](../README.md) / finalizeCarbonPrepare

# Function: finalizeCarbonPrepare()

> **finalizeCarbonPrepare**(`carbon`, `from`, `prepared`, `orderMeta`): `Promise`\<[`FinalizedCarbonPrepareFlow`](../type-aliases/FinalizedCarbonPrepareFlow.md)\>

Defined in: [src/utils/finalize-carbon-prepare.ts:12](https://github.com/andrewkimjoseph/celina-sdk/blob/66d378efc4d326c1d282d6fbce18abc9daeb353d/src/utils/finalize-carbon-prepare.ts#L12)

Merge Carbon REST prepare + ERC-20 approve steps for external wallet signing.

## Parameters

### carbon

`Pick`\<[`CarbonService`](../../services/carbon.service/classes/CarbonService.md), `"buildExecutionSteps"`\>

### from

`` `0x${string}` ``

### prepared

[`CarbonPrepareResult`](../interfaces/CarbonPrepareResult.md)

### orderMeta

`Record`\<`string`, `unknown`\>

## Returns

`Promise`\<[`FinalizedCarbonPrepareFlow`](../type-aliases/FinalizedCarbonPrepareFlow.md)\>
