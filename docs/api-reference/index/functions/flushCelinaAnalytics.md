[**@andrewkimjoseph/celina-sdk**](../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../README.md) / [index](../README.md) / flushCelinaAnalytics

# Function: flushCelinaAnalytics()

> **flushCelinaAnalytics**(): `Promise`\<`void`\>

Defined in: [src/analytics/events-stats.ts:140](https://github.com/andrewkimjoseph/celina-sdk/blob/22b2ccc38aadfee03a1077786ec5de9ae678568c/src/analytics/events-stats.ts#L140)

Await any queued event posts (e.g. end of a Next.js route via `after()`).
Alias of [drainCelinaAnalytics](drainCelinaAnalytics.md) — kept as a separate export for API compatibility;
there is no separate client-side batch to flush now that events post individually.

## Returns

`Promise`\<`void`\>
