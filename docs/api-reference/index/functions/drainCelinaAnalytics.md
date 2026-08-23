[**@andrewkimjoseph/celina-sdk**](../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../README.md) / [index](../README.md) / drainCelinaAnalytics

# Function: drainCelinaAnalytics()

> **drainCelinaAnalytics**(): `Promise`\<`void`\>

Defined in: [src/analytics/amplitude.ts](https://github.com/andrewkimjoseph/celina-sdk/blob/main/src/analytics/amplitude.ts)

Await in-flight Amplitude tracks, then flush. Pass this to Worker/Vercel `waitUntil` so events send after the response.

## Returns

`Promise`\<`void`\>
