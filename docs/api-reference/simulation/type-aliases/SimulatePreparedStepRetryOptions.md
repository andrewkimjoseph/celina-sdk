[**@andrewkimjoseph/celina-sdk**](../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../README.md) / [simulation](../README.md) / SimulatePreparedStepRetryOptions

# Type Alias: SimulatePreparedStepRetryOptions

> **SimulatePreparedStepRetryOptions** = `object`

Defined in: [src/simulation/simulate-prepared-step.ts:22](https://github.com/andrewkimjoseph/celina-sdk/blob/d1a92b5baf7555d6145bf2dd87e39acd80d0d9e3/src/simulation/simulate-prepared-step.ts#L22)

Backoff between simulation retries after a failed `eth_call` / `estimateGas`.

## Properties

### delaysMs?

> `optional` **delaysMs?**: readonly `number`[]

Defined in: [src/simulation/simulate-prepared-step.ts:24](https://github.com/andrewkimjoseph/celina-sdk/blob/d1a92b5baf7555d6145bf2dd87e39acd80d0d9e3/src/simulation/simulate-prepared-step.ts#L24)

Delays in ms after each failed attempt. Default: 750, 1500, 3000.
