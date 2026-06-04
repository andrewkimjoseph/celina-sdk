import { z } from "zod";
import { paginationFields } from "../schemas/common.js";
import type { ToolDefinition } from "../types.js";

export const governanceToolDefinitions: ToolDefinition[] = [
  {
    name: "get_governance_proposals",
    description:
      "Returns Celo governance proposals with pagination. Set include_metadata=false for faster responses.",
    inputSchema: z.object({
      include_inactive: z.boolean().optional(),
      include_metadata: z.boolean().optional(),
      ...paginationFields,
      page_size: z.number().int().min(1).max(20).optional(),
    }),
    families: ["read"],
    mcp: {
      title: "Get Governance Proposals",
      annotations: { readOnlyHint: true, idempotentHint: true },
    },
    handler: async (runtime, input) =>
      runtime.celina.governance.getGovernanceProposals({
        includeInactive: input.include_inactive as boolean | undefined,
        includeMetadata: input.include_metadata as boolean | undefined,
        page: input.page as number | undefined,
        pageSize: input.page_size as number | undefined,
        offset: input.offset as number | undefined,
        limit: input.limit as number | undefined,
      }),
  },
  {
    name: "get_proposal_details",
    description:
      "Returns detailed information about a Celo governance proposal.",
    inputSchema: z.object({
      proposal_id: z.number().int().min(0),
    }),
    families: ["read"],
    mcp: {
      title: "Get Proposal Details",
      annotations: { readOnlyHint: true, idempotentHint: true },
    },
    handler: async (runtime, input) =>
      runtime.celina.governance.getProposalDetails(input.proposal_id as number),
  },
];
