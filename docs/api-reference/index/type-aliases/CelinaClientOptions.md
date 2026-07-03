[**@andrewkimjoseph/celina-sdk**](../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../README.md) / [index](../README.md) / CelinaClientOptions

# Type Alias: CelinaClientOptions

> **CelinaClientOptions** = `Partial`\<[`SdkConfig`](../interfaces/SdkConfig.md)\> & `object`

Defined in: [src/index.ts:31](https://github.com/andrewkimjoseph/celina-sdk/blob/2ff9e44d247fc85ce400a4b07de79a8872532d5d/src/index.ts#L31)

Optional RPC overrides when creating a Celina client.

## Type Declaration

### agentKarma?

> `optional` **agentKarma?**: [`AgentKarmaServiceConfig`](../../services/agentkarma.service/type-aliases/AgentKarmaServiceConfig.md)

Optional AgentKarma reputation adapter config (baseUrl, timeout, fetch, …).
Omit to read from https://agentkarma.io with SDK defaults.
