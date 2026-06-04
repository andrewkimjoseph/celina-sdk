import type { FilterToolsOptions, ToolDefinition } from "./types.js";

const CARBON_PREPARE_PREFIX = "prepare_carbon_";
const CARBON_EXECUTE_PREFIX = "execute_carbon_";

export function filterToolDefinitions(
  definitions: ToolDefinition[],
  options: FilterToolsOptions = {},
): ToolDefinition[] {
  return definitions.filter((def) => {
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

    return true;
  });
}
