[**@cnvlabskoxyz/celina-sdk**](../../README.md)

***

[@cnvlabskoxyz/celina-sdk](../../README.md) / [index](../README.md) / CelinaClientOptions

# Type Alias: CelinaClientOptions

> **CelinaClientOptions** = `Partial`\<[`SdkConfig`](../interfaces/SdkConfig.md)\> & `object`

Defined in: [src/index.ts:33](https://github.com/andrewkimjoseph/celina-sdk/blob/2b7487815780d780ca38b8d2b9ce505b311839e0/src/index.ts#L33)

Optional RPC overrides when creating a Celina client.

## Type Declaration

### agentKarma?

> `optional` **agentKarma?**: [`AgentKarmaServiceConfig`](../../services/agentkarma.service/type-aliases/AgentKarmaServiceConfig.md)

Optional AgentKarma reputation adapter config (baseUrl, timeout, fetch, …).
Omit to read from https://agentkarma.io with SDK defaults.
