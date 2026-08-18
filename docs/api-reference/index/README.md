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
- [AttributionCheckResult](type-aliases/AttributionCheckResult.md)
- [AttributionVerificationResult](type-aliases/AttributionVerificationResult.md)
- [CelinaClientOptions](type-aliases/CelinaClientOptions.md)
- [GetGovernanceDelegatesOptions](type-aliases/GetGovernanceDelegatesOptions.md)
- [GoodDollarIdentityGuidance](type-aliases/GoodDollarIdentityGuidance.md)
- [GoodDollarIdentityGuidanceInput](type-aliases/GoodDollarIdentityGuidanceInput.md)
- [GoodDollarIdentityRecommendedAction](type-aliases/GoodDollarIdentityRecommendedAction.md)
- [GovernanceDelegate](type-aliases/GovernanceDelegate.md)
- [GovernanceDelegateMetadata](type-aliases/GovernanceDelegateMetadata.md)
- [GovernanceDelegatesResult](type-aliases/GovernanceDelegatesResult.md)
- [SelfRegistrationMode](type-aliases/SelfRegistrationMode.md)
- [StakeEligibilityResult](type-aliases/StakeEligibilityResult.md)
- [VoteValueName](type-aliases/VoteValueName.md)

## Variables

- [AAVE\_POOL](variables/AAVE_POOL.md)
- [AAVE\_SUPPORTED\_SYMBOLS](variables/AAVE_SUPPORTED_SYMBOLS.md)
- [CHAIN](variables/CHAIN.md)
- [DEFAULT\_RPC\_URL](variables/DEFAULT_RPC_URL.md)
- [ERC\_8021\_MARKER](variables/ERC_8021_MARKER.md)
- [FIXIDITY\_ONE](variables/FIXIDITY_ONE.md)
- [GOODDOLLAR\_CUSD\_EXCHANGE\_ID](variables/GOODDOLLAR_CUSD_EXCHANGE_ID.md)
- [GOODDOLLAR\_FACE\_VERIFICATION\_CALLBACK\_URL](variables/GOODDOLLAR_FACE_VERIFICATION_CALLBACK_URL.md)
- [GOODDOLLAR\_HUMANNESS\_REMEDIATION](variables/GOODDOLLAR_HUMANNESS_REMEDIATION.md)
- [GOODDOLLAR\_IDENTITY\_ADDRESS](variables/GOODDOLLAR_IDENTITY_ADDRESS.md)
- [GOODDOLLAR\_MENTO\_BROKER](variables/GOODDOLLAR_MENTO_BROKER.md)
- [GOODDOLLAR\_MENTO\_EXCHANGE\_PROVIDER](variables/GOODDOLLAR_MENTO_EXCHANGE_PROVIDER.md)
- [GOODDOLLAR\_RESERVE\_COLLATERAL](variables/GOODDOLLAR_RESERVE_COLLATERAL.md)
- [GOODDOLLAR\_TOKEN\_ADDRESS](variables/GOODDOLLAR_TOKEN_ADDRESS.md)
- [GOODDOLLAR\_UBI\_SCHEME\_ADDRESS](variables/GOODDOLLAR_UBI_SCHEME_ADDRESS.md)
- [SELF\_DEMO\_NETWORK](variables/SELF_DEMO_NETWORK.md)
- [SELF\_HEADERS](variables/SELF_HEADERS.md)
- [VOTE\_VALUES](variables/VOTE_VALUES.md)

## Functions

- [appendCelinaCalldataTag](functions/appendCelinaCalldataTag.md)
- [attributionDecodeWindow](functions/attributionDecodeWindow.md)
- [buildConnectIdentityError](functions/buildConnectIdentityError.md)
- [buildErc8021AttributionSuffix](functions/buildErc8021AttributionSuffix.md)
- [checkAttributionInCalldata](functions/checkAttributionInCalldata.md)
- [clearSelfSessionsForTests](functions/clearSelfSessionsForTests.md)
- [collectAttributionTags](functions/collectAttributionTags.md)
- [createCelinaClient](functions/createCelinaClient.md)
- [deriveGoodDollarIdentityGuidance](functions/deriveGoodDollarIdentityGuidance.md)
- [findLesserAndGreaterAfterVote](functions/findLesserAndGreaterAfterVote.md)
- [flushCelinaAnalytics](functions/flushCelinaAnalytics.md)
- [formatSelfSessionLinksDisplay](functions/formatSelfSessionLinksDisplay.md)
- [fromFixidity](functions/fromFixidity.md)
- [isGoodDollarUsdReservePair](functions/isGoodDollarUsdReservePair.md)
- [normalizeAttributionTags](functions/normalizeAttributionTags.md)
- [parsePrivateKeyEnv](functions/parsePrivateKeyEnv.md)
- [percentToFixidity](functions/percentToFixidity.md)
- [resolveAaveAsset](functions/resolveAaveAsset.md)
- [resolveSelfSessionLinks](functions/resolveSelfSessionLinks.md)
- [runWithAnalyticsWallet](functions/runWithAnalyticsWallet.md)
- [selfDemoUrl](functions/selfDemoUrl.md)
- [shouldSkipFaceVerification](functions/shouldSkipFaceVerification.md)
- [stripErc8021SuffixIfPresent](functions/stripErc8021SuffixIfPresent.md)
- [toErc8021AttributionCodes](functions/toErc8021AttributionCodes.md)
- [toFixidity](functions/toFixidity.md)
- [tryParsePrivateKeyEnv](functions/tryParsePrivateKeyEnv.md)
- [verifyAttributionInCalldata](functions/verifyAttributionInCalldata.md)
- [voteValueToInt](functions/voteValueToInt.md)

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

### assertHumanness

Re-exports [assertHumanness](../services/humanness.service/functions/assertHumanness.md)

***

### ContractCallParams

Re-exports [ContractCallParams](../services/contract.service/interfaces/ContractCallParams.md)

***

### CounterpartyDecision

Re-exports [CounterpartyDecision](../services/agentkarma.service/interfaces/CounterpartyDecision.md)

***

### FaceVerificationLinkResult

Re-exports [FaceVerificationLinkResult](../services/gooddollar.service/type-aliases/FaceVerificationLinkResult.md)

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

### HumannessCheckResult

Re-exports [HumannessCheckResult](../services/humanness.service/interfaces/HumannessCheckResult.md)

***

### HumannessRailResult

Re-exports [HumannessRailResult](../services/humanness.service/interfaces/HumannessRailResult.md)

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
