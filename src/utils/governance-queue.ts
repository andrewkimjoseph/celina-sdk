export interface GovernanceQueueEntry {
  proposalId: number;
  upvotes: bigint;
}

function sortQueueByUpvotes(queue: GovernanceQueueEntry[]): GovernanceQueueEntry[] {
  return [...queue].sort((a, b) => {
    if (a.upvotes > b.upvotes) return 1;
    if (a.upvotes < b.upvotes) return -1;
    return 0;
  });
}

function neighborsAtIndex(
  sorted: GovernanceQueueEntry[],
  index: number,
): { lesser: number; greater: number } {
  return {
    lesser: index === 0 ? 0 : sorted[index - 1]!.proposalId,
    greater: index === sorted.length - 1 ? 0 : sorted[index + 1]!.proposalId,
  };
}

/** Queue neighbors after adding upvote weight (Celo Governance.upvote). */
export function lesserAndGreaterAfterUpvote(
  queue: GovernanceQueueEntry[],
  proposalId: number,
  addedWeight: bigint,
): { lesser: number; greater: number } {
  const proposalIndex = queue.findIndex((entry) => entry.proposalId === proposalId);
  if (proposalIndex < 0) {
    throw new Error(`Proposal ${proposalId} is not in the governance queue.`);
  }

  const updated = [...queue];
  updated[proposalIndex] = {
    proposalId,
    upvotes: updated[proposalIndex]!.upvotes + addedWeight,
  };

  const sorted = sortQueueByUpvotes(updated);
  const newIndex = sorted.findIndex((entry) => entry.proposalId === proposalId);
  return neighborsAtIndex(sorted, newIndex);
}

/** Queue neighbors after removing upvote weight (Celo Governance.revokeUpvote). */
export function lesserAndGreaterAfterRevokeUpvote(
  queue: GovernanceQueueEntry[],
  proposalId: number,
  removedWeight: bigint,
): { lesser: number; greater: number } {
  const proposalIndex = queue.findIndex((entry) => entry.proposalId === proposalId);
  if (proposalIndex < 0) {
    throw new Error(`Proposal ${proposalId} is not in the governance queue.`);
  }

  const updated = [...queue];
  updated[proposalIndex] = {
    proposalId,
    upvotes: updated[proposalIndex]!.upvotes - removedWeight,
  };

  const sorted = sortQueueByUpvotes(updated);
  const newIndex = sorted.findIndex((entry) => entry.proposalId === proposalId);
  if (newIndex < 0) {
    return { lesser: 0, greater: 0 };
  }
  return neighborsAtIndex(sorted, newIndex);
}
