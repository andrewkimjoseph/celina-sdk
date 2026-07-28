const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000" as const;

export interface ValidatorGroupVotes {
  address: `0x${string}`;
  votes: bigint;
}

/**
 * Find lesser/greater neighbour validator groups after a vote weight change.
 * Mirrors Celo Mondo's findLesserAndGreaterAfterVote (groups sorted descending).
 */
export function findLesserAndGreaterAfterVote(
  groups: ValidatorGroupVotes[],
  targetGroup: `0x${string}`,
  voteWeight: bigint,
): { lesser: `0x${string}`; greater: `0x${string}` } {
  const sortedGroups = [...groups].sort((a, b) => {
    if (a.votes === b.votes) return 0;
    return a.votes > b.votes ? -1 : 1;
  });

  const selectedGroup = sortedGroups.find(
    (g) => g.address.toLowerCase() === targetGroup.toLowerCase(),
  );
  const voteTotal = (selectedGroup?.votes ?? 0n) + voteWeight;

  let greater: `0x${string}` = ZERO_ADDRESS;
  let lesser: `0x${string}` = ZERO_ADDRESS;

  for (const group of sortedGroups) {
    if (group.address.toLowerCase() === targetGroup.toLowerCase()) continue;
    if (group.votes < voteTotal) {
      lesser = group.address;
      break;
    }
    greater = group.address;
  }

  return { lesser, greater };
}
