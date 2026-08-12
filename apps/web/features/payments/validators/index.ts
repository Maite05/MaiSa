import type { Invoice } from "../types";
import { getBalanceRemaining } from "../services";

/** Blocks recording a payment larger than what's actually still owed. */
export function isPaymentAmountValid(invoice: Pick<Invoice, "amountDue" | "amountPaid">, amount: number): boolean {
  return amount > 0 && amount <= getBalanceRemaining(invoice) + Number.EPSILON;
}
