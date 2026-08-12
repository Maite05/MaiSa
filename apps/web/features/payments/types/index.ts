// Mirrors packages/database/prisma/schema.prisma's Invoice + Payment models.
// amountDue/amountPaid/amount are Prisma Decimal -> serialized as strings.
export type InvoiceStatus = "DRAFT" | "SENT" | "PARTIALLY_PAID" | "PAID" | "OVERDUE" | "CANCELLED";

export interface Invoice {
  id: string;
  eventId: string;
  status: InvoiceStatus;
  amountDue: string;
  amountPaid: string;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  invoiceId: string;
  amount: string;
  method: string | null;
  paidAt: string;
  externalRef: string | null;
}
