import type { PreparedTx } from "../types/prepared.js";
import type { TokenService } from "../services/token.service.js";

const GENERIC_CARBON_STEP = /^Carbon transaction step \d+$/;

export type CarbonStepLabelContext = {
  summary: string;
  orderMeta: Record<string, unknown>;
  strategyPreview?: unknown;
  tokenService: TokenService;
};

type StrategyPreview = {
  type?: string;
  direction?: string;
  price?: number;
  budget?: number | string;
};

function readRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : {};
}

function readPositive(value: unknown): number | null {
  if (value === undefined || value === null || value === "") {
    return null;
  }
  const n = typeof value === "number" ? value : Number(String(value).replace(/,/g, ""));
  return Number.isFinite(n) && n > 0 ? n : null;
}

function resolveSymbol(tokenService: TokenService, token: unknown): string {
  if (token === undefined || token === null || token === "") {
    return "?";
  }
  try {
    return tokenService.resolveToken(String(token)).symbol;
  } catch {
    return String(token).trim();
  }
}

function formatAmount(value: number): string {
  if (value >= 1) {
    return value.toLocaleString(undefined, { maximumFractionDigits: 4 });
  }
  return value.toLocaleString(undefined, { maximumFractionDigits: 6 });
}

function pairLabel(ctx: CarbonStepLabelContext): string {
  const meta = ctx.orderMeta;
  const base = resolveSymbol(ctx.tokenService, meta.base_token ?? meta.base);
  const quote = resolveSymbol(ctx.tokenService, meta.quote_token ?? meta.quote);
  return `${base} / ${quote}`;
}

function directionFrom(ctx: CarbonStepLabelContext): "buy" | "sell" {
  const meta = ctx.orderMeta;
  const preview = readRecord(ctx.strategyPreview) as StrategyPreview;
  const raw = String(preview.direction ?? meta.direction ?? "buy").toLowerCase();
  return raw === "sell" ? "sell" : "buy";
}

function budgetLabel(ctx: CarbonStepLabelContext): string | null {
  const meta = ctx.orderMeta;
  const preview = readRecord(ctx.strategyPreview) as StrategyPreview;
  const direction = directionFrom(ctx);

  const amount =
    readPositive(preview.budget) ??
    readPositive(meta.budget) ??
    (direction === "sell"
      ? readPositive(meta.sell_budget)
      : readPositive(meta.buy_budget));

  if (amount === null) {
    return null;
  }

  const token =
    direction === "sell"
      ? resolveSymbol(ctx.tokenService, meta.base_token ?? meta.base)
      : resolveSymbol(ctx.tokenService, meta.quote_token ?? meta.quote);

  return `${formatAmount(amount)} ${token}`;
}

function actionFromSummary(summary: string): string | null {
  const normalized = summary.trim().toLowerCase();
  if (normalized.includes("limit order")) return "limit";
  if (normalized.includes("range order")) return "range";
  if (normalized.includes("recurring strategy")) return "recurring";
  if (normalized.includes("concentrated strategy")) return "concentrated";
  if (normalized.includes("full-range strategy")) return "full-range";
  if (normalized.includes("reprice strategy")) return "reprice";
  if (normalized.includes("edit strategy")) return "edit";
  if (normalized.includes("deposit budget")) return "deposit";
  if (normalized.includes("withdraw budget")) return "withdraw";
  if (normalized.includes("pause strategy")) return "pause";
  if (normalized.includes("resume strategy")) return "resume";
  if (normalized.includes("delete strategy")) return "delete";
  if (normalized.includes("taker swap")) return "swap";
  return null;
}

function actionFromPreview(preview: StrategyPreview): string | null {
  const type = String(preview.type ?? "").toLowerCase();
  if (type.includes("limit")) return "limit";
  if (type.includes("range")) return "range";
  if (type.includes("recurring")) return "recurring";
  if (type.includes("concentrated")) return "concentrated";
  if (type.includes("full")) return "full-range";
  return null;
}

function createActionLabel(ctx: CarbonStepLabelContext): string {
  const preview = readRecord(ctx.strategyPreview) as StrategyPreview;
  const action =
    actionFromPreview(preview) ?? actionFromSummary(ctx.summary) ?? "strategy";
  const direction = directionFrom(ctx);
  const pair = pairLabel(ctx);
  const budget = budgetLabel(ctx);

  if (action === "swap") {
    return "Swap via Carbon DeFi";
  }

  if (action === "reprice") return "Reprice Carbon strategy";
  if (action === "edit") return "Edit Carbon strategy";
  if (action === "deposit") return "Deposit to Carbon strategy";
  if (action === "withdraw") return "Withdraw from Carbon strategy";
  if (action === "pause") return "Pause Carbon strategy";
  if (action === "resume") return "Resume Carbon strategy";
  if (action === "delete") return "Close Carbon strategy";

  if (action === "recurring") {
    return budget
      ? `Create recurring strategy — ${budget} on ${pair}`
      : `Create recurring strategy — ${pair}`;
  }

  if (action === "concentrated" || action === "full-range") {
    const kind = action === "concentrated" ? "concentrated" : "full-range";
    return budget
      ? `Create ${kind} strategy — ${budget} on ${pair}`
      : `Create ${kind} strategy — ${pair}`;
  }

  const side = action === "range" ? "range" : "limit";
  const sideLabel = `${side} ${direction}`;
  return budget
    ? `Create ${sideLabel} — ${budget} on ${pair}`
    : `Create ${sideLabel} on ${pair}`;
}

/** Human-readable label for a Carbon controller transaction step. */
export function describeCarbonControllerStep(
  ctx: CarbonStepLabelContext,
  index: number,
  total: number,
): string {
  const base = createActionLabel(ctx);
  if (total <= 1) {
    return base;
  }
  return `${base} (step ${index + 1} of ${total})`;
}

function isApprovalStep(step: PreparedTx): boolean {
  return (
    step.kind === "erc20" ||
    step.description.startsWith("Approve ")
  );
}

function isGenericCarbonStep(step: PreparedTx): boolean {
  return GENERIC_CARBON_STEP.test(step.description);
}

/** Replace generic Carbon REST step descriptions with human-readable labels. */
export function applyCarbonStepLabels(
  steps: PreparedTx[],
  ctx: CarbonStepLabelContext,
): PreparedTx[] {
  const controllerIndexes = steps
    .map((step, index) => ({ step, index }))
    .filter(({ step }) => !isApprovalStep(step) && isGenericCarbonStep(step));

  if (controllerIndexes.length === 0) {
    return steps;
  }

  const total = controllerIndexes.length;
  const labels = new Map<number, string>();

  controllerIndexes.forEach(({ index }, controllerIndex) => {
    labels.set(index, describeCarbonControllerStep(ctx, controllerIndex, total));
  });

  return steps.map((step, index) => {
    const label = labels.get(index);
    if (!label) {
      return step;
    }
    return { ...step, description: label };
  });
}
