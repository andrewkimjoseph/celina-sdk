[**@andrewkimjoseph/celina-sdk**](../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../README.md) / [index](../README.md) / CHAIN

# Variable: CHAIN

> `const` **CHAIN**: `object` = `celo`

Defined in: [src/config/chains.ts:7](https://github.com/andrewkimjoseph/celina-sdk/blob/5ca8be517fae54f45a80efded22f3312ee23795e/src/config/chains.ts#L7)

## Type Declaration

### blockExplorers

> **blockExplorers**: `object`

#### blockExplorers.default

> `readonly` **default**: `object`

#### blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://api.celoscan.io/api"`

#### blockExplorers.default.name

> `readonly` **name**: `"Celo Explorer"`

#### blockExplorers.default.url

> `readonly` **url**: `"https://celoscan.io"`

### blockTime

> **blockTime**: `1000`

### contracts

> **contracts**: `object`

#### contracts.multicall3

> `readonly` **multicall3**: `object`

#### contracts.multicall3.address

> `readonly` **address**: `"0xcA11bde05977b3631167028862bE2a173976CA11"`

#### contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `13112599`

### custom?

> `optional` **custom?**: `Record`\<`string`, `unknown`\>

### ensTlds?

> `optional` **ensTlds?**: readonly `string`[]

### experimental\_preconfirmationTime?

> `optional` **experimental\_preconfirmationTime?**: `number`

### extendSchema?

> `optional` **extendSchema?**: `Record`\<`string`, `unknown`\>

### fees

> **fees**: `ChainFees`\<\{ `block`: \{ `exclude`: \[\] \| `undefined`; `format`: (`args`, `action?`) => `object`; `type`: `"block"`; \}; `transaction`: \{ `exclude`: \[\] \| `undefined`; `format`: (`args`, `action?`) => \{ `accessList?`: `undefined`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `` `0x${string}` `` \| `null`; `blockNumber`: `bigint` \| `null`; `blockTimestamp?`: `bigint`; `chainId?`: `number`; `feeCurrency`: `` `0x${string}` `` \| `null`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `gatewayFee?`: `undefined`; `gatewayFeeRecipient?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `` `0x${string}` `` \| `null`; `transactionIndex`: `number` \| `null`; `type`: `"legacy"`; `typeHex`: `` `0x${string}` `` \| `null`; `v`: `bigint`; `value`: `bigint`; `yParity?`: `undefined`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `` `0x${string}` `` \| `null`; `blockNumber`: `bigint` \| `null`; `blockTimestamp?`: `bigint`; `chainId`: `number`; `feeCurrency`: `` `0x${string}` `` \| `null`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `gatewayFee?`: `undefined`; `gatewayFeeRecipient?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `` `0x${string}` `` \| `null`; `transactionIndex`: `number` \| `null`; `type`: `"eip2930"`; `typeHex`: `` `0x${string}` `` \| `null`; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `` `0x${string}` `` \| `null`; `blockNumber`: `bigint` \| `null`; `blockTimestamp?`: `bigint`; `chainId`: `number`; `feeCurrency`: `` `0x${string}` `` \| `null`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `gatewayFee?`: `undefined`; `gatewayFeeRecipient?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `` `0x${string}` `` \| `null`; `transactionIndex`: `number` \| `null`; `type`: `"eip1559"`; `typeHex`: `` `0x${string}` `` \| `null`; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes`: readonly `` `0x${string}` ``[]; `blockHash`: `` `0x${string}` `` \| `null`; `blockNumber`: `bigint` \| `null`; `blockTimestamp?`: `bigint`; `chainId`: `number`; `feeCurrency`: `` `0x${string}` `` \| `null`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `gatewayFee?`: `undefined`; `gatewayFeeRecipient?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas`: `bigint`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `` `0x${string}` `` \| `null`; `transactionIndex`: `number` \| `null`; `type`: `"eip4844"`; `typeHex`: `` `0x${string}` `` \| `null`; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList`: `SignedAuthorizationList`\<`number`\>; `blobVersionedHashes?`: `undefined`; `blockHash`: `` `0x${string}` `` \| `null`; `blockNumber`: `bigint` \| `null`; `blockTimestamp?`: `bigint`; `chainId`: `number`; `feeCurrency`: `` `0x${string}` `` \| `null`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `gatewayFee?`: `undefined`; `gatewayFeeRecipient?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `` `0x${string}` `` \| `null`; `transactionIndex`: `number` \| `null`; `type`: `"eip7702"`; `typeHex`: `` `0x${string}` `` \| `null`; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `` `0x${string}` `` \| `null`; `blockNumber`: `bigint` \| `null`; `blockTimestamp?`: `bigint`; `chainId`: `number`; `feeCurrency`: `` `0x${string}` `` \| `null`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `gatewayFee`: `bigint` \| `null`; `gatewayFeeRecipient`: `` `0x${string}` `` \| `null`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `` `0x${string}` `` \| `null`; `transactionIndex`: `number` \| `null`; `type`: `"cip42"`; `typeHex`: `` `0x${string}` `` \| `null`; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `` `0x${string}` `` \| `null`; `blockNumber`: `bigint` \| `null`; `blockTimestamp?`: `bigint`; `chainId`: `number`; `feeCurrency`: `` `0x${string}` `` \| `null`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `gatewayFee?`: `undefined`; `gatewayFeeRecipient?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `` `0x${string}` `` \| `null`; `transactionIndex`: `number` \| `null`; `type`: `"cip64"`; `typeHex`: `` `0x${string}` `` \| `null`; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList?`: `undefined`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `` `0x${string}` `` \| `null`; `blockNumber`: `bigint` \| `null`; `blockTimestamp?`: `bigint`; `chainId?`: `undefined`; `feeCurrency?`: `undefined`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `gatewayFee?`: `undefined`; `gatewayFeeRecipient?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `boolean`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `bigint`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash`: `` `0x${string}` ``; `to`: `` `0x${string}` `` \| `null`; `transactionIndex`: `number` \| `null`; `type`: `"deposit"`; `typeHex`: `` `0x${string}` `` \| `null`; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \}; `type`: `"transaction"`; \}; `transactionRequest`: \{ `exclude`: \[\] \| `undefined`; `format`: (`args`, `action?`) => \{ `accessList?`: `undefined`; `authorizationList?`: `undefined`; `blobs?`: `undefined`; `blobVersionedHashes?`: `undefined`; `data?`: `` `0x${string}` ``; `feeCurrency?`: `` `0x${string}` ``; `from?`: `` `0x${string}` ``; `gas?`: `` `0x${string}` ``; `gasPrice?`: `` `0x${string}` ``; `kzg?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `nonce?`: `` `0x${string}` ``; `sidecars?`: `undefined`; `to?`: `` `0x${string}` `` \| `null`; `type?`: `"0x0"`; `value?`: `` `0x${string}` ``; \} \| \{ `accessList?`: `AccessList`; `authorizationList?`: `undefined`; `blobs?`: `undefined`; `blobVersionedHashes?`: `undefined`; `data?`: `` `0x${string}` ``; `feeCurrency?`: `` `0x${string}` ``; `from?`: `` `0x${string}` ``; `gas?`: `` `0x${string}` ``; `gasPrice?`: `` `0x${string}` ``; `kzg?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `nonce?`: `` `0x${string}` ``; `sidecars?`: `undefined`; `to?`: `` `0x${string}` `` \| `null`; `type?`: `"0x1"`; `value?`: `` `0x${string}` ``; \} \| \{ `accessList?`: `AccessList`; `authorizationList?`: `undefined`; `blobs?`: `undefined`; `blobVersionedHashes?`: `undefined`; `data?`: `` `0x${string}` ``; `feeCurrency?`: `` `0x${string}` ``; `from?`: `` `0x${string}` ``; `gas?`: `` `0x${string}` ``; `gasPrice?`: `undefined`; `kzg?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `` `0x${string}` ``; `maxPriorityFeePerGas?`: `` `0x${string}` ``; `nonce?`: `` `0x${string}` ``; `sidecars?`: `undefined`; `to?`: `` `0x${string}` `` \| `null`; `type?`: `"0x2"`; `value?`: `` `0x${string}` ``; \} \| \{ `accessList?`: `AccessList`; `authorizationList?`: `undefined`; `blobs?`: readonly `` `0x${string}` ``[] \| readonly `ByteArray`[]; `blobVersionedHashes`: readonly `` `0x${string}` ``[]; `data?`: `` `0x${string}` ``; `feeCurrency?`: `` `0x${string}` ``; `from?`: `` `0x${string}` ``; `gas?`: `` `0x${string}` ``; `gasPrice?`: `undefined`; `kzg?`: `undefined`; `maxFeePerBlobGas?`: `` `0x${string}` ``; `maxFeePerGas?`: `` `0x${string}` ``; `maxPriorityFeePerGas?`: `` `0x${string}` ``; `nonce?`: `` `0x${string}` ``; `sidecars?`: readonly `BlobSidecar`\<`` `0x${(...)}` ``\>[]; `to`: `` `0x${string}` `` \| `null`; `type?`: `"0x3"`; `value?`: `` `0x${string}` ``; \} \| \{ `accessList?`: `AccessList`; `authorizationList?`: `undefined`; `blobs`: readonly `` `0x${string}` ``[] \| readonly `ByteArray`[]; `blobVersionedHashes?`: readonly `` `0x${string}` ``[]; `data?`: `` `0x${string}` ``; `feeCurrency?`: `` `0x${string}` ``; `from?`: `` `0x${string}` ``; `gas?`: `` `0x${string}` ``; `gasPrice?`: `undefined`; `kzg?`: `Kzg`; `maxFeePerBlobGas?`: `` `0x${string}` ``; `maxFeePerGas?`: `` `0x${string}` ``; `maxPriorityFeePerGas?`: `` `0x${string}` ``; `nonce?`: `` `0x${string}` ``; `sidecars?`: readonly `BlobSidecar`\<`` `0x${(...)}` ``\>[]; `to`: `` `0x${string}` `` \| `null`; `type?`: `"0x3"`; `value?`: `` `0x${string}` ``; \} \| \{ `accessList?`: `AccessList`; `authorizationList?`: `RpcAuthorizationList`; `blobs?`: `undefined`; `blobVersionedHashes?`: `undefined`; `data?`: `` `0x${string}` ``; `feeCurrency?`: `` `0x${string}` ``; `from?`: `` `0x${string}` ``; `gas?`: `` `0x${string}` ``; `gasPrice?`: `undefined`; `kzg?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `` `0x${string}` ``; `maxPriorityFeePerGas?`: `` `0x${string}` ``; `nonce?`: `` `0x${string}` ``; `sidecars?`: `undefined`; `to?`: `` `0x${string}` `` \| `null`; `type?`: `"0x4"`; `value?`: `` `0x${string}` ``; \} \| \{ `accessList?`: `AccessList`; `authorizationList?`: `undefined`; `blobs?`: `undefined`; `blobVersionedHashes?`: `undefined`; `data?`: `` `0x${string}` ``; `feeCurrency?`: `` `0x${string}` ``; `from?`: `` `0x${string}` ``; `gas?`: `` `0x${string}` ``; `gasPrice?`: `undefined`; `kzg?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `` `0x${string}` ``; `maxPriorityFeePerGas?`: `` `0x${string}` ``; `nonce?`: `` `0x${string}` ``; `sidecars?`: `undefined`; `to?`: `` `0x${string}` `` \| `null`; `type?`: `"0x7b"`; `value?`: `` `0x${string}` ``; \}; `type`: `"transactionRequest"`; \}; \}\>

### formatters

> **formatters**: `object`

#### formatters.block

> `readonly` **block**: `object`

#### formatters.block.exclude

> **exclude**: \[\] \| `undefined`

#### formatters.block.format

> **format**: (`args`, `action?`) => `object`

##### Parameters

###### args

`CeloRpcBlock`\<`BlockTag`, `boolean`\>

###### action?

`string`

##### Returns

`object`

###### baseFeePerGas

> **baseFeePerGas**: `bigint` \| `null`

###### blobGasUsed

> **blobGasUsed**: `bigint`

###### difficulty

> **difficulty**: `bigint`

###### excessBlobGas

> **excessBlobGas**: `bigint`

###### extraData

> **extraData**: `` `0x${string}` ``

###### gasLimit

> **gasLimit**: `bigint`

###### gasUsed

> **gasUsed**: `bigint`

###### hash

> **hash**: `` `0x${string}` `` \| `null`

###### logsBloom

> **logsBloom**: `` `0x${string}` `` \| `null`

###### miner

> **miner**: `` `0x${string}` ``

###### mixHash

> **mixHash**: `` `0x${string}` ``

###### nonce

> **nonce**: `` `0x${string}` `` \| `null`

###### number

> **number**: `bigint` \| `null`

###### parentBeaconBlockRoot?

> `optional` **parentBeaconBlockRoot?**: `` `0x${string}` ``

###### parentHash

> **parentHash**: `` `0x${string}` ``

###### receiptsRoot

> **receiptsRoot**: `` `0x${string}` ``

###### sealFields

> **sealFields**: `` `0x${string}` ``[]

###### sha3Uncles

> **sha3Uncles**: `` `0x${string}` ``

###### size

> **size**: `bigint`

###### stateRoot

> **stateRoot**: `` `0x${string}` ``

###### timestamp

> **timestamp**: `bigint`

###### totalDifficulty

> **totalDifficulty**: `bigint` \| `null`

###### transactions

> **transactions**: `` `0x${string}` ``[] \| `CeloTransaction`\<`boolean`\>[]

###### transactionsRoot

> **transactionsRoot**: `` `0x${string}` ``

###### uncles

> **uncles**: `` `0x${string}` ``[]

###### withdrawals?

> `optional` **withdrawals?**: `Withdrawal`[]

###### withdrawalsRoot?

> `optional` **withdrawalsRoot?**: `` `0x${string}` ``

#### formatters.block.type

> **type**: `"block"`

#### formatters.transaction

> `readonly` **transaction**: `object`

#### formatters.transaction.exclude

> **exclude**: \[\] \| `undefined`

#### formatters.transaction.format

> **format**: (`args`, `action?`) => \{ `accessList?`: `undefined`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `` `0x${string}` `` \| `null`; `blockNumber`: `bigint` \| `null`; `blockTimestamp?`: `bigint`; `chainId?`: `number`; `feeCurrency`: `` `0x${string}` `` \| `null`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `gatewayFee?`: `undefined`; `gatewayFeeRecipient?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `` `0x${string}` `` \| `null`; `transactionIndex`: `number` \| `null`; `type`: `"legacy"`; `typeHex`: `` `0x${string}` `` \| `null`; `v`: `bigint`; `value`: `bigint`; `yParity?`: `undefined`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `` `0x${string}` `` \| `null`; `blockNumber`: `bigint` \| `null`; `blockTimestamp?`: `bigint`; `chainId`: `number`; `feeCurrency`: `` `0x${string}` `` \| `null`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `gatewayFee?`: `undefined`; `gatewayFeeRecipient?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `` `0x${string}` `` \| `null`; `transactionIndex`: `number` \| `null`; `type`: `"eip2930"`; `typeHex`: `` `0x${string}` `` \| `null`; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `` `0x${string}` `` \| `null`; `blockNumber`: `bigint` \| `null`; `blockTimestamp?`: `bigint`; `chainId`: `number`; `feeCurrency`: `` `0x${string}` `` \| `null`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `gatewayFee?`: `undefined`; `gatewayFeeRecipient?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `` `0x${string}` `` \| `null`; `transactionIndex`: `number` \| `null`; `type`: `"eip1559"`; `typeHex`: `` `0x${string}` `` \| `null`; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes`: readonly `` `0x${string}` ``[]; `blockHash`: `` `0x${string}` `` \| `null`; `blockNumber`: `bigint` \| `null`; `blockTimestamp?`: `bigint`; `chainId`: `number`; `feeCurrency`: `` `0x${string}` `` \| `null`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `gatewayFee?`: `undefined`; `gatewayFeeRecipient?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas`: `bigint`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `` `0x${string}` `` \| `null`; `transactionIndex`: `number` \| `null`; `type`: `"eip4844"`; `typeHex`: `` `0x${string}` `` \| `null`; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList`: `SignedAuthorizationList`\<`number`\>; `blobVersionedHashes?`: `undefined`; `blockHash`: `` `0x${string}` `` \| `null`; `blockNumber`: `bigint` \| `null`; `blockTimestamp?`: `bigint`; `chainId`: `number`; `feeCurrency`: `` `0x${string}` `` \| `null`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `gatewayFee?`: `undefined`; `gatewayFeeRecipient?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `` `0x${string}` `` \| `null`; `transactionIndex`: `number` \| `null`; `type`: `"eip7702"`; `typeHex`: `` `0x${string}` `` \| `null`; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `` `0x${string}` `` \| `null`; `blockNumber`: `bigint` \| `null`; `blockTimestamp?`: `bigint`; `chainId`: `number`; `feeCurrency`: `` `0x${string}` `` \| `null`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `gatewayFee`: `bigint` \| `null`; `gatewayFeeRecipient`: `` `0x${string}` `` \| `null`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `` `0x${string}` `` \| `null`; `transactionIndex`: `number` \| `null`; `type`: `"cip42"`; `typeHex`: `` `0x${string}` `` \| `null`; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `` `0x${string}` `` \| `null`; `blockNumber`: `bigint` \| `null`; `blockTimestamp?`: `bigint`; `chainId`: `number`; `feeCurrency`: `` `0x${string}` `` \| `null`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `gatewayFee?`: `undefined`; `gatewayFeeRecipient?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `` `0x${string}` `` \| `null`; `transactionIndex`: `number` \| `null`; `type`: `"cip64"`; `typeHex`: `` `0x${string}` `` \| `null`; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList?`: `undefined`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `` `0x${string}` `` \| `null`; `blockNumber`: `bigint` \| `null`; `blockTimestamp?`: `bigint`; `chainId?`: `undefined`; `feeCurrency?`: `undefined`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `gatewayFee?`: `undefined`; `gatewayFeeRecipient?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `boolean`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `bigint`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash`: `` `0x${string}` ``; `to`: `` `0x${string}` `` \| `null`; `transactionIndex`: `number` \| `null`; `type`: `"deposit"`; `typeHex`: `` `0x${string}` `` \| `null`; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \}

##### Parameters

###### args

`CeloRpcTransaction`\<`boolean`\>

###### action?

`string`

##### Returns

\{ `accessList?`: `undefined`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `` `0x${string}` `` \| `null`; `blockNumber`: `bigint` \| `null`; `blockTimestamp?`: `bigint`; `chainId?`: `number`; `feeCurrency`: `` `0x${string}` `` \| `null`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `gatewayFee?`: `undefined`; `gatewayFeeRecipient?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `` `0x${string}` `` \| `null`; `transactionIndex`: `number` \| `null`; `type`: `"legacy"`; `typeHex`: `` `0x${string}` `` \| `null`; `v`: `bigint`; `value`: `bigint`; `yParity?`: `undefined`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `` `0x${string}` `` \| `null`; `blockNumber`: `bigint` \| `null`; `blockTimestamp?`: `bigint`; `chainId`: `number`; `feeCurrency`: `` `0x${string}` `` \| `null`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `gatewayFee?`: `undefined`; `gatewayFeeRecipient?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `` `0x${string}` `` \| `null`; `transactionIndex`: `number` \| `null`; `type`: `"eip2930"`; `typeHex`: `` `0x${string}` `` \| `null`; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `` `0x${string}` `` \| `null`; `blockNumber`: `bigint` \| `null`; `blockTimestamp?`: `bigint`; `chainId`: `number`; `feeCurrency`: `` `0x${string}` `` \| `null`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `gatewayFee?`: `undefined`; `gatewayFeeRecipient?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `` `0x${string}` `` \| `null`; `transactionIndex`: `number` \| `null`; `type`: `"eip1559"`; `typeHex`: `` `0x${string}` `` \| `null`; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes`: readonly `` `0x${string}` ``[]; `blockHash`: `` `0x${string}` `` \| `null`; `blockNumber`: `bigint` \| `null`; `blockTimestamp?`: `bigint`; `chainId`: `number`; `feeCurrency`: `` `0x${string}` `` \| `null`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `gatewayFee?`: `undefined`; `gatewayFeeRecipient?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas`: `bigint`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `` `0x${string}` `` \| `null`; `transactionIndex`: `number` \| `null`; `type`: `"eip4844"`; `typeHex`: `` `0x${string}` `` \| `null`; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList`: `SignedAuthorizationList`\<`number`\>; `blobVersionedHashes?`: `undefined`; `blockHash`: `` `0x${string}` `` \| `null`; `blockNumber`: `bigint` \| `null`; `blockTimestamp?`: `bigint`; `chainId`: `number`; `feeCurrency`: `` `0x${string}` `` \| `null`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `gatewayFee?`: `undefined`; `gatewayFeeRecipient?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `` `0x${string}` `` \| `null`; `transactionIndex`: `number` \| `null`; `type`: `"eip7702"`; `typeHex`: `` `0x${string}` `` \| `null`; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `` `0x${string}` `` \| `null`; `blockNumber`: `bigint` \| `null`; `blockTimestamp?`: `bigint`; `chainId`: `number`; `feeCurrency`: `` `0x${string}` `` \| `null`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `gatewayFee`: `bigint` \| `null`; `gatewayFeeRecipient`: `` `0x${string}` `` \| `null`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `` `0x${string}` `` \| `null`; `transactionIndex`: `number` \| `null`; `type`: `"cip42"`; `typeHex`: `` `0x${string}` `` \| `null`; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `` `0x${string}` `` \| `null`; `blockNumber`: `bigint` \| `null`; `blockTimestamp?`: `bigint`; `chainId`: `number`; `feeCurrency`: `` `0x${string}` `` \| `null`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `gatewayFee?`: `undefined`; `gatewayFeeRecipient?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `` `0x${string}` `` \| `null`; `transactionIndex`: `number` \| `null`; `type`: `"cip64"`; `typeHex`: `` `0x${string}` `` \| `null`; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList?`: `undefined`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `` `0x${string}` `` \| `null`; `blockNumber`: `bigint` \| `null`; `blockTimestamp?`: `bigint`; `chainId?`: `undefined`; `feeCurrency?`: `undefined`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `gatewayFee?`: `undefined`; `gatewayFeeRecipient?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `boolean`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `bigint`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash`: `` `0x${string}` ``; `to`: `` `0x${string}` `` \| `null`; `transactionIndex`: `number` \| `null`; `type`: `"deposit"`; `typeHex`: `` `0x${string}` `` \| `null`; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \}

#### formatters.transaction.type

> **type**: `"transaction"`

#### formatters.transactionRequest

> `readonly` **transactionRequest**: `object`

#### formatters.transactionRequest.exclude

> **exclude**: \[\] \| `undefined`

#### formatters.transactionRequest.format

> **format**: (`args`, `action?`) => \{ `accessList?`: `undefined`; `authorizationList?`: `undefined`; `blobs?`: `undefined`; `blobVersionedHashes?`: `undefined`; `data?`: `` `0x${string}` ``; `feeCurrency?`: `` `0x${string}` ``; `from?`: `` `0x${string}` ``; `gas?`: `` `0x${string}` ``; `gasPrice?`: `` `0x${string}` ``; `kzg?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `nonce?`: `` `0x${string}` ``; `sidecars?`: `undefined`; `to?`: `` `0x${string}` `` \| `null`; `type?`: `"0x0"`; `value?`: `` `0x${string}` ``; \} \| \{ `accessList?`: `AccessList`; `authorizationList?`: `undefined`; `blobs?`: `undefined`; `blobVersionedHashes?`: `undefined`; `data?`: `` `0x${string}` ``; `feeCurrency?`: `` `0x${string}` ``; `from?`: `` `0x${string}` ``; `gas?`: `` `0x${string}` ``; `gasPrice?`: `` `0x${string}` ``; `kzg?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `nonce?`: `` `0x${string}` ``; `sidecars?`: `undefined`; `to?`: `` `0x${string}` `` \| `null`; `type?`: `"0x1"`; `value?`: `` `0x${string}` ``; \} \| \{ `accessList?`: `AccessList`; `authorizationList?`: `undefined`; `blobs?`: `undefined`; `blobVersionedHashes?`: `undefined`; `data?`: `` `0x${string}` ``; `feeCurrency?`: `` `0x${string}` ``; `from?`: `` `0x${string}` ``; `gas?`: `` `0x${string}` ``; `gasPrice?`: `undefined`; `kzg?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `` `0x${string}` ``; `maxPriorityFeePerGas?`: `` `0x${string}` ``; `nonce?`: `` `0x${string}` ``; `sidecars?`: `undefined`; `to?`: `` `0x${string}` `` \| `null`; `type?`: `"0x2"`; `value?`: `` `0x${string}` ``; \} \| \{ `accessList?`: `AccessList`; `authorizationList?`: `undefined`; `blobs?`: readonly `` `0x${string}` ``[] \| readonly `ByteArray`[]; `blobVersionedHashes`: readonly `` `0x${string}` ``[]; `data?`: `` `0x${string}` ``; `feeCurrency?`: `` `0x${string}` ``; `from?`: `` `0x${string}` ``; `gas?`: `` `0x${string}` ``; `gasPrice?`: `undefined`; `kzg?`: `undefined`; `maxFeePerBlobGas?`: `` `0x${string}` ``; `maxFeePerGas?`: `` `0x${string}` ``; `maxPriorityFeePerGas?`: `` `0x${string}` ``; `nonce?`: `` `0x${string}` ``; `sidecars?`: readonly `BlobSidecar`\<`` `0x${string}` ``\>[]; `to`: `` `0x${string}` `` \| `null`; `type?`: `"0x3"`; `value?`: `` `0x${string}` ``; \} \| \{ `accessList?`: `AccessList`; `authorizationList?`: `undefined`; `blobs`: readonly `` `0x${string}` ``[] \| readonly `ByteArray`[]; `blobVersionedHashes?`: readonly `` `0x${string}` ``[]; `data?`: `` `0x${string}` ``; `feeCurrency?`: `` `0x${string}` ``; `from?`: `` `0x${string}` ``; `gas?`: `` `0x${string}` ``; `gasPrice?`: `undefined`; `kzg?`: `Kzg`; `maxFeePerBlobGas?`: `` `0x${string}` ``; `maxFeePerGas?`: `` `0x${string}` ``; `maxPriorityFeePerGas?`: `` `0x${string}` ``; `nonce?`: `` `0x${string}` ``; `sidecars?`: readonly `BlobSidecar`\<`` `0x${string}` ``\>[]; `to`: `` `0x${string}` `` \| `null`; `type?`: `"0x3"`; `value?`: `` `0x${string}` ``; \} \| \{ `accessList?`: `AccessList`; `authorizationList?`: `RpcAuthorizationList`; `blobs?`: `undefined`; `blobVersionedHashes?`: `undefined`; `data?`: `` `0x${string}` ``; `feeCurrency?`: `` `0x${string}` ``; `from?`: `` `0x${string}` ``; `gas?`: `` `0x${string}` ``; `gasPrice?`: `undefined`; `kzg?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `` `0x${string}` ``; `maxPriorityFeePerGas?`: `` `0x${string}` ``; `nonce?`: `` `0x${string}` ``; `sidecars?`: `undefined`; `to?`: `` `0x${string}` `` \| `null`; `type?`: `"0x4"`; `value?`: `` `0x${string}` ``; \} \| \{ `accessList?`: `AccessList`; `authorizationList?`: `undefined`; `blobs?`: `undefined`; `blobVersionedHashes?`: `undefined`; `data?`: `` `0x${string}` ``; `feeCurrency?`: `` `0x${string}` ``; `from?`: `` `0x${string}` ``; `gas?`: `` `0x${string}` ``; `gasPrice?`: `undefined`; `kzg?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `` `0x${string}` ``; `maxPriorityFeePerGas?`: `` `0x${string}` ``; `nonce?`: `` `0x${string}` ``; `sidecars?`: `undefined`; `to?`: `` `0x${string}` `` \| `null`; `type?`: `"0x7b"`; `value?`: `` `0x${string}` ``; \}

##### Parameters

###### args

`CeloTransactionRequest`

###### action?

`string`

##### Returns

\{ `accessList?`: `undefined`; `authorizationList?`: `undefined`; `blobs?`: `undefined`; `blobVersionedHashes?`: `undefined`; `data?`: `` `0x${string}` ``; `feeCurrency?`: `` `0x${string}` ``; `from?`: `` `0x${string}` ``; `gas?`: `` `0x${string}` ``; `gasPrice?`: `` `0x${string}` ``; `kzg?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `nonce?`: `` `0x${string}` ``; `sidecars?`: `undefined`; `to?`: `` `0x${string}` `` \| `null`; `type?`: `"0x0"`; `value?`: `` `0x${string}` ``; \} \| \{ `accessList?`: `AccessList`; `authorizationList?`: `undefined`; `blobs?`: `undefined`; `blobVersionedHashes?`: `undefined`; `data?`: `` `0x${string}` ``; `feeCurrency?`: `` `0x${string}` ``; `from?`: `` `0x${string}` ``; `gas?`: `` `0x${string}` ``; `gasPrice?`: `` `0x${string}` ``; `kzg?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `nonce?`: `` `0x${string}` ``; `sidecars?`: `undefined`; `to?`: `` `0x${string}` `` \| `null`; `type?`: `"0x1"`; `value?`: `` `0x${string}` ``; \} \| \{ `accessList?`: `AccessList`; `authorizationList?`: `undefined`; `blobs?`: `undefined`; `blobVersionedHashes?`: `undefined`; `data?`: `` `0x${string}` ``; `feeCurrency?`: `` `0x${string}` ``; `from?`: `` `0x${string}` ``; `gas?`: `` `0x${string}` ``; `gasPrice?`: `undefined`; `kzg?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `` `0x${string}` ``; `maxPriorityFeePerGas?`: `` `0x${string}` ``; `nonce?`: `` `0x${string}` ``; `sidecars?`: `undefined`; `to?`: `` `0x${string}` `` \| `null`; `type?`: `"0x2"`; `value?`: `` `0x${string}` ``; \} \| \{ `accessList?`: `AccessList`; `authorizationList?`: `undefined`; `blobs?`: readonly `` `0x${string}` ``[] \| readonly `ByteArray`[]; `blobVersionedHashes`: readonly `` `0x${string}` ``[]; `data?`: `` `0x${string}` ``; `feeCurrency?`: `` `0x${string}` ``; `from?`: `` `0x${string}` ``; `gas?`: `` `0x${string}` ``; `gasPrice?`: `undefined`; `kzg?`: `undefined`; `maxFeePerBlobGas?`: `` `0x${string}` ``; `maxFeePerGas?`: `` `0x${string}` ``; `maxPriorityFeePerGas?`: `` `0x${string}` ``; `nonce?`: `` `0x${string}` ``; `sidecars?`: readonly `BlobSidecar`\<`` `0x${string}` ``\>[]; `to`: `` `0x${string}` `` \| `null`; `type?`: `"0x3"`; `value?`: `` `0x${string}` ``; \} \| \{ `accessList?`: `AccessList`; `authorizationList?`: `undefined`; `blobs`: readonly `` `0x${string}` ``[] \| readonly `ByteArray`[]; `blobVersionedHashes?`: readonly `` `0x${string}` ``[]; `data?`: `` `0x${string}` ``; `feeCurrency?`: `` `0x${string}` ``; `from?`: `` `0x${string}` ``; `gas?`: `` `0x${string}` ``; `gasPrice?`: `undefined`; `kzg?`: `Kzg`; `maxFeePerBlobGas?`: `` `0x${string}` ``; `maxFeePerGas?`: `` `0x${string}` ``; `maxPriorityFeePerGas?`: `` `0x${string}` ``; `nonce?`: `` `0x${string}` ``; `sidecars?`: readonly `BlobSidecar`\<`` `0x${string}` ``\>[]; `to`: `` `0x${string}` `` \| `null`; `type?`: `"0x3"`; `value?`: `` `0x${string}` ``; \} \| \{ `accessList?`: `AccessList`; `authorizationList?`: `RpcAuthorizationList`; `blobs?`: `undefined`; `blobVersionedHashes?`: `undefined`; `data?`: `` `0x${string}` ``; `feeCurrency?`: `` `0x${string}` ``; `from?`: `` `0x${string}` ``; `gas?`: `` `0x${string}` ``; `gasPrice?`: `undefined`; `kzg?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `` `0x${string}` ``; `maxPriorityFeePerGas?`: `` `0x${string}` ``; `nonce?`: `` `0x${string}` ``; `sidecars?`: `undefined`; `to?`: `` `0x${string}` `` \| `null`; `type?`: `"0x4"`; `value?`: `` `0x${string}` ``; \} \| \{ `accessList?`: `AccessList`; `authorizationList?`: `undefined`; `blobs?`: `undefined`; `blobVersionedHashes?`: `undefined`; `data?`: `` `0x${string}` ``; `feeCurrency?`: `` `0x${string}` ``; `from?`: `` `0x${string}` ``; `gas?`: `` `0x${string}` ``; `gasPrice?`: `undefined`; `kzg?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `` `0x${string}` ``; `maxPriorityFeePerGas?`: `` `0x${string}` ``; `nonce?`: `` `0x${string}` ``; `sidecars?`: `undefined`; `to?`: `` `0x${string}` `` \| `null`; `type?`: `"0x7b"`; `value?`: `` `0x${string}` ``; \}

#### formatters.transactionRequest.type

> **type**: `"transactionRequest"`

### id

> **id**: `42220`

### name

> **name**: `"Celo"`

### nativeCurrency

> **nativeCurrency**: `object`

#### nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### nativeCurrency.name

> `readonly` **name**: `"CELO"`

#### nativeCurrency.symbol

> `readonly` **symbol**: `"CELO"`

### prepareTransactionRequest?

> `optional` **prepareTransactionRequest?**: ((`args`, `options`) => `Promise`\<`PrepareTransactionRequestParameters`\<`Chain` \| `undefined`, `Account` \| `undefined`, `Chain` \| `undefined`, `` `0x${string}` `` \| `Account` \| `undefined`, `PrepareTransactionRequestRequest`\<`Chain` \| `undefined`, `Chain` \| `undefined`, `Chain` \| `undefined`\>\>\>) \| \[(`args`, `options`) => `Promise`\<`PrepareTransactionRequestParameters`\<`Chain` \| `undefined`, `Account` \| `undefined`, `Chain` \| `undefined`, `` `0x${string}` `` \| `Account` \| `undefined`, `PrepareTransactionRequestRequest`\<`Chain` \| `undefined`, `Chain` \| `undefined`, `Chain` \| `undefined`\>\>\>, `object`\]

### rpcUrls

> **rpcUrls**: `object`

#### rpcUrls.default

> `readonly` **default**: `object`

#### rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://forno.celo.org"`\]

### serializers

> **serializers**: `object`

#### serializers.transaction

> `readonly` **transaction**: (`transaction`, `signature?`) => `` `0x02${string}` `` \| `` `0x01${string}` `` \| `` `0x03${string}` `` \| `` `0x04${string}` `` \| `TransactionSerializedLegacy` \| `` `0x7e${string}` `` \| `` `0x7b${string}` ``

##### Parameters

###### transaction

`CeloTransactionSerializable`

###### signature?

`Signature`

##### Returns

`` `0x02${string}` `` \| `` `0x01${string}` `` \| `` `0x03${string}` `` \| `` `0x04${string}` `` \| `TransactionSerializedLegacy` \| `` `0x7e${string}` `` \| `` `0x7b${string}` ``

### sourceId?

> `optional` **sourceId?**: `number`

### testnet

> **testnet**: `false`

### verifyHash?

> `optional` **verifyHash?**: (`client`, `parameters`) => `Promise`\<`boolean`\>

#### Parameters

##### client

`Client`\<`Transport`, `Chain` \| `undefined`, `Account` \| `undefined`, `undefined`, \{\[`key`: `string`\]: `unknown`; `account?`: `undefined`; `batch?`: `undefined`; `cacheTime?`: `undefined`; `ccipRead?`: `undefined`; `chain?`: `undefined`; `dataSuffix?`: `undefined`; `experimental_blockTag?`: `undefined`; `key?`: `undefined`; `name?`: `undefined`; `pollingInterval?`: `undefined`; `request?`: `undefined`; `transport?`: `undefined`; `type?`: `undefined`; `uid?`: `undefined`; \} \| `undefined`\>

##### parameters

`VerifyHashParameters`

#### Returns

`Promise`\<`boolean`\>
