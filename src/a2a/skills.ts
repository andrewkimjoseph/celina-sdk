import type { WebsiteToolCategory } from "../tools/website-sync.js";

export const CELINA_TOOL_MIME = "application/vnd.celina.tool+json";

export interface CelinaA2ASkillMeta {
  id: string;
  name: string;
  tags: string[];
}

/** Maps website tool categories to A2A skill metadata (hosted read profile). */
export const CATEGORY_TO_A2A_SKILL: Record<WebsiteToolCategory, CelinaA2ASkillMeta> = {
  Blockchain: {
    id: "celo-blockchain",
    name: "Celo blockchain reads",
    tags: ["celo", "blockchain", "mainnet"],
  },
  Account: {
    id: "celo-balances",
    name: "Celo balances",
    tags: ["celo", "balances", "account"],
  },
  Token: {
    id: "celo-balances",
    name: "Celo balances",
    tags: ["celo", "balances", "token"],
  },
  Transaction: {
    id: "celo-transaction",
    name: "Celo transaction reads",
    tags: ["celo", "transaction"],
  },
  "Mento FX": {
    id: "mento-fx",
    name: "Mento FX quotes",
    tags: ["celo", "mento", "fx", "swap"],
  },
  Uniswap: {
    id: "uniswap",
    name: "Uniswap v4 quotes",
    tags: ["celo", "uniswap", "swap", "amm"],
  },
  Wallet: {
    id: "ens",
    name: "ENS resolution",
    tags: ["celo", "ens", "wallet"],
  },
  GoodDollar: {
    id: "gooddollar",
    name: "GoodDollar reads",
    tags: ["celo", "gooddollar", "ubi", "reserve"],
  },
  Aave: {
    id: "aave",
    name: "Aave V3 reads",
    tags: ["celo", "aave", "defi"],
  },
  Self: {
    id: "self-verify",
    name: "Self Agent ID verification",
    tags: ["celo", "self", "identity", "agent"],
  },
  Governance: {
    id: "governance",
    name: "Celo governance",
    tags: ["celo", "governance", "cgp"],
  },
  Staking: {
    id: "staking",
    name: "Celo staking",
    tags: ["celo", "staking", "validators"],
  },
  NFT: {
    id: "nft",
    name: "NFT reads",
    tags: ["celo", "nft", "erc721", "erc1155"],
  },
  Contract: {
    id: "contract-read",
    name: "Contract reads",
    tags: ["celo", "contract", "abi"],
  },
  AgentKarma: {
    id: "agentkarma-reputation",
    name: "AgentKarma reputation reads",
    tags: ["celo", "agentkarma", "reputation", "trust", "erc-8004"],
  },
};

export interface CelinaA2ASkill {
  id: string;
  name: string;
  description: string;
  tags: string[];
  tools: string[];
  examples: string[];
}

export function buildSkillsFromToolNames(toolNames: string[], categoryByName: Record<string, WebsiteToolCategory>): CelinaA2ASkill[] {
  const bySkillId = new Map<string, CelinaA2ASkill>();

  for (const toolName of toolNames) {
    const category = categoryByName[toolName] ?? "Blockchain";
    const meta = CATEGORY_TO_A2A_SKILL[category];
    const existing = bySkillId.get(meta.id);
    if (existing) {
      existing.tools.push(toolName);
      continue;
    }
    bySkillId.set(meta.id, {
      id: meta.id,
      name: meta.name,
      description: `${meta.name} on Celo mainnet. Tools: ${toolName}.`,
      tags: [...meta.tags],
      tools: [toolName],
      examples: [
        `Send a DataPart (${CELINA_TOOL_MIME}) with {"tool":"${toolName}","arguments":{...}}.`,
      ],
    });
  }

  for (const skill of bySkillId.values()) {
    skill.description = `${skill.name} on Celo mainnet. Allowed tools: ${skill.tools.join(", ")}.`;
  }

  return [...bySkillId.values()].sort((a, b) => a.id.localeCompare(b.id));
}
