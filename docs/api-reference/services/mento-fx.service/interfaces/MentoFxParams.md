[**@andrewkimjoseph/celina-sdk**](../../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../../README.md) / [services/mento-fx.service](../README.md) / MentoFxParams

# Interface: MentoFxParams

Defined in: [src/services/mento-fx.service.ts:41](https://github.com/andrewkimjoseph/celina-sdk/blob/22b2ccc38aadfee03a1077786ec5de9ae678568c/src/services/mento-fx.service.ts#L41)

Optional parameters for Mento FX swap estimates and prepares.

## Properties

### deadlineMinutes?

> `optional` **deadlineMinutes?**: `number`

Defined in: [src/services/mento-fx.service.ts:45](https://github.com/andrewkimjoseph/celina-sdk/blob/22b2ccc38aadfee03a1077786ec5de9ae678568c/src/services/mento-fx.service.ts#L45)

Swap deadline in minutes from now (default `5`).

***

### recipient?

> `optional` **recipient?**: `` `0x${string}` ``

Defined in: [src/services/mento-fx.service.ts:47](https://github.com/andrewkimjoseph/celina-sdk/blob/22b2ccc38aadfee03a1077786ec5de9ae678568c/src/services/mento-fx.service.ts#L47)

Address receiving output tokens (default: `from`).

***

### slippageTolerance?

> `optional` **slippageTolerance?**: `number`

Defined in: [src/services/mento-fx.service.ts:43](https://github.com/andrewkimjoseph/celina-sdk/blob/22b2ccc38aadfee03a1077786ec5de9ae678568c/src/services/mento-fx.service.ts#L43)

Max slippage tolerance in percent (default `0.5`).
