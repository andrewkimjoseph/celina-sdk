[**@andrewkimjoseph/celina-sdk**](../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../README.md) / [index](../README.md) / SendPreparedFlowResult

# Type Alias: SendPreparedFlowResult

> **SendPreparedFlowResult** = `object`

Defined in: [src/aa/types.ts:62](https://github.com/andrewkimjoseph/celina-sdk/blob/451f622f8dec060faa5c74891931f2871cc54219/src/aa/types.ts#L62)

Result of submitting prepared transactions as sponsored UserOp(s).

## Properties

### mode

> **mode**: [`SendPreparedFlowMode`](SendPreparedFlowMode.md)

Defined in: [src/aa/types.ts:63](https://github.com/andrewkimjoseph/celina-sdk/blob/451f622f8dec060faa5c74891931f2871cc54219/src/aa/types.ts#L63)

***

### success

> **success**: `boolean`

Defined in: [src/aa/types.ts:68](https://github.com/andrewkimjoseph/celina-sdk/blob/451f622f8dec060faa5c74891931f2871cc54219/src/aa/types.ts#L68)

***

### transactionHashes

> **transactionHashes**: `` `0x${string}` ``[]

Defined in: [src/aa/types.ts:67](https://github.com/andrewkimjoseph/celina-sdk/blob/451f622f8dec060faa5c74891931f2871cc54219/src/aa/types.ts#L67)

Transaction hash(es) from UserOp receipt(s).

***

### userOpHashes

> **userOpHashes**: `` `0x${string}` ``[]

Defined in: [src/aa/types.ts:65](https://github.com/andrewkimjoseph/celina-sdk/blob/451f622f8dec060faa5c74891931f2871cc54219/src/aa/types.ts#L65)

UserOperation hash(es) submitted to the bundler.
