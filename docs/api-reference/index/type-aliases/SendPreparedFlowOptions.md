[**@andrewkimjoseph/celina-sdk**](../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../README.md) / [index](../README.md) / SendPreparedFlowOptions

# Type Alias: SendPreparedFlowOptions

> **SendPreparedFlowOptions** = `object`

Defined in: [src/aa/types.ts:46](https://github.com/andrewkimjoseph/celina-sdk/blob/451f622f8dec060faa5c74891931f2871cc54219/src/aa/types.ts#L46)

## Properties

### mode?

> `optional` **mode?**: [`SendPreparedFlowMode`](SendPreparedFlowMode.md)

Defined in: [src/aa/types.ts:52](https://github.com/andrewkimjoseph/celina-sdk/blob/451f622f8dec060faa5c74891931f2871cc54219/src/aa/types.ts#L52)

How to submit the prepared transactions (`steps`).
`batch` (default): all steps in one UserOp.
`sequential`: one UserOp per step.
