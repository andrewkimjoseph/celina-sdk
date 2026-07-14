[**@andrewkimjoseph/celina-sdk**](../../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../../README.md) / [types/prepared](../README.md) / PreparedFlow

# Interface: PreparedFlow

Defined in: [src/types/prepared.ts:24](https://github.com/andrewkimjoseph/celina-sdk/blob/451f622f8dec060faa5c74891931f2871cc54219/src/types/prepared.ts#L24)

Prepared flow = ordered unsigned transactions ready to sign (wagmi/EOA) or
submit as UserOps (`createAAClient.sendPreparedFlow`) — not a runtime workflow engine.
The primary payload is `steps`.

## Properties

### chainId

> **chainId**: `42220`

Defined in: [src/types/prepared.ts:28](https://github.com/andrewkimjoseph/celina-sdk/blob/451f622f8dec060faa5c74891931f2871cc54219/src/types/prepared.ts#L28)

Celo chain id (`celo.id` / [CHAIN](../../../index/variables/CHAIN.md).id); always `42220` for Celina today.

***

### from

> **from**: `` `0x${string}` ``

Defined in: [src/types/prepared.ts:29](https://github.com/andrewkimjoseph/celina-sdk/blob/451f622f8dec060faa5c74891931f2871cc54219/src/types/prepared.ts#L29)

***

### steps

> **steps**: [`PreparedTx`](PreparedTx.md)[]

Defined in: [src/types/prepared.ts:25](https://github.com/andrewkimjoseph/celina-sdk/blob/451f622f8dec060faa5c74891931f2871cc54219/src/types/prepared.ts#L25)

***

### summary

> **summary**: `string`

Defined in: [src/types/prepared.ts:26](https://github.com/andrewkimjoseph/celina-sdk/blob/451f622f8dec060faa5c74891931f2871cc54219/src/types/prepared.ts#L26)
