import { allDomainToolDefinitions } from "./domains/index.js";
import { filterToolDefinitions } from "./filter.js";
import type { FilterToolsOptions, ToolDefinition, ToolFamily } from "./types.js";

export const ALL_TOOL_DEFINITIONS: ToolDefinition[] = allDomainToolDefinitions;

export function getToolNames(options: FilterToolsOptions = {}): string[] {
  return filterToolDefinitions(ALL_TOOL_DEFINITIONS, options).map((d) => d.name);
}

export function getMcpToolNames(
  options: Omit<FilterToolsOptions, "surface"> = {},
): string[] {
  return getToolNames({ ...options, surface: "mcp" });
}

export function getBrowserToolNames(
  options: Omit<FilterToolsOptions, "surface"> = {},
): string[] {
  return getToolNames({ ...options, surface: "browser" });
}

export function getToolsByFamily(family: ToolFamily): ToolDefinition[] {
  return filterToolDefinitions(ALL_TOOL_DEFINITIONS, { families: [family] });
}

export function getToolDefinition(name: string): ToolDefinition | undefined {
  return ALL_TOOL_DEFINITIONS.find((d) => d.name === name);
}

export function assertSnakeCaseInputKeys(definition: ToolDefinition): void {
  const shape = definition.inputSchema;
  if (!shape || typeof shape !== "object" || !("shape" in shape)) {
    return;
  }
  const keys = Object.keys((shape as { shape: Record<string, unknown> }).shape);
  for (const key of keys) {
    if (key !== key.toLowerCase() || key.includes("-")) {
      throw new Error(
        `Tool "${definition.name}" input key "${key}" must be snake_case.`,
      );
    }
  }
}

export function validateToolCatalogSnakeCase(): void {
  for (const def of ALL_TOOL_DEFINITIONS) {
    assertSnakeCaseInputKeys(def);
  }
}
