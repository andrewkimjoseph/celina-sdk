[**@andrewkimjoseph/celina-sdk**](../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../README.md) / [index](../README.md) / preparedStepsToUserOpCalls

# Function: preparedStepsToUserOpCalls()

> **preparedStepsToUserOpCalls**(`steps`, `attributionTags?`): [`UserOpCall`](../type-aliases/UserOpCall.md)[]

Defined in: [src/aa/prepared-calls.ts:10](https://github.com/andrewkimjoseph/celina-sdk/blob/be01eb873c2753717e97a5aa979160c630e5980b/src/aa/prepared-calls.ts#L10)

Map Celina prepared steps to smart-account `calls`.
When `attributionTags` is provided, each step's `data` is ERC-8021-tagged
via [appendCelinaCalldataTag](appendCelinaCalldataTag.md); otherwise `data` is preserved as-is.

## Parameters

### steps

[`PreparedTx`](../../types/prepared/interfaces/PreparedTx.md)[]

### attributionTags?

`string`[]

## Returns

[`UserOpCall`](../type-aliases/UserOpCall.md)[]
