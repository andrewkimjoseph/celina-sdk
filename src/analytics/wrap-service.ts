import type { SdkConfig } from "../config/sdk-config.js";
import { isAnalyticsEnabled } from "./config.js";
import { trackMcpTool } from "./events-stats.js";
import { MCP_TOOL_EVENT_BY_SDK_METHOD } from "./mcp-tool-events.js";

/**
 * Catalog ids sometimes include a variant suffix (`gooddollar.getReserveQuote.sell`).
 * SDK wrappers look up `service.method` (`gooddollar.getReserveQuote`). Collapse those
 * suffixes so a direct SDK call still maps to the same MCP tool event.
 */
function eventNameForSdkMethod(methodKey: string): string | undefined {
  const exact = MCP_TOOL_EVENT_BY_SDK_METHOD[methodKey];
  if (exact) return exact;
  const prefix = `${methodKey}.`;
  for (const [id, eventName] of Object.entries(MCP_TOOL_EVENT_BY_SDK_METHOD)) {
    if (id.startsWith(prefix)) return eventName;
  }
  return undefined;
}

/**
 * Wrap a domain service so catalog-mapped async reads report usage events (MCP tool names)
 * to celina-stats-api.
 */
export function wrapServiceForAnalytics<T extends object>(
  serviceKey: string,
  service: T,
  config: SdkConfig,
): T {
  if (!isAnalyticsEnabled(config)) {
    return service;
  }

  return new Proxy(service, {
    get(target, prop, receiver) {
      const value = Reflect.get(target, prop, receiver);
      if (typeof prop !== "string" || typeof value !== "function") {
        return value;
      }

      const methodKey = `${serviceKey}.${prop}`;
      const eventName = eventNameForSdkMethod(methodKey);
      if (!eventName) {
        return value.bind(target);
      }

      const fn = value as (...args: unknown[]) => unknown;
      return (...args: unknown[]) => {
        const result = fn.apply(target, args);
        const context = { methodKey, args };
        if (result !== null && typeof result === "object" && "then" in result) {
          return (result as Promise<unknown>).then((resolved) => {
            void trackMcpTool(eventName, config, context);
            return resolved;
          });
        }
        void trackMcpTool(eventName, config, context);
        return result;
      };
    },
  });
}
