[**@andrewkimjoseph/celina-sdk**](../../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../../README.md) / [types/prepared](../README.md) / SerializedPreparedFlow

# Interface: SerializedPreparedFlow

Defined in: [src/types/prepared.ts:39](https://github.com/andrewkimjoseph/celina-sdk/blob/451f622f8dec060faa5c74891931f2871cc54219/src/types/prepared.ts#L39)

Prepared flow = ordered unsigned transactions ready to sign or submit as UserOps —
not a runtime workflow engine. JSON-safe form returned by `prepare*` tools and chat APIs.
Primary payload is `steps`. Consumers simulate each step (see `@andrewkimjoseph/celina-sdk/simulation`),
then call `sendTransactionAsync` (wagmi), `walletClient.sendTransaction` (viem), or
`createAAClient().sendPreparedFlow` for sponsored UserOps.

## Extends

- `Omit`\<[`PreparedFlow`](PreparedFlow.md), `"steps"`\>

## Properties

### chainId

> **chainId**: `42220`

Defined in: [src/types/prepared.ts:28](https://github.com/andrewkimjoseph/celina-sdk/blob/451f622f8dec060faa5c74891931f2871cc54219/src/types/prepared.ts#L28)

Celo chain id (`celo.id` / [CHAIN](../../../index/variables/CHAIN.md).id); always `42220` for Celina today.

#### Inherited from

[`PreparedFlow`](PreparedFlow.md).[`chainId`](PreparedFlow.md#chainid)

***

### from

> **from**: `` `0x${string}` ``

Defined in: [src/types/prepared.ts:29](https://github.com/andrewkimjoseph/celina-sdk/blob/451f622f8dec060faa5c74891931f2871cc54219/src/types/prepared.ts#L29)

#### Inherited from

[`PreparedFlow`](PreparedFlow.md).[`from`](PreparedFlow.md#from)

***

### preparedFlow

> **preparedFlow**: `true`

Defined in: [src/types/prepared.ts:41](https://github.com/andrewkimjoseph/celina-sdk/blob/451f622f8dec060faa5c74891931f2871cc54219/src/types/prepared.ts#L41)

***

### steps

> **steps**: [`PreparedTx`](PreparedTx.md)[]

Defined in: [src/types/prepared.ts:40](https://github.com/andrewkimjoseph/celina-sdk/blob/451f622f8dec060faa5c74891931f2871cc54219/src/types/prepared.ts#L40)

***

### summary

> **summary**: `string`

Defined in: [src/types/prepared.ts:26](https://github.com/andrewkimjoseph/celina-sdk/blob/451f622f8dec060faa5c74891931f2871cc54219/src/types/prepared.ts#L26)

#### Inherited from

[`PreparedFlow`](PreparedFlow.md).[`summary`](PreparedFlow.md#summary)
