import { z } from "zod";

import { paginationQuerySchema } from "../../lib/pagination-schema";

export const invoiceStatusSchema = z.enum(["DRAFT", "SENT", "PARTIALLY_PAID", "PAID", "OVERDUE", "CANCELLED"]);

export const createInvoiceSchema = z.object({
  status: invoiceStatusSchema.optional(),
  amountDue: z.coerce.number().positive(),
  dueDate: z.coerce.date().optional(),
});
export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>;

export const updateInvoiceSchema = z.object({
  status: invoiceStatusSchema.optional(),
  amountDue: z.coerce.number().positive().optional(),
  dueDate: z.coerce.date().optional(),
});
export type UpdateInvoiceInput = z.infer<typeof updateInvoiceSchema>;

export const listInvoicesQuerySchema = paginationQuerySchema.extend({
  status: invoiceStatusSchema.optional(),
});
export type ListInvoicesQuery = z.infer<typeof listInvoicesQuerySchema>;
