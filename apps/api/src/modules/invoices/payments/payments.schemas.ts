import { z } from "zod";

import { paginationQuerySchema } from "../../../lib/pagination-schema";

export const createPaymentSchema = z.object({
  amount: z.coerce.number().positive(),
  method: z.string().max(100).optional(),
  paidAt: z.coerce.date().optional(),
  externalRef: z.string().max(200).optional(),
});
export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;

export const listPaymentsQuerySchema = paginationQuerySchema;
export type ListPaymentsQuery = z.infer<typeof listPaymentsQuerySchema>;

export const invoiceParamsSchema = z.object({
  eventId: z.string().cuid(),
  invoiceId: z.string().cuid(),
});

export const paymentItemParamsSchema = z.object({
  eventId: z.string().cuid(),
  invoiceId: z.string().cuid(),
  id: z.string().cuid(),
});
