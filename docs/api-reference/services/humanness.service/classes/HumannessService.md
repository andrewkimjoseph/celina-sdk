[**@cnvlabskoxyz/celina-sdk**](../../../README.md)

***

[@cnvlabskoxyz/celina-sdk](../../../README.md) / [services/humanness.service](../README.md) / HumannessService

# Class: HumannessService

Defined in: [src/services/humanness.service.ts:31](https://github.com/andrewkimjoseph/celina-sdk/blob/2b7487815780d780ca38b8d2b9ce505b311839e0/src/services/humanness.service.ts#L31)

Address-bound humanness gate across Self and GoodDollar rails.

## Constructors

### Constructor

> **new HumannessService**(`clientFactory`, `selfService`): `HumannessService`

Defined in: [src/services/humanness.service.ts:32](https://github.com/andrewkimjoseph/celina-sdk/blob/2b7487815780d780ca38b8d2b9ce505b311839e0/src/services/humanness.service.ts#L32)

#### Parameters

##### clientFactory

`CeloClientFactory`

##### selfService

[`SelfService`](../../self.service/classes/SelfService.md)

#### Returns

`HumannessService`

## Methods

### checkHumanness()

> **checkHumanness**(`signerAddress`): `Promise`\<[`HumannessCheckResult`](../interfaces/HumannessCheckResult.md)\>

Defined in: [src/services/humanness.service.ts:41](https://github.com/andrewkimjoseph/celina-sdk/blob/2b7487815780d780ca38b8d2b9ce505b311839e0/src/services/humanness.service.ts#L41)

Check whether an address passes humanness on either Self or GoodDollar.

#### Parameters

##### signerAddress

`` `0x${string}` ``

The address that will sign on-chain actions

#### Returns

`Promise`\<[`HumannessCheckResult`](../interfaces/HumannessCheckResult.md)\>
