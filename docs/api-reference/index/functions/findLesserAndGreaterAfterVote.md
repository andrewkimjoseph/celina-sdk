[**@andrewkimjoseph/celina-sdk**](../../README.md)

***

[@andrewkimjoseph/celina-sdk](../../README.md) / [index](../README.md) / findLesserAndGreaterAfterVote

# Function: findLesserAndGreaterAfterVote()

> **findLesserAndGreaterAfterVote**(`groups`, `targetGroup`, `voteWeight`): `object`

Defined in: [src/utils/election-vote-neighbors.ts:12](https://github.com/andrewkimjoseph/celina-sdk/blob/15da21d7e6ad751c0106bbc57bbb0d6fb8e87371/src/utils/election-vote-neighbors.ts#L12)

Find lesser/greater neighbour validator groups after a vote weight change.
Mirrors Celo Mondo's findLesserAndGreaterAfterVote (groups sorted descending).

## Parameters

### groups

`ValidatorGroupVotes`[]

### targetGroup

`` `0x${string}` ``

### voteWeight

`bigint`

## Returns

`object`

### greater

> **greater**: `` `0x${string}` ``

### lesser

> **lesser**: `` `0x${string}` ``
