[**@andrewkimjoseph/celina-sdk**](../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../README.md) / [index](../README.md) / CELINA\_DATA\_SUFFIX

# Variable: CELINA\_DATA\_SUFFIX

> `const` **CELINA\_DATA\_SUFFIX**: `` `0x${string}` ``

Defined in: [src/config/celina-tag.ts:9](https://github.com/andrewkimjoseph/celina-sdk/blob/451f622f8dec060faa5c74891931f2871cc54219/src/config/celina-tag.ts#L9)

Legacy UTF-8 marker hex(`"CELINA"`) used inside the dual attribution suffix — not the full on-chain tag by itself. Full wire format is legacy `CELINA|…` plus an ERC-8021 Schema 0 suffix; see [appendCelinaCalldataTag](../functions/appendCelinaCalldataTag.md).
