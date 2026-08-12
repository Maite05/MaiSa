import type { StatusTone } from "@maisa/ui";
import { parseDecimal } from "../../../lib/format";
import type { Invoice, InvoiceStatus } from "../types";

const STATUS_LABEL: Record<InvoiceStatus, string> = {
  DRAFT: "Draft",
  SENT: "Sent",
  PARTIALLY_PAID: "Partially Paid",
  PAID: "Paid",
  OVERDUE: "Overdue",
  CANCELLED: "Cancelled",
};

const STATUS_TONE: Record<InvoiceStatus, StatusTone> = {
  DRAFT: "neutral",
  SENT: "warning",
  PARTIALLY_PAID: "warning",
  PAID: "success",
  OVERDUE: "danger",
  CANCELLED: "danger",
};

export function getInvoiceStatusLabel(status: InvoiceStatus): string {
  return STATUS_LABEL[status];
}

export function getInvoiceStatusTone(status: InvoiceStatus): StatusTone {
  return STATUS_TONE[status];
}

export function getBalanceRemaining(invoice: Pick<Invoice, "amountDue" | "amountPaid">): number {
  return parseDecimal(invoice.amountDue) - parseDecimal(invoice.amountPaid);
}
