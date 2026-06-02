#!/usr/bin/env node
/**
 * Regenerates the API reference section of docs/SUMMARY.md from TypeDoc output.
 * Run after `npm run docs:api`.
 */
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const DOCS_DIR = join(import.meta.dirname, "..", "docs");
const SUMMARY_PATH = join(DOCS_DIR, "SUMMARY.md");

const MARKER_START = "## API reference";
const MARKER_END = "## Publishing";

/** Curated API navigation — paths relative to docs/api-reference/ */
const API_LINKS = [
  { title: "Overview", path: "README.md" },
  { title: "createCelinaClient", path: "index/functions/createCelinaClient.md" },
  { title: "CelinaClient", path: "index/interfaces/CelinaClient.md" },
  { title: "SdkConfig", path: "index/interfaces/SdkConfig.md" },
  { title: "CelinaClientOptions", path: "index/type-aliases/CelinaClientOptions.md" },
];

const SERVICE_LINKS = [
  { title: "AccountService", path: "services/account.service/classes/AccountService.md" },
  { title: "AaveService", path: "services/aave.service/classes/AaveService.md" },
  { title: "BlockchainService", path: "services/blockchain.service/classes/BlockchainService.md" },
  { title: "CarbonService", path: "services/carbon.service/classes/CarbonService.md" },
  { title: "ContractService", path: "services/contract.service/classes/ContractService.md" },
  { title: "EnsService", path: "services/ens.service/classes/EnsService.md" },
  { title: "GoodDollarService", path: "services/gooddollar.service/classes/GoodDollarService.md" },
  { title: "GovernanceService", path: "services/governance.service/classes/GovernanceService.md" },
  { title: "MentoFxService", path: "services/mento-fx.service/classes/MentoFxService.md" },
  { title: "UniswapService", path: "services/uniswap.service/classes/UniswapService.md" },
  { title: "NftService", path: "services/nft.service/classes/NftService.md" },
  { title: "StakingService", path: "services/staking.service/classes/StakingService.md" },
  { title: "TokenService", path: "services/token.service/classes/TokenService.md" },
  { title: "TransactionService", path: "services/transaction.service/classes/TransactionService.md" },
];

const TYPE_LINKS = [
  { title: "PreparedTx", path: "types/prepared/interfaces/PreparedTx.md" },
  { title: "PreparedFlow", path: "types/prepared/interfaces/PreparedFlow.md" },
  { title: "SerializedPreparedFlow", path: "types/prepared/interfaces/SerializedPreparedFlow.md" },
  { title: "PreparedTxKind", path: "types/prepared/type-aliases/PreparedTxKind.md" },
  { title: "serializePreparedFlow", path: "types/prepared/functions/serializePreparedFlow.md" },
  { title: "MentoFxParams", path: "services/mento-fx.service/interfaces/MentoFxParams.md" },
  { title: "UniswapSwapParams", path: "services/uniswap.service/interfaces/UniswapSwapParams.md" },
  { title: "ResolvedToken", path: "services/token.service/interfaces/ResolvedToken.md" },
  { title: "GovernanceProposalsOptions", path: "services/governance.service/interfaces/GovernanceProposalsOptions.md" },
  { title: "ContractCallParams", path: "services/contract.service/interfaces/ContractCallParams.md" },
  { title: "CarbonPrepareResult", path: "index/interfaces/CarbonPrepareResult.md" },
  { title: "finalizeCarbonPrepare", path: "index/functions/finalizeCarbonPrepare.md" },
  { title: "FinalizedCarbonPrepareFlow", path: "index/type-aliases/FinalizedCarbonPrepareFlow.md" },
  { title: "appendCelinaCalldataTag", path: "index/functions/appendCelinaCalldataTag.md" },
  { title: "CELINA_DATA_SUFFIX", path: "index/variables/CELINA_DATA_SUFFIX.md" },
  { title: "buildCarbonExecutionSteps", path: "index/functions/buildCarbonExecutionSteps.md" },
  { title: "carbonActivityDeepLink", path: "index/functions/carbonActivityDeepLink.md" },
];

function link({ title, path }) {
  return `* [${title}](api-reference/${path})`;
}

async function main() {
  const apiSection = [
    MARKER_START,
    "",
    ...API_LINKS.map(link),
    "",
    "### Services",
    "",
    ...SERVICE_LINKS.map(link),
    "",
    "### Types",
    "",
    ...TYPE_LINKS.map(link),
    "",
  ].join("\n");

  const summary = await readFile(SUMMARY_PATH, "utf8");
  const startIdx = summary.indexOf(MARKER_START);
  const endIdx = summary.indexOf(MARKER_END);

  if (startIdx === -1 || endIdx === -1) {
    throw new Error(`Could not find ${MARKER_START} or ${MARKER_END} in SUMMARY.md`);
  }

  const updated = summary.slice(0, startIdx) + apiSection + summary.slice(endIdx);
  await writeFile(SUMMARY_PATH, updated);
  console.log(`Updated ${SUMMARY_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
