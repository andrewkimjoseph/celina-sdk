[**@andrewkimjoseph/celina-sdk**](../../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../../README.md) / [services/humanness.service](../README.md) / HumannessService

# Class: HumannessService

Defined in: [src/services/humanness.service.ts:29](https://github.com/andrewkimjoseph/celina-sdk/blob/c35fe1db07a45a3cd14b2185df4abf2e6a2ec609/src/services/humanness.service.ts#L29)

Address-bound humanness gate across Self and GoodDollar rails.

## Constructors

### Constructor

> **new HumannessService**(`clientFactory`, `selfService`): `HumannessService`

Defined in: [src/services/humanness.service.ts:30](https://github.com/andrewkimjoseph/celina-sdk/blob/c35fe1db07a45a3cd14b2185df4abf2e6a2ec609/src/services/humanness.service.ts#L30)

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

Defined in: [src/services/humanness.service.ts:39](https://github.com/andrewkimjoseph/celina-sdk/blob/c35fe1db07a45a3cd14b2185df4abf2e6a2ec609/src/services/humanness.service.ts#L39)

Check whether an address passes humanness on either Self or GoodDollar.

#### Parameters

##### signerAddress

`` `0x${string}` ``

The address that will sign on-chain actions

#### Returns

`Promise`\<[`HumannessCheckResult`](../interfaces/HumannessCheckResult.md)\>
