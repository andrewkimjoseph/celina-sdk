import { describe, expect, it } from "vitest";
import {
  lesserAndGreaterAfterRevokeUpvote,
  lesserAndGreaterAfterUpvote,
} from "../../src/utils/governance-queue.js";

describe("governance-queue neighbors", () => {
  const queue = [
    { proposalId: 10, upvotes: 100n },
    { proposalId: 20, upvotes: 200n },
    { proposalId: 30, upvotes: 300n },
  ];

  it("returns head/tail neighbors after upvote", () => {
    expect(lesserAndGreaterAfterUpvote(queue, 10, 250n)).toEqual({
      lesser: 30,
      greater: 0,
    });
    expect(lesserAndGreaterAfterUpvote(queue, 30, 50n)).toEqual({
      lesser: 20,
      greater: 0,
    });
  });

  it("returns middle neighbors after upvote", () => {
    expect(lesserAndGreaterAfterUpvote(queue, 20, 150n)).toEqual({
      lesser: 30,
      greater: 0,
    });
  });

  it("handles single-item queue", () => {
    const single = [{ proposalId: 5, upvotes: 50n }];
    expect(lesserAndGreaterAfterUpvote(single, 5, 10n)).toEqual({
      lesser: 0,
      greater: 0,
    });
  });

  it("returns neighbors after revoke upvote", () => {
    expect(lesserAndGreaterAfterRevokeUpvote(queue, 30, 150n)).toEqual({
      lesser: 10,
      greater: 20,
    });
  });

  it("throws when proposal is missing from queue", () => {
    expect(() => lesserAndGreaterAfterUpvote(queue, 99, 1n)).toThrow(
      "not in the governance queue",
    );
  });
});
