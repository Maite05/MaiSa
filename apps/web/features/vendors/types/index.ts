// No apps/api module exists for vendors yet — this shape is a reasonable
// placeholder pending a real Vendor model in packages/database/prisma.
export type VendorCategory = "Catering" | "Photography" | "Florals" | "Venue" | "Entertainment" | "Other";
export type PriceRange = "$" | "$$" | "$$$" | "$$$$";

export interface Vendor {
  id: string;
  name: string;
  category: VendorCategory;
  contactEmail: string;
  priceRange: PriceRange;
  /** 1-5, optional until reviews exist */
  rating?: number;
}
