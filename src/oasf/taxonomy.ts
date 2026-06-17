/**
 * OASF v0.8.0 taxonomy slugs for Celina (hosted read-only Celo agent).
 * IDs verified against https://schema.oasf.outshift.com/0.8.0/api/skill_categories
 * and https://schema.oasf.outshift.com/0.8.0/api/domain_categories
 */

export const CELINA_OASF_VERSION = "0.8.0";
export const OASF_REPO_ENDPOINT = "https://github.com/agntcy/oasf/";
export const CELINA_OASF_SCHEMA_VERSION = "1.0.0";

export interface OasfTaxonomyEntry {
  name: string;
  id: number;
}

/** EIP-8004 OASF service + hosted manifest skills */
export const CELINA_OASF_SKILLS: readonly OasfTaxonomyEntry[] = [
  {
    name: "natural_language_processing/information_retrieval_synthesis/information_retrieval_synthesis_search",
    id: 10306,
  },
  {
    name: "natural_language_processing/information_retrieval_synthesis/fact_extraction",
    id: 10301,
  },
  {
    name: "natural_language_processing/analytical_reasoning/fact_verification",
    id: 10703,
  },
  { name: "tool_interaction/api_schema_understanding", id: 1401 },
  { name: "tool_interaction/tool_use_planning", id: 1403 },
  { name: "governance_compliance/compliance_assessment", id: 1302 },
];

export const CELINA_OASF_DOMAINS: readonly OasfTaxonomyEntry[] = [
  { name: "technology/blockchain", id: 109 },
  { name: "technology/blockchain/cryptocurrency", id: 10901 },
  { name: "technology/blockchain/defi", id: 10902 },
  { name: "technology/blockchain/smart_contracts", id: 10903 },
  { name: "finance_and_business/investment_services", id: 203 },
];

export function celinaOasfSkillSlugs(): string[] {
  return CELINA_OASF_SKILLS.map((entry) => entry.name);
}

export function celinaOasfDomainSlugs(): string[] {
  return CELINA_OASF_DOMAINS.map((entry) => entry.name);
}

export function celinaOasfSkillsCsv(): string {
  return celinaOasfSkillSlugs().join(", ");
}

export function celinaOasfDomainsCsv(): string {
  return celinaOasfDomainSlugs().join(", ");
}
