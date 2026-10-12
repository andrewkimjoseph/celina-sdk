[**@cnvlabskoxyz/celina-sdk**](../../README.md)

***

[@cnvlabskoxyz/celina-sdk](../../README.md) / [index](../README.md) / flushCelinaAnalytics

# Function: flushCelinaAnalytics()

> **flushCelinaAnalytics**(): `Promise`\<`void`\>

Defined in: [src/analytics/events-stats.ts:140](https://github.com/andrewkimjoseph/celina-sdk/blob/2b7487815780d780ca38b8d2b9ce505b311839e0/src/analytics/events-stats.ts#L140)

Await any queued event posts (e.g. end of a Next.js route via `after()`).
Alias of [drainCelinaAnalytics](drainCelinaAnalytics.md) — kept as a separate export for API compatibility;
there is no separate client-side batch to flush now that events post individually.

## Returns

`Promise`\<`void`\>
