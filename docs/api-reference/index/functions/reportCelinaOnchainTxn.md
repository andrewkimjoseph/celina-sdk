[**@cnvlabskoxyz/celina-sdk**](../../README.md)

***

[@cnvlabskoxyz/celina-sdk](../../README.md) / [index](../README.md) / reportCelinaOnchainTxn

# Function: reportCelinaOnchainTxn()

> **reportCelinaOnchainTxn**(`hash`): `void`

Defined in: [src/analytics/onchain-stats.ts:59](https://github.com/andrewkimjoseph/celina-sdk/blob/2b7487815780d780ca38b8d2b9ce505b311839e0/src/analytics/onchain-stats.ts#L59)

Fire-and-forget POST of a successful Celo tx hash to celina-stats-api.
Never throws. No-ops when `hash` is not a 32-byte hex string.

Call after `waitForTransactionReceipt` succeeds (MCP, wagmi apps, AA).

## Parameters

### hash

`string`

## Returns

`void`
