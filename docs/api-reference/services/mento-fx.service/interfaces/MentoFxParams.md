[**@andrewkimjoseph/celina-sdk**](../../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../../README.md) / [services/mento-fx.service](../README.md) / MentoFxParams

# Interface: MentoFxParams

Defined in: [src/services/mento-fx.service.ts:37](https://github.com/andrewkimjoseph/celina-sdk/blob/2666667daf96a6fd5a7d6a6940f387cab3e7887d/src/services/mento-fx.service.ts#L37)

Optional parameters for Mento FX swap estimates and prepares.

## Properties

### deadlineMinutes?

> `optional` **deadlineMinutes?**: `number`

Defined in: [src/services/mento-fx.service.ts:41](https://github.com/andrewkimjoseph/celina-sdk/blob/2666667daf96a6fd5a7d6a6940f387cab3e7887d/src/services/mento-fx.service.ts#L41)

Swap deadline in minutes from now (default `5`).

***

### recipient?

> `optional` **recipient?**: `` `0x${string}` ``

Defined in: [src/services/mento-fx.service.ts:43](https://github.com/andrewkimjoseph/celina-sdk/blob/2666667daf96a6fd5a7d6a6940f387cab3e7887d/src/services/mento-fx.service.ts#L43)

Address receiving output tokens (default: `from`).

***

### slippageTolerance?

> `optional` **slippageTolerance?**: `number`

Defined in: [src/services/mento-fx.service.ts:39](https://github.com/andrewkimjoseph/celina-sdk/blob/2666667daf96a6fd5a7d6a6940f387cab3e7887d/src/services/mento-fx.service.ts#L39)

Max slippage tolerance in percent (default `0.5`).
