[**@cnvlabskoxyz/celina-sdk**](../../README.md)

***

[@cnvlabskoxyz/celina-sdk](../../README.md) / [simulation](../README.md) / SimulatePreparedStepRetryOptions

# Type Alias: SimulatePreparedStepRetryOptions

> **SimulatePreparedStepRetryOptions** = `object`

Defined in: [src/simulation/simulate-prepared-step.ts:22](https://github.com/andrewkimjoseph/celina-sdk/blob/2b7487815780d780ca38b8d2b9ce505b311839e0/src/simulation/simulate-prepared-step.ts#L22)

Backoff between simulation retries after a failed `eth_call` / `estimateGas`.

## Properties

### delaysMs?

> `optional` **delaysMs?**: readonly `number`[]

Defined in: [src/simulation/simulate-prepared-step.ts:24](https://github.com/andrewkimjoseph/celina-sdk/blob/2b7487815780d780ca38b8d2b9ce505b311839e0/src/simulation/simulate-prepared-step.ts#L24)

Delays in ms after each failed attempt. Default: 750, 1500, 3000.
