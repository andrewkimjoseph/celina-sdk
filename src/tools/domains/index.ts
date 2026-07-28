import { aaveToolDefinitions } from "./aave.js";
import { agentKarmaToolDefinitions } from "./agentkarma.js";
import { blockchainToolDefinitions } from "./blockchain.js";
import { browserToolDefinitions } from "./browser.js";
import { contractToolDefinitions } from "./contract.js";
import { ensToolDefinitions } from "./ens.js";
import { gooddollarToolDefinitions } from "./gooddollar.js";
import { governanceToolDefinitions } from "./governance.js";
import { humannessToolDefinitions } from "./humanness.js";
import { mentoFxToolDefinitions } from "./mento-fx.js";
import { nftToolDefinitions } from "./nft.js";
import { selfToolDefinitions } from "./self.js";
import { stakingToolDefinitions } from "./staking.js";
import { tokenToolDefinitions } from "./token.js";
import { transactionToolDefinitions } from "./transaction.js";
import { uniswapToolDefinitions } from "./uniswap.js";

export const allDomainToolDefinitions = [
  ...blockchainToolDefinitions,
  ...tokenToolDefinitions,
  ...transactionToolDefinitions,
  ...mentoFxToolDefinitions,
  ...uniswapToolDefinitions,
  ...aaveToolDefinitions,
  ...ensToolDefinitions,
  ...gooddollarToolDefinitions,
  ...governanceToolDefinitions,
  ...humannessToolDefinitions,
  ...stakingToolDefinitions,
  ...nftToolDefinitions,
  ...contractToolDefinitions,
  ...selfToolDefinitions,
  ...agentKarmaToolDefinitions,
  ...browserToolDefinitions,
];
