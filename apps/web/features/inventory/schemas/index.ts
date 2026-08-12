import { z } from "zod";

export const inventoryItemFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  sku: z.string().min(1, "SKU is required").max(60),
  quantity: z.coerce.number().int().nonnegative(),
  location: z.string().max(200).optional().or(z.literal("")),
});
export type InventoryItemFormValues = z.infer<typeof inventoryItemFormSchema>;
