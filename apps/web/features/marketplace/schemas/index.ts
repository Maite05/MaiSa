import { z } from "zod";

export const marketplaceListingFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  vendorName: z.string().min(1, "Vendor name is required").max(200),
  price: z.coerce.number().nonnegative(),
  category: z.string().min(1, "Category is required").max(120),
});
export type MarketplaceListingFormValues = z.infer<typeof marketplaceListingFormSchema>;
