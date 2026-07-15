[**@andrewkimjoseph/celina-sdk**](../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../README.md) / [index](../README.md) / GasSponsorshipService

# Class: GasSponsorshipService

Defined in: [src/aa/gas-sponsorship.ts:13](https://github.com/andrewkimjoseph/celina-sdk/blob/05b12850b58b19da260eb6f15b5b4dc39f45d761/src/aa/gas-sponsorship.ts#L13)

Provider-agnostic gas sponsorship wiring (bundler URL, paymaster, fees).
v1 supports `provider: "pimlico"`; add branches for future providers without renaming this type.

## Constructors

### Constructor

> **new GasSponsorshipService**(`config`, `chainId?`): `GasSponsorshipService`

Defined in: [src/aa/gas-sponsorship.ts:19](https://github.com/andrewkimjoseph/celina-sdk/blob/05b12850b58b19da260eb6f15b5b4dc39f45d761/src/aa/gas-sponsorship.ts#L19)

#### Parameters

##### config

[`GasSponsorshipConfig`](../type-aliases/GasSponsorshipConfig.md)

##### chainId?

`number` = `CHAIN.id`

#### Returns

`GasSponsorshipService`

## Properties

### provider

> `readonly` **provider**: `"pimlico"`

Defined in: [src/aa/gas-sponsorship.ts:14](https://github.com/andrewkimjoseph/celina-sdk/blob/05b12850b58b19da260eb6f15b5b4dc39f45d761/src/aa/gas-sponsorship.ts#L14)

## Methods

### createBundlerTransport()

> **createBundlerTransport**(): `Transport`

Defined in: [src/aa/gas-sponsorship.ts:45](https://github.com/andrewkimjoseph/celina-sdk/blob/05b12850b58b19da260eb6f15b5b4dc39f45d761/src/aa/gas-sponsorship.ts#L45)

viem transport pointed at the sponsorship backend RPC.

#### Returns

`Transport`

***

### estimateFeesPerGas()

> **estimateFeesPerGas**(): `Promise`\<\{ `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; \}\>

Defined in: [src/aa/gas-sponsorship.ts:68](https://github.com/andrewkimjoseph/celina-sdk/blob/05b12850b58b19da260eb6f15b5b4dc39f45d761/src/aa/gas-sponsorship.ts#L68)

Fee fields for UserOp construction.

#### Returns

`Promise`\<\{ `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; \}\>

***

### getPaymasterClient()

> **getPaymasterClient**(): `object`

Defined in: [src/aa/gas-sponsorship.ts:50](https://github.com/andrewkimjoseph/celina-sdk/blob/05b12850b58b19da260eb6f15b5b4dc39f45d761/src/aa/gas-sponsorship.ts#L50)

Provider client used as paymaster (and fee oracle in v1).

#### Returns

##### account

> **account**: `SmartAccount` \| `undefined`

The Account of the Client.

##### batch?

> `optional` **batch?**: `object`

Flags for batch settings.

###### batch.multicall?

> `optional` **multicall?**: `boolean` \| \{ `batchSize?`: `number`; `deployless?`: `boolean`; `wait?`: `number`; \}

Toggle to enable `eth_call` multicall aggregation.

###### Union Members

`boolean`

***

###### Type Literal

\{ `batchSize?`: `number`; `deployless?`: `boolean`; `wait?`: `number`; \}

###### batchSize?

> `optional` **batchSize?**: `number`

The maximum size (in bytes) for each calldata chunk.

###### Default

```ts
1_024
```

###### deployless?

> `optional` **deployless?**: `boolean`

Enable deployless multicall.

###### wait?

> `optional` **wait?**: `number`

The maximum number of milliseconds to wait before sending a batch.

###### Default

```ts
0
```

##### cacheTime

> **cacheTime**: `number`

Time (in ms) that cached data will remain in memory.

##### ccipRead?

> `optional` **ccipRead?**: `false` \| \{ `request?`: (`parameters`) => `Promise`\<`` `0x${string}` ``\>; \}

[CCIP Read](https://eips.ethereum.org/EIPS/eip-3668) configuration.

###### Union Members

`false`

***

###### Type Literal

\{ `request?`: (`parameters`) => `Promise`\<`` `0x${string}` ``\>; \}

###### request?

> `optional` **request?**: (`parameters`) => `Promise`\<`` `0x${string}` ``\>

A function that will be called to make the offchain CCIP lookup request.

###### Parameters

###### parameters

`CcipRequestParameters`

###### Returns

`Promise`\<`` `0x${string}` ``\>

###### See

https://eips.ethereum.org/EIPS/eip-3668#client-lookup-protocol

##### chain

> **chain**: `Chain` \| `undefined`

Chain for the client.

##### dataSuffix?

> `optional` **dataSuffix?**: `DataSuffix`

Data suffix to append to transaction data.

##### estimateErc20PaymasterCost

> **estimateErc20PaymasterCost**: \<`TChainOverride`\>(`args`) => `Promise`\<\{ `costInToken`: `bigint`; `costInUsd`: `bigint`; \}\>

###### Type Parameters

###### TChainOverride

`TChainOverride` *extends* `Chain` \| `undefined` = `Chain` \| `undefined`

###### Parameters

###### args

`Omit`\<`EstimateErc20PaymasterCostParameters`\<`entryPointVersion`, `TChain`, `TChainOverride`\>, `"entryPoint"`\>

###### Returns

`Promise`\<\{ `costInToken`: `bigint`; `costInUsd`: `bigint`; \}\>

##### estimateUserOperationGas

> **estimateUserOperationGas**: \<`calls`, `accountOverride`\>(`parameters`) => `Promise`\<`EstimateUserOperationGasReturnType`\<`SmartAccount` \| `undefined`, `accountOverride`\>\>

Returns an estimate of gas values necessary to execute the User Operation.

- Docs: https://viem.sh/actions/bundler/estimateUserOperationGas

###### Type Parameters

###### calls

`calls` *extends* readonly `unknown`[]

###### accountOverride

`accountOverride` *extends* `SmartAccount` \| `undefined` = `undefined`

###### Parameters

###### parameters

`EstimateUserOperationGasParameters`\<`SmartAccount` \| `undefined`, `accountOverride`, `calls`\>

EstimateUserOperationGasParameters

###### Returns

`Promise`\<`EstimateUserOperationGasReturnType`\<`SmartAccount` \| `undefined`, `accountOverride`\>\>

The gas estimate (in wei). EstimateUserOperationGasReturnType

###### Example

```ts
import { createBundlerClient, http, parseEther } from 'viem'
import { mainnet } from 'viem/chains'
import { toSmartAccount } from 'viem/accounts'

const account = await toSmartAccount({ ... })

const bundlerClient = createBundlerClient({
  chain: mainnet,
  transport: http(),
})

const values = await bundlerClient.estimateUserOperationGas({
  account,
  calls: [{ to: '0x...', value: parseEther('1') }],
})
```

##### experimental\_blockTag?

> `optional` **experimental\_blockTag?**: `BlockTag`

Default block tag to use for RPC requests.

##### extend

> **extend**: \<`client`\>(`fn`) => `Client`\<`Transport`, `Chain` \| `undefined`, `SmartAccount` \| `undefined`, \[\{ `Method`: `"eth_chainId"`; `Parameters?`: `undefined`; `ReturnType`: `` `0x${string}` ``; \}, \{ `Method`: `"eth_estimateUserOperationGas"`; `Parameters`: \[`RpcUserOperation`, `` `0x${string}` ``\] \| \[`RpcUserOperation`, `` `0x${string}` ``, `RpcStateOverride`\]; `ReturnType`: `RpcEstimateUserOperationGasReturnType`; \}, \{ `Method`: `"eth_getUserOperationByHash"`; `Parameters`: \[`` `0x${string}` ``\]; `ReturnType`: `RpcGetUserOperationByHashReturnType` \| `null`; \}, \{ `Method`: `"eth_getUserOperationReceipt"`; `Parameters`: \[`` `0x${string}` ``\]; `ReturnType`: `RpcUserOperationReceipt` \| `null`; \}\] \| \[\{ `Method`: `"eth_chainId"`; `Parameters?`: `undefined`; `ReturnType`: `` `0x${string}` ``; \}, \{ `Method`: `"eth_estimateUserOperationGas"`; `Parameters`: \[`RpcUserOperation`, `` `0x${string}` ``\] \| \[`RpcUserOperation`, `` `0x${string}` ``, `RpcStateOverride`\]; `ReturnType`: `RpcEstimateUserOperationGasReturnType`; \}, \{ `Method`: `"eth_getUserOperationByHash"`; `Parameters`: \[`` `0x${string}` ``\]; `ReturnType`: `RpcGetUserOperationByHashReturnType` \| `null`; \}, \{ `Method`: `"eth_getUserOperationReceipt"`; `Parameters`: \[`` `0x${string}` ``\]; `ReturnType`: `RpcUserOperationReceipt` \| `null`; \}\], \{ \[K in string \| number \| symbol\]: client\[K\] \} & `BundlerActions`\<`SmartAccount` \| `undefined`\> & `PaymasterActions` & `PimlicoActions`\<`Chain` \| `undefined`, `EntryPointVersion`\>\>

###### Type Parameters

###### client

`client` *extends* `object` & `ExactPartial`\<`ExtendableProtectedActions`\<`Transport`, `Chain` \| `undefined`, `SmartAccount` \| `undefined`\>\>

###### Parameters

###### fn

(`client`) => `client`

###### Returns

`Client`\<`Transport`, `Chain` \| `undefined`, `SmartAccount` \| `undefined`, \[\{ `Method`: `"eth_chainId"`; `Parameters?`: `undefined`; `ReturnType`: `` `0x${string}` ``; \}, \{ `Method`: `"eth_estimateUserOperationGas"`; `Parameters`: \[`RpcUserOperation`, `` `0x${string}` ``\] \| \[`RpcUserOperation`, `` `0x${string}` ``, `RpcStateOverride`\]; `ReturnType`: `RpcEstimateUserOperationGasReturnType`; \}, \{ `Method`: `"eth_getUserOperationByHash"`; `Parameters`: \[`` `0x${string}` ``\]; `ReturnType`: `RpcGetUserOperationByHashReturnType` \| `null`; \}, \{ `Method`: `"eth_getUserOperationReceipt"`; `Parameters`: \[`` `0x${string}` ``\]; `ReturnType`: `RpcUserOperationReceipt` \| `null`; \}\] \| \[\{ `Method`: `"eth_chainId"`; `Parameters?`: `undefined`; `ReturnType`: `` `0x${string}` ``; \}, \{ `Method`: `"eth_estimateUserOperationGas"`; `Parameters`: \[`RpcUserOperation`, `` `0x${string}` ``\] \| \[`RpcUserOperation`, `` `0x${string}` ``, `RpcStateOverride`\]; `ReturnType`: `RpcEstimateUserOperationGasReturnType`; \}, \{ `Method`: `"eth_getUserOperationByHash"`; `Parameters`: \[`` `0x${string}` ``\]; `ReturnType`: `RpcGetUserOperationByHashReturnType` \| `null`; \}, \{ `Method`: `"eth_getUserOperationReceipt"`; `Parameters`: \[`` `0x${string}` ``\]; `ReturnType`: `RpcUserOperationReceipt` \| `null`; \}\], \{ \[K in string \| number \| symbol\]: client\[K\] \} & `BundlerActions`\<`SmartAccount` \| `undefined`\> & `PaymasterActions` & `PimlicoActions`\<`Chain` \| `undefined`, `EntryPointVersion`\>\>

##### getChainId

> **getChainId**: () => `Promise`\<`number`\>

Returns the chain ID associated with the bundler.

- Docs: https://viem.sh/docs/actions/public/getChainId
- JSON-RPC Methods: [`eth_chainId`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_chainid)

###### Returns

`Promise`\<`number`\>

The current chain ID. GetChainIdReturnType

###### Example

```ts
import { http } from 'viem'
import { createBundlerClient, mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const chainId = await client.getChainId()
// 1
```

##### getPaymasterData

> **getPaymasterData**: (`parameters`) => `Promise`\<`GetPaymasterDataReturnType`\>

Retrieves paymaster-related User Operation properties to be used for sending the User Operation.

- Docs: https://viem.sh/account-abstraction/actions/paymaster/getPaymasterData

###### Parameters

###### parameters

`GetPaymasterDataParameters`

GetPaymasterDataParameters

###### Returns

`Promise`\<`GetPaymasterDataReturnType`\>

Paymaster-related User Operation properties. GetPaymasterDataReturnType

###### Example

```ts
import { http } from 'viem'
import { createPaymasterClient } from 'viem/account-abstraction'

const paymasterClient = createPaymasterClient({
  transport: http('https://...'),
})

const userOperation = { ... }

const values = await paymasterClient.getPaymasterData({
  chainId: 1,
  entryPointAddress: '0x...',
  ...userOperation,
})
```

##### getPaymasterStubData

> **getPaymasterStubData**: (`parameters`) => `Promise`\<`GetPaymasterStubDataReturnType`\>

Retrieves paymaster-related User Operation properties to be used for gas estimation.

- Docs: https://viem.sh/account-abstraction/actions/paymaster/getPaymasterStubData

###### Parameters

###### parameters

`GetPaymasterStubDataParameters`

GetPaymasterStubDataParameters

###### Returns

`Promise`\<`GetPaymasterStubDataReturnType`\>

Paymaster-related User Operation properties. GetPaymasterStubDataReturnType

###### Example

```ts
import { http } from 'viem'
import { createPaymasterClient } from 'viem/account-abstraction'

const paymasterClient = createPaymasterClient({
  transport: http('https://...'),
})

const userOperation = { ... }

const values = await paymasterClient.getPaymasterStubData({
  chainId: 1,
  entryPointAddress: '0x...',
  ...userOperation,
})
```

##### getSupportedEntryPoints

> **getSupportedEntryPoints**: () => `Promise`\<`GetSupportedEntryPointsReturnType`\>

Returns the EntryPoints that the bundler supports.

- Docs: https://viem.sh/actions/bundler/getSupportedEntryPoints

###### Returns

`Promise`\<`GetSupportedEntryPointsReturnType`\>

Supported Entry Points. GetSupportedEntryPointsReturnType

###### Example

```ts
import { createBundlerClient, http, parseEther } from 'viem'
import { mainnet } from 'viem/chains'

const bundlerClient = createBundlerClient({
  chain: mainnet,
  transport: http(),
})

const addresses = await bundlerClient.getSupportedEntryPoints()
```

##### getTokenQuotes

> **getTokenQuotes**: \<`TChainOverride`\>(`args`) => `Promise`\<`object`[]\>

###### Type Parameters

###### TChainOverride

`TChainOverride` *extends* `Chain` \| `undefined` = `Chain` \| `undefined`

###### Parameters

###### args

###### chain

`TChainOverride` \| `null`

###### tokens

`` `0x${string}` ``[]

###### Returns

`Promise`\<`object`[]\>

##### getUserOperation

> **getUserOperation**: (`parameters`) => `Promise`\<\{ `blockHash`: `` `0x${string}` ``; `blockNumber`: `bigint`; `entryPoint`: `` `0x${string}` ``; `transactionHash`: `` `0x${string}` ``; `userOperation`: `UserOperation`; \}\>

Returns the information about a User Operation given a hash.

- Docs: https://viem.sh/docs/actions/bundler/getUserOperation

###### Parameters

###### parameters

`GetUserOperationParameters`

GetUserOperationParameters

###### Returns

`Promise`\<\{ `blockHash`: `` `0x${string}` ``; `blockNumber`: `bigint`; `entryPoint`: `` `0x${string}` ``; `transactionHash`: `` `0x${string}` ``; `userOperation`: `UserOperation`; \}\>

The receipt. GetUserOperationReturnType

###### Example

```ts
import { createBundlerClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createBundlerClient({
  chain: mainnet,
  transport: http(),
})

const receipt = await client.getUserOperation({
  hash: '0x4ca7ee652d57678f26e887c149ab0735f41de37bcad58c9f6d3ed5824f15b74d',
})
```

##### getUserOperationGasPrice

> **getUserOperationGasPrice**: () => `Promise`\<\{ `fast`: \{ `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; \}; `slow`: \{ `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; \}; `standard`: \{ `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; \}; \}\>

Returns the live gas prices that you can use to send a user operation.

- Docs: https://docs.pimlico.io/permissionless/reference/pimlico-bundler-actions/getUserOperationGasPrice

###### Returns

`Promise`\<\{ `fast`: \{ `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; \}; `slow`: \{ `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; \}; `standard`: \{ `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; \}; \}\>

slow, standard & fast values for maxFeePerGas & maxPriorityFeePerGas GetUserOperationGasPriceReturnType

###### Example

```ts
import { createClient } from "viem"
import { pimlicoBundlerActions } from "permissionless/actions/pimlico"

const bundlerClient = createClient({
     chain: goerli,
     transport: http("https://api.pimlico.io/v2/goerli/rpc?apikey=YOUR_API_KEY_HERE")
}).extend(pimlicoBundlerActions)

await bundlerClient.getUserOperationGasPrice()
```

##### getUserOperationReceipt

> **getUserOperationReceipt**: (`parameters`) => `Promise`\<\{ `actualGasCost`: `bigint`; `actualGasUsed`: `bigint`; `entryPoint`: `` `0x${string}` ``; `logs`: `Log`\<`bigint`, `number`, `false`\>[]; `nonce`: `bigint`; `paymaster?`: `` `0x${string}` ``; `reason?`: `string`; `receipt`: `TransactionReceipt`\<`bigint`, `number`, `"success"` \| `"reverted"`\>; `sender`: `` `0x${string}` ``; `success`: `boolean`; `userOpHash`: `` `0x${string}` ``; \}\>

Returns the User Operation Receipt given a User Operation hash.

- Docs: https://viem.sh/docs/actions/bundler/getUserOperationReceipt

###### Parameters

###### parameters

`GetUserOperationReceiptParameters`

GetUserOperationReceiptParameters

###### Returns

`Promise`\<\{ `actualGasCost`: `bigint`; `actualGasUsed`: `bigint`; `entryPoint`: `` `0x${string}` ``; `logs`: `Log`\<`bigint`, `number`, `false`\>[]; `nonce`: `bigint`; `paymaster?`: `` `0x${string}` ``; `reason?`: `string`; `receipt`: `TransactionReceipt`\<`bigint`, `number`, `"success"` \| `"reverted"`\>; `sender`: `` `0x${string}` ``; `success`: `boolean`; `userOpHash`: `` `0x${string}` ``; \}\>

The receipt. GetUserOperationReceiptReturnType

###### Example

```ts
import { createBundlerClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createBundlerClient({
  chain: mainnet,
  transport: http(),
})

const receipt = await client.getUserOperationReceipt({
  hash: '0x4ca7ee652d57678f26e887c149ab0735f41de37bcad58c9f6d3ed5824f15b74d',
})
```

##### getUserOperationStatus

> **getUserOperationStatus**: (`args`) => `Promise`\<\{ `status`: `"reverted"` \| `"rejected"` \| `"failed"` \| `"not_found"` \| `"not_submitted"` \| `"submitted"` \| `"included"`; `transactionHash`: `` `0x${string}` `` \| `null`; \}\>

Returns the status of the userOperation that is pending in the mempool.

- Docs: https://docs.pimlico.io/permissionless/reference/pimlico-bundler-actions/getUserOperationStatus

###### Parameters

###### args

###### hash

`` `0x${string}` ``

###### Returns

`Promise`\<\{ `status`: `"reverted"` \| `"rejected"` \| `"failed"` \| `"not_found"` \| `"not_submitted"` \| `"submitted"` \| `"included"`; `transactionHash`: `` `0x${string}` `` \| `null`; \}\>

status & transaction hash if included GetUserOperationStatusReturnType

###### Example

```ts
import { createClient } from "viem"
import { pimlicoBundlerActions } from "permissionless/actions/pimlico"

const bundlerClient = createClient({
     chain: goerli,
     transport: http("https://api.pimlico.io/v2/goerli/rpc?apikey=YOUR_API_KEY_HERE")
}).extend(pimlicoBundlerActions)

await bundlerClient.getUserOperationStatus({ hash: userOpHash })
```

##### key

> **key**: `string`

A key for the client.

##### name

> **name**: `string`

A name for the client.

##### pollingInterval

> **pollingInterval**: `number`

Frequency (in ms) for polling enabled actions & events. Defaults to 4_000 milliseconds.

##### prepareUserOperation

> **prepareUserOperation**: \<`calls`, `request`, `accountOverride`\>(`parameters`) => `Promise`\<\{ \[K in string \| number \| symbol\]: (UnionOmit\<request, "parameters" \| "calls"\> & \{ callData: \`0x$\{string\}\`; paymasterAndData: DeriveEntryPointVersion\<DeriveSmartAccount\<(...) \| (...), accountOverride\>\> extends "0.6" ? \`0x$\{string\}\` : undefined; sender: \`0x$\{string\}\` \} & (Extract\<request\["parameters"\] extends readonly PrepareUserOperationParameterType\[\] ? any\[any\]\[number\] : "authorization" \| "gas" \| "nonce" \| "fees" \| "factory" \| "signature" \| "paymaster", "authorization"\> extends never ? \{\} : AuthorizationProperties) & (Extract\<request\["parameters"\] extends readonly PrepareUserOperationParameterType\[\] ? any\[any\]\[number\] : "authorization" \| "gas" \| "nonce" \| "fees" \| "factory" \| "signature" \| "paymaster", "factory"\> extends never ? \{\} : FactoryProperties\<DeriveEntryPointVersion\<DeriveSmartAccount\<(...) \| (...), accountOverride\>\>\>) & (Extract\<request\["parameters"\] extends readonly PrepareUserOperationParameterType\[\] ? any\[any\]\[number\] : "authorization" \| "gas" \| "nonce" \| "fees" \| "factory" \| "signature" \| "paymaster", "nonce"\> extends never ? \{\} : NonceProperties) & (Extract\<request\["parameters"\] extends readonly PrepareUserOperationParameterType\[\] ? any\[any\]\[number\] : "authorization" \| "gas" \| "nonce" \| "fees" \| "factory" \| "signature" \| "paymaster", "fees"\> extends never ? \{\} : FeeProperties) & (Extract\<request\["parameters"\] extends readonly PrepareUserOperationParameterType\[\] ? any\[any\]\[number\] : "authorization" \| "gas" \| "nonce" \| "fees" \| "factory" \| "signature" \| "paymaster", "gas"\> extends never ? \{\} : GasProperties\<DeriveEntryPointVersion\<DeriveSmartAccount\<(...) \| (...), accountOverride\>\>\>) & (Extract\<request\["parameters"\] extends readonly PrepareUserOperationParameterType\[\] ? any\[any\]\[number\] : "authorization" \| "gas" \| "nonce" \| "fees" \| "factory" \| "signature" \| "paymaster", "paymaster"\> extends never ? \{\} : PaymasterProperties\<DeriveEntryPointVersion\<DeriveSmartAccount\<(...) \| (...), accountOverride\>\>\>) & (Extract\<request\["parameters"\] extends readonly PrepareUserOperationParameterType\[\] ? any\[any\]\[number\] : "authorization" \| "gas" \| "nonce" \| "fees" \| "factory" \| "signature" \| "paymaster", "signature"\> extends never ? \{\} : SignatureProperties))\[K\] \}\>

Prepares a User Operation and fills in missing properties.

- Docs: https://viem.sh/actions/bundler/prepareUserOperation

###### Type Parameters

###### calls

`calls` *extends* readonly `unknown`[]

###### request

`request` *extends* `PrepareUserOperationRequest`\<`SmartAccount` \| `undefined`, `accountOverride`, `calls`\>

###### accountOverride

`accountOverride` *extends* `SmartAccount` \| `undefined` = `undefined`

###### Parameters

###### parameters

`PrepareUserOperationParameters`\<`SmartAccount` \| `undefined`, `accountOverride`, `calls`, `request`\>

###### Returns

`Promise`\<\{ \[K in string \| number \| symbol\]: (UnionOmit\<request, "parameters" \| "calls"\> & \{ callData: \`0x$\{string\}\`; paymasterAndData: DeriveEntryPointVersion\<DeriveSmartAccount\<(...) \| (...), accountOverride\>\> extends "0.6" ? \`0x$\{string\}\` : undefined; sender: \`0x$\{string\}\` \} & (Extract\<request\["parameters"\] extends readonly PrepareUserOperationParameterType\[\] ? any\[any\]\[number\] : "authorization" \| "gas" \| "nonce" \| "fees" \| "factory" \| "signature" \| "paymaster", "authorization"\> extends never ? \{\} : AuthorizationProperties) & (Extract\<request\["parameters"\] extends readonly PrepareUserOperationParameterType\[\] ? any\[any\]\[number\] : "authorization" \| "gas" \| "nonce" \| "fees" \| "factory" \| "signature" \| "paymaster", "factory"\> extends never ? \{\} : FactoryProperties\<DeriveEntryPointVersion\<DeriveSmartAccount\<(...) \| (...), accountOverride\>\>\>) & (Extract\<request\["parameters"\] extends readonly PrepareUserOperationParameterType\[\] ? any\[any\]\[number\] : "authorization" \| "gas" \| "nonce" \| "fees" \| "factory" \| "signature" \| "paymaster", "nonce"\> extends never ? \{\} : NonceProperties) & (Extract\<request\["parameters"\] extends readonly PrepareUserOperationParameterType\[\] ? any\[any\]\[number\] : "authorization" \| "gas" \| "nonce" \| "fees" \| "factory" \| "signature" \| "paymaster", "fees"\> extends never ? \{\} : FeeProperties) & (Extract\<request\["parameters"\] extends readonly PrepareUserOperationParameterType\[\] ? any\[any\]\[number\] : "authorization" \| "gas" \| "nonce" \| "fees" \| "factory" \| "signature" \| "paymaster", "gas"\> extends never ? \{\} : GasProperties\<DeriveEntryPointVersion\<DeriveSmartAccount\<(...) \| (...), accountOverride\>\>\>) & (Extract\<request\["parameters"\] extends readonly PrepareUserOperationParameterType\[\] ? any\[any\]\[number\] : "authorization" \| "gas" \| "nonce" \| "fees" \| "factory" \| "signature" \| "paymaster", "paymaster"\> extends never ? \{\} : PaymasterProperties\<DeriveEntryPointVersion\<DeriveSmartAccount\<(...) \| (...), accountOverride\>\>\>) & (Extract\<request\["parameters"\] extends readonly PrepareUserOperationParameterType\[\] ? any\[any\]\[number\] : "authorization" \| "gas" \| "nonce" \| "fees" \| "factory" \| "signature" \| "paymaster", "signature"\> extends never ? \{\} : SignatureProperties))\[K\] \}\>

The User Operation. PrepareUserOperationReturnType

###### Example

```ts
import { createBundlerClient, http } from 'viem'
import { mainnet } from 'viem/chains'
import { toSmartAccount } from 'viem/accounts'

const account = await toSmartAccount({ ... })

const client = createBundlerClient({
  chain: mainnet,
  transport: http(),
})

const request = await client.prepareUserOperation({
  account,
  calls: [{ to: '0x...', value: parseEther('1') }],
})
```

##### request

> **request**: `EIP1193RequestFn`\<\[\{ `Method`: `"eth_chainId"`; `Parameters?`: `undefined`; `ReturnType`: `` `0x${string}` ``; \}, \{ `Method`: `"eth_estimateUserOperationGas"`; `Parameters`: \[`RpcUserOperation`, `` `0x${string}` ``\] \| \[`RpcUserOperation`, `` `0x${string}` ``, `RpcStateOverride`\]; `ReturnType`: `RpcEstimateUserOperationGasReturnType`; \}, \{ `Method`: `"eth_getUserOperationByHash"`; `Parameters`: \[`` `0x${string}` ``\]; `ReturnType`: `RpcGetUserOperationByHashReturnType` \| `null`; \}, \{ `Method`: `"eth_getUserOperationReceipt"`; `Parameters`: \[`` `0x${string}` ``\]; `ReturnType`: `RpcUserOperationReceipt` \| `null`; \}\] \| \[\{ `Method`: `"eth_chainId"`; `Parameters?`: `undefined`; `ReturnType`: `` `0x${string}` ``; \}, \{ `Method`: `"eth_estimateUserOperationGas"`; `Parameters`: \[`RpcUserOperation`, `` `0x${string}` ``\] \| \[`RpcUserOperation`, `` `0x${string}` ``, `RpcStateOverride`\]; `ReturnType`: `RpcEstimateUserOperationGasReturnType`; \}, \{ `Method`: `"eth_getUserOperationByHash"`; `Parameters`: \[`` `0x${string}` ``\]; `ReturnType`: `RpcGetUserOperationByHashReturnType` \| `null`; \}, \{ `Method`: `"eth_getUserOperationReceipt"`; `Parameters`: \[`` `0x${string}` ``\]; `ReturnType`: `RpcUserOperationReceipt` \| `null`; \}\]\>

Request function wrapped with friendly error handling

##### ~~sendCompressedUserOperation~~

> **sendCompressedUserOperation**: (`args`) => `Promise`\<`` `0x${string}` ``\>

###### Parameters

###### args

SendCompressedUserOperationParameters.

###### compressedUserOperation

`` `0x${string}` ``

###### inflatorAddress

`` `0x${string}` ``

###### Returns

`Promise`\<`` `0x${string}` ``\>

UserOpHash that you can use to track user operation as Hash.

###### Deprecated

pimlico_sendCompressedUserOperation has been deprecated due to EIP-4844 blobs. Please use sendUserOperation instead.
Sends a compressed user operation to the bundler

- Docs: https://docs.pimlico.io/permissionless/reference/pimlico-bundler-actions/sendCompressedUserOperation

###### Example

```ts
import { createClient } from "viem"
import { pimlicoBundlerActions } from "permissionless/actions/pimlico"

const bundlerClient = createClient({
     chain: goerli,
     transport: http("https://api.pimlico.io/v1/goerli/rpc?apikey=YOUR_API_KEY_HERE")
}).extend(pimlicoBundlerActions)

const userOpHash = await bundlerClient.sendCompressedUserOperation({
    compressedUserOperation,
    inflatorAddress,
    entryPoint
})
// Return '0xe9fad2cd67f9ca1d0b7a6513b2a42066784c8df938518da2b51bb8cc9a89ea34'
```

##### sendUserOperation

> **sendUserOperation**: \<`calls`, `accountOverride`\>(`parameters`) => `Promise`\<`` `0x${string}` ``\>

Broadcasts a User Operation to the Bundler.

- Docs: https://viem.sh/actions/bundler/sendUserOperation

###### Type Parameters

###### calls

`calls` *extends* readonly `unknown`[]

###### accountOverride

`accountOverride` *extends* `SmartAccount` \| `undefined` = `undefined`

###### Parameters

###### parameters

`SendUserOperationParameters`\<`SmartAccount` \| `undefined`, `accountOverride`, `calls`\>

SendUserOperationParameters

###### Returns

`Promise`\<`` `0x${string}` ``\>

The User Operation hash. SendUserOperationReturnType

###### Example

```ts
import { createBundlerClient, http, parseEther } from 'viem'
import { mainnet } from 'viem/chains'
import { toSmartAccount } from 'viem/accounts'

const account = toSmartAccount({ ... })

const bundlerClient = createBundlerClient({
  chain: mainnet,
  transport: http(),
})

const values = await bundlerClient.sendUserOperation({
  account,
  calls: [{ to: '0x...', value: parseEther('1') }],
})
```

##### sponsorUserOperation

> **sponsorUserOperation**: (`args`) => `Promise`\<`Prettify`\<`SponsorUserOperationReturnType`\<`EntryPointVersion`\>\>\>

###### Parameters

###### args

`Omit`\<`PimlicoSponsorUserOperationParameters`\<`entryPointVersion`\>, `"entryPoint"`\>

###### Returns

`Promise`\<`Prettify`\<`SponsorUserOperationReturnType`\<`EntryPointVersion`\>\>\>

##### transport

> **transport**: `TransportConfig`\<`string`, `EIP1193RequestFn`\> & `Record`\<`string`, `any`\>

The RPC transport

##### type

> **type**: `string`

The type of client.

##### uid

> **uid**: `string`

A unique ID for the client.

##### validateSponsorshipPolicies

> **validateSponsorshipPolicies**: (`args`) => `Promise`\<`object`[]\>

###### Parameters

###### args

###### sponsorshipPolicyIds

`string`[]

###### userOperation

`UserOperation`

###### Returns

`Promise`\<`object`[]\>

##### waitForUserOperationReceipt

> **waitForUserOperationReceipt**: (`parameters`) => `Promise`\<\{ `actualGasCost`: `bigint`; `actualGasUsed`: `bigint`; `entryPoint`: `` `0x${string}` ``; `logs`: `Log`\<`bigint`, `number`, `false`\>[]; `nonce`: `bigint`; `paymaster?`: `` `0x${string}` ``; `reason?`: `string`; `receipt`: `TransactionReceipt`\<`bigint`, `number`, `"success"` \| `"reverted"`\>; `sender`: `` `0x${string}` ``; `success`: `boolean`; `userOpHash`: `` `0x${string}` ``; \}\>

Waits for the User Operation to be included on a [Block](https://viem.sh/docs/glossary/terms#block) (one confirmation), and then returns the User Operation receipt.

- Docs: https://viem.sh/docs/actions/bundler/waitForUserOperationReceipt

###### Parameters

###### parameters

`WaitForUserOperationReceiptParameters`

WaitForUserOperationReceiptParameters

###### Returns

`Promise`\<\{ `actualGasCost`: `bigint`; `actualGasUsed`: `bigint`; `entryPoint`: `` `0x${string}` ``; `logs`: `Log`\<`bigint`, `number`, `false`\>[]; `nonce`: `bigint`; `paymaster?`: `` `0x${string}` ``; `reason?`: `string`; `receipt`: `TransactionReceipt`\<`bigint`, `number`, `"success"` \| `"reverted"`\>; `sender`: `` `0x${string}` ``; `success`: `boolean`; `userOpHash`: `` `0x${string}` ``; \}\>

The receipt. WaitForUserOperationReceiptReturnType

###### Example

```ts
import { createBundlerClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createBundlerClient({
  chain: mainnet,
  transport: http(),
})

const receipt = await client.waitForUserOperationReceipt({
  hash: '0x4ca7ee652d57678f26e887c149ab0735f41de37bcad58c9f6d3ed5824f15b74d',
})
```

***

### getRpcUrl()

> **getRpcUrl**(`chainId?`): `string`

Defined in: [src/aa/gas-sponsorship.ts:35](https://github.com/andrewkimjoseph/celina-sdk/blob/05b12850b58b19da260eb6f15b5b4dc39f45d761/src/aa/gas-sponsorship.ts#L35)

Bundler / paymaster JSON-RPC URL for the configured provider and chain.

#### Parameters

##### chainId?

`number` = `...`

#### Returns

`string`
