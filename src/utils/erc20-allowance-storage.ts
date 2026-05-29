/**
 * ERC-20 allowance storage slot helpers for gas simulation with state overrides.
 * Used when estimating swap/send gas before on-chain approval is confirmed.
 */
import {
  encodeAbiParameters,
  keccak256,
  pad,
  parseAbiParameters,
  toHex,
  type Address,
  type Hex,
  type StateOverride,
} from "viem";

/** Common base slots for ERC-20 allowance mappings (Mento stablecoins use 7). */
const ALLOWANCE_MAPPING_SLOTS = [
  7n,
  1n,
  0n,
  2n,
  3n,
  4n,
  5n,
  6n,
  8n,
  9n,
  10n,
  11n,
  12n,
  13n,
  14n,
  15n,
  16n,
  17n,
  18n,
  19n,
  20n,
  51n,
] as const;

/**
 * Compute the storage slot for `allowance(owner, spender)` given the mapping base slot.
 */
export function erc20AllowanceStorageSlot(
  owner: Address,
  spender: Address,
  mappingSlot: bigint,
): Hex {
  const ownerSlot = keccak256(
    encodeAbiParameters(parseAbiParameters("address, uint256"), [owner, mappingSlot]),
  );
  return keccak256(
    encodeAbiParameters(parseAbiParameters("address, bytes32"), [spender, ownerSlot]),
  );
}

/**
 * viem `stateOverride` that sets ERC-20 allowance for gas estimation.
 * @param mappingSlot - Allowance mapping slot in the token contract (try `ALLOWANCE_MAPPING_SLOTS`)
 */
export function erc20AllowanceStateOverride(
  token: Address,
  owner: Address,
  spender: Address,
  amount: bigint,
  mappingSlot: bigint,
): StateOverride {
  return [
    {
      address: token,
      stateDiff: [
        {
          slot: erc20AllowanceStorageSlot(owner, spender, mappingSlot),
          value: pad(toHex(amount)),
        },
      ],
    },
  ];
}

/** True when an estimateGas error likely means allowance/transfer would revert. */
export function isLikelyTransferFailed(error: unknown): boolean {
  const message =
    error instanceof Error
      ? `${error.message} ${error.cause instanceof Error ? error.cause.message : ""}`
      : String(error);
  return /transfer failed/i.test(message);
}

/** Mapping base slots to probe when simulating ERC-20 allowance (exported for tests). */
export { ALLOWANCE_MAPPING_SLOTS };
