import { z } from "zod";

// Mirrors apps/api/src/modules/contracts/contracts.schemas.ts field-for-field.

export const contractStatusSchema = z.enum(["DRAFT", "SENT", "SIGNED", "VOID"]);

export const createContractSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  status: contractStatusSchema.optional(),
  documentUrl: z.string().url("Enter a valid URL").optional().or(z.literal("")),
  signedAt: z.string().optional().or(z.literal("")),
});
export type CreateContractFormValues = z.infer<typeof createContractSchema>;

export const updateContractSchema = createContractSchema.partial();
export type UpdateContractFormValues = z.infer<typeof updateContractSchema>;

export const listContractsQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
  status: contractStatusSchema.optional(),
});
export type ListContractsQuery = z.infer<typeof listContractsQuerySchema>;
