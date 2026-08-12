import { StatusPill } from "@maisa/ui";
import { getInvoiceStatusLabel, getInvoiceStatusTone } from "../services";
import type { InvoiceStatus } from "../types";

export function InvoiceStatusPill({ status }: { status: InvoiceStatus }) {
  return <StatusPill label={getInvoiceStatusLabel(status)} tone={getInvoiceStatusTone(status)} />;
}

export default InvoiceStatusPill;
