[**@andrewkimjoseph/celina-sdk**](../README.md)

***

[@andrewkimjoseph/celina-sdk](../README.md) / index

# index

## Classes

- [SelfApiError](classes/SelfApiError.md)
- [SelfExpiredSessionError](classes/SelfExpiredSessionError.md)

## Interfaces

- [CelinaClient](interfaces/CelinaClient.md)
- [CeloAgentSnapshot](interfaces/CeloAgentSnapshot.md)
- [KarmaFaceData](interfaces/KarmaFaceData.md)
- [KarmaSnapshot](interfaces/KarmaSnapshot.md)
- [SdkConfig](interfaces/SdkConfig.md)
- [SelfSessionLinks](interfaces/SelfSessionLinks.md)
- [TrustDecision](interfaces/TrustDecision.md)
- [TrustPolicy](interfaces/TrustPolicy.md)

## Type Aliases

- [AaveAsset](type-aliases/AaveAsset.md)
- [AttributionVerificationResult](type-aliases/AttributionVerificationResult.md)
- [CelinaClientOptions](type-aliases/CelinaClientOptions.md)
- [SelfRegistrationMode](type-aliases/SelfRegistrationMode.md)

## Variables

- [AAVE\_POOL](variables/AAVE_POOL.md)
- [AAVE\_SUPPORTED\_SYMBOLS](variables/AAVE_SUPPORTED_SYMBOLS.md)
- [CELINA\_DATA\_SUFFIX](variables/CELINA_DATA_SUFFIX.md)
- [CHAIN](variables/CHAIN.md)
- [DEFAULT\_RPC\_URL](variables/DEFAULT_RPC_URL.md)
- [ERC\_8021\_MARKER](variables/ERC_8021_MARKER.md)
- [GOODDOLLAR\_CUSD\_EXCHANGE\_ID](variables/GOODDOLLAR_CUSD_EXCHANGE_ID.md)
- [GOODDOLLAR\_IDENTITY\_ADDRESS](variables/GOODDOLLAR_IDENTITY_ADDRESS.md)
- [GOODDOLLAR\_MENTO\_BROKER](variables/GOODDOLLAR_MENTO_BROKER.md)
- [GOODDOLLAR\_MENTO\_EXCHANGE\_PROVIDER](variables/GOODDOLLAR_MENTO_EXCHANGE_PROVIDER.md)
- [GOODDOLLAR\_RESERVE\_COLLATERAL](variables/GOODDOLLAR_RESERVE_COLLATERAL.md)
- [GOODDOLLAR\_TOKEN\_ADDRESS](variables/GOODDOLLAR_TOKEN_ADDRESS.md)
- [GOODDOLLAR\_UBI\_SCHEME\_ADDRESS](variables/GOODDOLLAR_UBI_SCHEME_ADDRESS.md)
- [SELF\_DEMO\_NETWORK](variables/SELF_DEMO_NETWORK.md)
- [SELF\_HEADERS](variables/SELF_HEADERS.md)

## Functions

- [appendCelinaCalldataTag](functions/appendCelinaCalldataTag.md)
- [buildCelinaAttributionTag](functions/buildCelinaAttributionTag.md)
- [buildErc8021AttributionSuffix](functions/buildErc8021AttributionSuffix.md)
- [clearSelfSessionsForTests](functions/clearSelfSessionsForTests.md)
- [createCelinaClient](functions/createCelinaClient.md)
- [flushCelinaAnalytics](functions/flushCelinaAnalytics.md)
- [formatSelfSessionLinksDisplay](functions/formatSelfSessionLinksDisplay.md)
- [isGoodDollarUsdReservePair](functions/isGoodDollarUsdReservePair.md)
- [normalizeAttributionTags](functions/normalizeAttributionTags.md)
- [parseCelinaLegacyAttributionSuffix](functions/parseCelinaLegacyAttributionSuffix.md)
- [resolveAaveAsset](functions/resolveAaveAsset.md)
- [resolveSelfSessionLinks](functions/resolveSelfSessionLinks.md)
- [runWithAnalyticsWallet](functions/runWithAnalyticsWallet.md)
- [selfDemoUrl](functions/selfDemoUrl.md)
- [stripErc8021SuffixIfPresent](functions/stripErc8021SuffixIfPresent.md)
- [toErc8021AttributionCodes](functions/toErc8021AttributionCodes.md)
- [verifyAttributionInCalldata](functions/verifyAttributionInCalldata.md)

## References

### AgentKarmaFace

Re-exports [AgentKarmaFace](../services/agentkarma.service/type-aliases/AgentKarmaFace.md)

***

### AgentKarmaService

Re-exports [AgentKarmaService](../services/agentkarma.service/classes/AgentKarmaService.md)

***

### AgentKarmaServiceConfig

Re-exports [AgentKarmaServiceConfig](../services/agentkarma.service/type-aliases/AgentKarmaServiceConfig.md)

***

### ContractCallParams

Re-exports [ContractCallParams](../services/contract.service/interfaces/ContractCallParams.md)

***

### CounterpartyDecision

Re-exports [CounterpartyDecision](../services/agentkarma.service/interfaces/CounterpartyDecision.md)

***

### GetKarmaOptions

Re-exports [GetKarmaOptions](../services/agentkarma.service/interfaces/GetKarmaOptions.md)

***

### GoodDollarReserveAmountSide

Re-exports [GoodDollarReserveAmountSide](../services/gooddollar.service/type-aliases/GoodDollarReserveAmountSide.md)

***

### GoodDollarReserveQuoteOptions

Re-exports [GoodDollarReserveQuoteOptions](../services/gooddollar.service/interfaces/GoodDollarReserveQuoteOptions.md)

***

### GoodDollarReserveSwapParams

Re-exports [GoodDollarReserveSwapParams](../services/gooddollar.service/interfaces/GoodDollarReserveSwapParams.md)

***

### GovernanceProposalsOptions

Re-exports [GovernanceProposalsOptions](../services/governance.service/interfaces/GovernanceProposalsOptions.md)

***

### MentoFxParams

Re-exports [MentoFxParams](../services/mento-fx.service/interfaces/MentoFxParams.md)

***

### PreparedFlow

Re-exports [PreparedFlow](../types/prepared/interfaces/PreparedFlow.md)

***

### PreparedTx

Re-exports [PreparedTx](../types/prepared/interfaces/PreparedTx.md)

***

### PreparedTxKind

Re-exports [PreparedTxKind](../types/prepared/type-aliases/PreparedTxKind.md)

***

### RegisterSelfAgentParams

Re-exports [RegisterSelfAgentParams](../services/self.service/interfaces/RegisterSelfAgentParams.md)

***

### ResolvedToken

Re-exports [ResolvedToken](../services/token.service/interfaces/ResolvedToken.md)

***

### SelfService

Re-exports [SelfService](../services/self.service/classes/SelfService.md)

***

### SerializedPreparedFlow

Re-exports [SerializedPreparedFlow](../types/prepared/interfaces/SerializedPreparedFlow.md)

***

### serializePreparedFlow

Re-exports [serializePreparedFlow](../types/prepared/functions/serializePreparedFlow.md)

***

### UniswapSwapParams

Re-exports [UniswapSwapParams](../services/uniswap.service/interfaces/UniswapSwapParams.md)

***

### VerifySelfAgentParams

Re-exports [VerifySelfAgentParams](../services/self.service/interfaces/VerifySelfAgentParams.md)

***

### VerifySelfRequestParams

Re-exports [VerifySelfRequestParams](../services/self.service/interfaces/VerifySelfRequestParams.md)
