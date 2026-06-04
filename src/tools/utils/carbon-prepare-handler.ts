import type { CarbonWriteBody } from "../../services/carbon.service.js";
import { finalizeCarbonPrepare } from "../../utils/finalize-carbon-prepare.js";
import type { ToolRuntime } from "../types.js";
import { resolveWalletFromRuntime } from "./wallet.js";

export async function runCarbonPrepare(
  runtime: ToolRuntime,
  toolName: string,
  prepareFn: (body: CarbonWriteBody) => Promise<unknown>,
  input: Record<string, unknown>,
  options?: { marketPriceFallback?: boolean; concentrated?: boolean },
): Promise<unknown> {
  const sender = resolveWalletFromRuntime(runtime, {
    wallet_address: input.wallet_address as string | undefined,
    from: input.from as string | undefined,
  });
  const body = { ...input, wallet_address: sender } as CarbonWriteBody;

  if (runtime.hooks?.carbon?.prepare) {
    return runtime.hooks.carbon.prepare(toolName, sender, prepareFn, body, options);
  }

  runtime.hooks?.carbon?.validateBody?.(toolName, body);
  const prepared = await prepareFn(body);
  const preparedFlow = await finalizeCarbonPrepare(
    runtime.celina.carbon,
    sender,
    prepared as Parameters<typeof finalizeCarbonPrepare>[2],
    body,
  );
  return { ...(prepared as object), preparedFlow };
}
