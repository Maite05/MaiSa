import type { BudgetItem } from "../types";
import { parseDecimal } from "../../../lib/format";

/** Flags a line item that's run over its estimate — used to highlight rows red in the table. */
export function isOverBudget(item: Pick<BudgetItem, "estimatedCost" | "actualCost">): boolean {
  if (item.actualCost === null) return false;
  return parseDecimal(item.actualCost) > parseDecimal(item.estimatedCost);
}
