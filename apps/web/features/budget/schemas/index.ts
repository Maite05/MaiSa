import { z } from "zod";

// Mirrors apps/api/src/modules/budget/budget.schemas.ts field-for-field.

export const createBudgetItemSchema = z.object({
  category: z.string().min(1, "Category is required").max(120),
  description: z.string().max(2000).optional().or(z.literal("")),
  estimatedCost: z.coerce.number().nonnegative("Must be 0 or more"),
  actualCost: z.coerce.number().nonnegative().optional(),
});
export type CreateBudgetItemFormValues = z.infer<typeof createBudgetItemSchema>;

export const updateBudgetItemSchema = createBudgetItemSchema.partial();
export type UpdateBudgetItemFormValues = z.infer<typeof updateBudgetItemSchema>;

export const listBudgetItemsQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
});
export type ListBudgetItemsQuery = z.infer<typeof listBudgetItemsQuerySchema>;
