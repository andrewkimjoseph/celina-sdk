# MentoFxParams

[**@andrewkimjoseph/celina-sdk**](../../../)

***

[@andrewkimjoseph/celina-sdk](../../../) / [services/mento-fx.service](https://github.com/andrewkimjoseph/celina-sdk/blob/main/docs/api-reference/services/mento-fx.service/README.md) / MentoFxParams

## Interface: MentoFxParams

Defined in: [src/services/mento-fx.service.ts:37](https://github.com/andrewkimjoseph/celina-sdk/blob/2ff9e44d247fc85ce400a4b07de79a8872532d5d/src/services/mento-fx.service.ts#L37)

Optional parameters for Mento FX swap estimates and prepares.

### Properties

#### deadlineMinutes?

> `optional` **deadlineMinutes?**: `number`

Defined in: [src/services/mento-fx.service.ts:41](https://github.com/andrewkimjoseph/celina-sdk/blob/2ff9e44d247fc85ce400a4b07de79a8872532d5d/src/services/mento-fx.service.ts#L41)

Swap deadline in minutes from now (default `5`).

***

#### recipient?

> `optional` **recipient?**: `` `0x${string}` ``

Defined in: [src/services/mento-fx.service.ts:43](https://github.com/andrewkimjoseph/celina-sdk/blob/2ff9e44d247fc85ce400a4b07de79a8872532d5d/src/services/mento-fx.service.ts#L43)

Address receiving output tokens (default: `from`).

***

#### slippageTolerance?

> `optional` **slippageTolerance?**: `number`

Defined in: [src/services/mento-fx.service.ts:39](https://github.com/andrewkimjoseph/celina-sdk/blob/2ff9e44d247fc85ce400a4b07de79a8872532d5d/src/services/mento-fx.service.ts#L39)

Max slippage tolerance in percent (default `0.5`).
