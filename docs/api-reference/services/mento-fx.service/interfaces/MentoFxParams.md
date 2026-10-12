[**@cnvlabskoxyz/celina-sdk**](../../../README.md)

***

[@cnvlabskoxyz/celina-sdk](../../../README.md) / [services/mento-fx.service](../README.md) / MentoFxParams

# Interface: MentoFxParams

Defined in: [src/services/mento-fx.service.ts:41](https://github.com/andrewkimjoseph/celina-sdk/blob/2b7487815780d780ca38b8d2b9ce505b311839e0/src/services/mento-fx.service.ts#L41)

Optional parameters for Mento FX swap estimates and prepares.

## Properties

### deadlineMinutes?

> `optional` **deadlineMinutes?**: `number`

Defined in: [src/services/mento-fx.service.ts:45](https://github.com/andrewkimjoseph/celina-sdk/blob/2b7487815780d780ca38b8d2b9ce505b311839e0/src/services/mento-fx.service.ts#L45)

Swap deadline in minutes from now (default `5`).

***

### recipient?

> `optional` **recipient?**: `` `0x${string}` ``

Defined in: [src/services/mento-fx.service.ts:47](https://github.com/andrewkimjoseph/celina-sdk/blob/2b7487815780d780ca38b8d2b9ce505b311839e0/src/services/mento-fx.service.ts#L47)

Address receiving output tokens (default: `from`).

***

### slippageTolerance?

> `optional` **slippageTolerance?**: `number`

Defined in: [src/services/mento-fx.service.ts:43](https://github.com/andrewkimjoseph/celina-sdk/blob/2b7487815780d780ca38b8d2b9ce505b311839e0/src/services/mento-fx.service.ts#L43)

Max slippage tolerance in percent (default `0.5`).
