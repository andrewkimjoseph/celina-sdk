[**@andrewkimjoseph/celina-sdk**](../../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../../README.md) / [services/mento-fx.service](../README.md) / MentoFxParams

# Interface: MentoFxParams

Defined in: [src/services/mento-fx.service.ts:36](https://github.com/andrewkimjoseph/celina-sdk/blob/d1a92b5baf7555d6145bf2dd87e39acd80d0d9e3/src/services/mento-fx.service.ts#L36)

Optional parameters for Mento FX swap estimates and prepares.

## Properties

### deadlineMinutes?

> `optional` **deadlineMinutes?**: `number`

Defined in: [src/services/mento-fx.service.ts:40](https://github.com/andrewkimjoseph/celina-sdk/blob/d1a92b5baf7555d6145bf2dd87e39acd80d0d9e3/src/services/mento-fx.service.ts#L40)

Swap deadline in minutes from now (default `5`).

***

### recipient?

> `optional` **recipient?**: `` `0x${string}` ``

Defined in: [src/services/mento-fx.service.ts:42](https://github.com/andrewkimjoseph/celina-sdk/blob/d1a92b5baf7555d6145bf2dd87e39acd80d0d9e3/src/services/mento-fx.service.ts#L42)

Address receiving output tokens (default: `from`).

***

### slippageTolerance?

> `optional` **slippageTolerance?**: `number`

Defined in: [src/services/mento-fx.service.ts:38](https://github.com/andrewkimjoseph/celina-sdk/blob/d1a92b5baf7555d6145bf2dd87e39acd80d0d9e3/src/services/mento-fx.service.ts#L38)

Max slippage tolerance in percent (default `0.5`).
