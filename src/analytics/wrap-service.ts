import type { SdkConfig } from "../config/sdk-config.js";
import { trackMcpTool } from "./amplitude.js";
import { isAnalyticsEnabled } from "./config.js";
import { MCP_TOOL_EVENT_BY_SDK_METHOD } from "./mcp-tool-events.js";

/**
 * Wrap a domain service so catalog-mapped async reads emit Amplitude events (MCP tool names).
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
      const eventName = MCP_TOOL_EVENT_BY_SDK_METHOD[methodKey];
      if (!eventName) {
        return value.bind(target);
      }

      const fn = value as (...args: unknown[]) => unknown;
      return (...args: unknown[]) => {
        const result = fn.apply(target, args);
        const context = { methodKey, args };
        if (result !== null && typeof result === "object" && "then" in result) {
          return (result as Promise<unknown>).then(async (resolved) => {
            await trackMcpTool(eventName, config, context);
            return resolved;
          });
        }
        void trackMcpTool(eventName, config, context);
        return result;
      };
    },
  });
}
