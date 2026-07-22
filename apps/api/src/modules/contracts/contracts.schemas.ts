import { z } from "zod";

import { paginationQuerySchema } from "../../lib/pagination-schema";

export const contractStatusSchema = z.enum(["DRAFT", "SENT", "SIGNED", "VOID"]);

export const createContractSchema = z.object({
  title: z.string().min(1).max(200),
  status: contractStatusSchema.optional(),
  documentUrl: z.string().url().optional(),
  signedAt: z.coerce.date().optional(),
});
export type CreateContractInput = z.infer<typeof createContractSchema>;

export const updateContractSchema = createContractSchema.partial();
export type UpdateContractInput = z.infer<typeof updateContractSchema>;

export const listContractsQuerySchema = paginationQuerySchema.extend({
  status: contractStatusSchema.optional(),
});
export type ListContractsQuery = z.infer<typeof listContractsQuerySchema>;
