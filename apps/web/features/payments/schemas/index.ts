import { z } from "zod";

// Mirrors apps/api/src/modules/invoices/invoices.schemas.ts and
// .../invoices/payments/payments.schemas.ts field-for-field.

export const invoiceStatusSchema = z.enum(["DRAFT", "SENT", "PARTIALLY_PAID", "PAID", "OVERDUE", "CANCELLED"]);

export const createInvoiceSchema = z.object({
  status: invoiceStatusSchema.optional(),
  amountDue: z.coerce.number().positive("Must be greater than 0"),
  dueDate: z.string().optional().or(z.literal("")),
});
export type CreateInvoiceFormValues = z.infer<typeof createInvoiceSchema>;

export const updateInvoiceSchema = z.object({
  status: invoiceStatusSchema.optional(),
  amountDue: z.coerce.number().positive().optional(),
  dueDate: z.string().optional().or(z.literal("")),
});
export type UpdateInvoiceFormValues = z.infer<typeof updateInvoiceSchema>;

export const listInvoicesQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
  status: invoiceStatusSchema.optional(),
});
export type ListInvoicesQuery = z.infer<typeof listInvoicesQuerySchema>;

export const createPaymentSchema = z.object({
  amount: z.coerce.number().positive("Must be greater than 0"),
  method: z.string().max(100).optional().or(z.literal("")),
  paidAt: z.string().optional().or(z.literal("")),
  externalRef: z.string().max(200).optional().or(z.literal("")),
});
export type CreatePaymentFormValues = z.infer<typeof createPaymentSchema>;
