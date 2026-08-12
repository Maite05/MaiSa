import { z } from "zod";

// Mirrors apps/api/src/modules/organizations/organizations.schemas.ts updateOrganizationSchema.
export const updateOrganizationSchema = z.object({
  name: z.string().min(1, "Name is required").max(120),
});
export type UpdateOrganizationFormValues = z.infer<typeof updateOrganizationSchema>;
