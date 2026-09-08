[**@andrewkimjoseph/celina-sdk**](../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../README.md) / [index](../README.md) / reportCelinaOnchainTxn

# Function: reportCelinaOnchainTxn()

> **reportCelinaOnchainTxn**(`hash`): `void`

Defined in: [src/analytics/onchain-stats.ts:70](https://github.com/andrewkimjoseph/celina-sdk/blob/d1a92b5baf7555d6145bf2dd87e39acd80d0d9e3/src/analytics/onchain-stats.ts#L70)

Fire-and-forget POST of a successful Celo tx hash to celina-stats-api.
Never throws. No-ops when opted out or when `hash` is not a 32-byte hex string.

Call after `waitForTransactionReceipt` succeeds (MCP, wagmi apps, AA).

## Parameters

### hash

`string`

## Returns

`void`
