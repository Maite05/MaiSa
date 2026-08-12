import { z } from "zod";

export const vendorCategorySchema = z.enum(["Catering", "Photography", "Florals", "Venue", "Entertainment", "Other"]);
export const priceRangeSchema = z.enum(["$", "$$", "$$$", "$$$$"]);

export const vendorFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  category: vendorCategorySchema,
  contactEmail: z.string().email("Enter a valid email"),
  priceRange: priceRangeSchema,
  rating: z.coerce.number().min(1).max(5).optional(),
});
export type VendorFormValues = z.infer<typeof vendorFormSchema>;
