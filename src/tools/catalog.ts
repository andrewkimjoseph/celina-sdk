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

const SNAKE_CASE_KEY = /^[a-z][a-z0-9]*(_[a-z0-9]+)*$/;

export function assertSnakeCaseRecordKeys(label: string, keys: string[]): void {
  for (const key of keys) {
    if (!SNAKE_CASE_KEY.test(key)) {
      throw new Error(
        `${label}: key "${key}" must be snake_case (lowercase letters, digits, underscores).`,
      );
    }
  }
}

export function getToolInputSchemaShape(
  definition: ToolDefinition,
): Record<string, unknown> | undefined {
  const shape = definition.inputSchema;
  if (!shape || typeof shape !== "object" || !("shape" in shape)) {
    return undefined;
  }
  return (shape as { shape: Record<string, unknown> }).shape;
}

export function assertSnakeCaseInputKeys(definition: ToolDefinition): void {
  const keys = Object.keys(getToolInputSchemaShape(definition) ?? {});
  assertSnakeCaseRecordKeys(`Tool "${definition.name}" input`, keys);
}

export function validateToolCatalogSnakeCase(): void {
  for (const def of ALL_TOOL_DEFINITIONS) {
    assertSnakeCaseInputKeys(def);
  }
}
