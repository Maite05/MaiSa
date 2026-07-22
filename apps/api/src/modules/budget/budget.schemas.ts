import { z } from "zod";

import { paginationQuerySchema } from "../../lib/pagination-schema";

export const createBudgetItemSchema = z.object({
  category: z.string().min(1).max(120),
  description: z.string().max(2000).optional(),
  estimatedCost: z.coerce.number().nonnegative(),
  actualCost: z.coerce.number().nonnegative().optional(),
});
export type CreateBudgetItemInput = z.infer<typeof createBudgetItemSchema>;

export const updateBudgetItemSchema = createBudgetItemSchema.partial();
export type UpdateBudgetItemInput = z.infer<typeof updateBudgetItemSchema>;

export const listBudgetItemsQuerySchema = paginationQuerySchema;
export type ListBudgetItemsQuery = z.infer<typeof listBudgetItemsQuerySchema>;
