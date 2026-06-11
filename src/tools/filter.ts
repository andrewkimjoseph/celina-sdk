import { requireWalletParamsInInputSchema } from "./schemas/wallet-params.js";
import type { FilterToolsOptions, ToolDefinition } from "./types.js";

const CARBON_PREPARE_PREFIX = "prepare_carbon_";
const CARBON_EXECUTE_PREFIX = "execute_carbon_";
const ESTIMATE_PREFIX = "estimate_";

function requireExplicitWalletAddresses(
  definitions: ToolDefinition[],
): ToolDefinition[] {
  return definitions.map((def) => {
    const inputSchema = requireWalletParamsInInputSchema(def.inputSchema);
    if (inputSchema === def.inputSchema) {
      return def;
    }
    return { ...def, inputSchema };
  });
}

export function filterToolDefinitions(
  definitions: ToolDefinition[],
  options: FilterToolsOptions = {},
): ToolDefinition[] {
  const filtered = definitions.filter((def) => {
    if (options.surface) {
      const surfaces = def.surfaces ?? ["mcp", "browser"];
      if (!surfaces.includes(options.surface)) {
        return false;
      }
    }

    if (options.families?.length) {
      if (!options.families.some((f) => def.families.includes(f))) {
        return false;
      }
    }

    if (options.names?.length && !options.names.includes(def.name)) {
      return false;
    }

    if (def.name.startsWith(CARBON_PREPARE_PREFIX) && options.carbonPrepareEnabled === false) {
      return false;
    }

    if (def.name.startsWith(CARBON_EXECUTE_PREFIX) && options.carbonExecuteEnabled === false) {
      return false;
    }

    if (def.name.startsWith(ESTIMATE_PREFIX) && options.estimateToolsEnabled === false) {
      return false;
    }

    if (options.serverKeyToolsEnabled === false && def.requiresEnv?.length) {
      if (
        def.requiresEnv.includes("CELO_PRIVATE_KEY") ||
        def.requiresEnv.includes("SELF_AGENT_PRIVATE_KEY")
      ) {
        return false;
      }
    }

    if (
      options.selfSessionToolsEnabled === false &&
      def.requiresEnv?.includes("SELF_SESSION")
    ) {
      return false;
    }

    return true;
  });

  if (options.serverKeyToolsEnabled === false) {
    return requireExplicitWalletAddresses(filtered);
  }

  return filtered;
}
