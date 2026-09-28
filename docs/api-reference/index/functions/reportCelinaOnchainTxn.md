[**@andrewkimjoseph/celina-sdk**](../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../README.md) / [index](../README.md) / reportCelinaOnchainTxn

# Function: reportCelinaOnchainTxn()

> **reportCelinaOnchainTxn**(`hash`): `void`

Defined in: [src/analytics/onchain-stats.ts:59](https://github.com/andrewkimjoseph/celina-sdk/blob/22b2ccc38aadfee03a1077786ec5de9ae678568c/src/analytics/onchain-stats.ts#L59)

Fire-and-forget POST of a successful Celo tx hash to celina-stats-api.
Never throws. No-ops when `hash` is not a 32-byte hex string.

Call after `waitForTransactionReceipt` succeeds (MCP, wagmi apps, AA).

## Parameters

### hash

`string`

## Returns

`void`
