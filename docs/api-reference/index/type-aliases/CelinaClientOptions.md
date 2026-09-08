[**@andrewkimjoseph/celina-sdk**](../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../README.md) / [index](../README.md) / CelinaClientOptions

# Type Alias: CelinaClientOptions

> **CelinaClientOptions** = `Partial`\<[`SdkConfig`](../interfaces/SdkConfig.md)\> & `object`

Defined in: [src/index.ts:33](https://github.com/andrewkimjoseph/celina-sdk/blob/d1a92b5baf7555d6145bf2dd87e39acd80d0d9e3/src/index.ts#L33)

Optional RPC overrides when creating a Celina client.

## Type Declaration

### agentKarma?

> `optional` **agentKarma?**: [`AgentKarmaServiceConfig`](../../services/agentkarma.service/type-aliases/AgentKarmaServiceConfig.md)

Optional AgentKarma reputation adapter config (baseUrl, timeout, fetch, …).
Omit to read from https://agentkarma.io with SDK defaults.
