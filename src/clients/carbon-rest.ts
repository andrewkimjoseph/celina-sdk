import { CARBON_CHAIN, DEFAULT_CARBON_REST_BASE_URL } from "../config/carbon.js";
import type { CarbonRestSuccess } from "../types/carbon.js";

const DEFAULT_TIMEOUT_MS = 60_000;

export class CarbonRestError extends Error {
  constructor(
    message: string,
    readonly toolName: string,
    readonly statusCode?: number,
  ) {
    super(message);
    this.name = "CarbonRestError";
  }
}

export type CarbonRestBody = Record<string, unknown>;

export class CarbonRestClient {
  constructor(
    private readonly baseUrl: string = DEFAULT_CARBON_REST_BASE_URL,
    private readonly timeoutMs: number = DEFAULT_TIMEOUT_MS,
  ) {}

  private url(toolName: string): string {
    const base = this.baseUrl.replace(/\/$/, "");
    return `${base}/tools/${toolName}`;
  }

  /**
   * POST to Carbon MCP REST. Always injects `chain: celo` unless caller overrides.
   */
  async postTool<T extends CarbonRestSuccess = CarbonRestSuccess>(
    toolName: string,
    body: CarbonRestBody = {},
  ): Promise<T> {
    const payload = {
      chain: CARBON_CHAIN,
      ...body,
    };

    const response = await fetch(this.url(toolName), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(this.timeoutMs),
    });

    const text = await response.text();
    let json: Record<string, unknown>;
    try {
      json = text ? (JSON.parse(text) as Record<string, unknown>) : {};
    } catch {
      throw new CarbonRestError(
        `Carbon API returned non-JSON (${response.status})`,
        toolName,
        response.status,
      );
    }

    if (json.error && typeof json.error === "string") {
      throw new CarbonRestError(json.error, toolName, response.status);
    }

    if (json.status === "not_found") {
      const msg =
        typeof json.message === "string" ? json.message : "Carbon API not found";
      throw new CarbonRestError(msg, toolName, response.status);
    }

    if (!response.ok) {
      throw new CarbonRestError(
        `Carbon API HTTP ${response.status}`,
        toolName,
        response.status,
      );
    }

    return json as T;
  }
}
