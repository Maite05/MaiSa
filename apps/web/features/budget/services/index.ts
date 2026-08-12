import { parseDecimal } from "../../../lib/format";
import type { BudgetItem } from "../types";

export interface BudgetTotals {
  estimated: number;
  actual: number;
  remaining: number;
  categories: Array<{ category: string; estimated: number; actual: number }>;
}

/** Powers the event overview's "$X spent of $Y allocated" + per-category breakdown. */
export function summarizeBudget(items: BudgetItem[]): BudgetTotals {
  const byCategory = new Map<string, { estimated: number; actual: number }>();

  for (const item of items) {
    const estimated = parseDecimal(item.estimatedCost);
    const actual = parseDecimal(item.actualCost);
    const existing = byCategory.get(item.category) ?? { estimated: 0, actual: 0 };
    byCategory.set(item.category, { estimated: existing.estimated + estimated, actual: existing.actual + actual });
  }

  const totals = Array.from(byCategory.values()).reduce(
    (acc, c) => ({ estimated: acc.estimated + c.estimated, actual: acc.actual + c.actual }),
    { estimated: 0, actual: 0 },
  );

  return {
    estimated: totals.estimated,
    actual: totals.actual,
    remaining: totals.estimated - totals.actual,
    categories: Array.from(byCategory.entries()).map(([category, v]) => ({ category, ...v })),
  };
}
