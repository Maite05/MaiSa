import { z } from "zod";

// Mirrors apps/api/src/modules/organizations/organizations.schemas.ts field-for-field.

export const orgRoleSchema = z.enum(["OWNER", "ADMIN", "PLANNER", "MEMBER"]);

export const addMemberSchema = z.object({
  email: z.string().email("Enter a valid email"),
  role: orgRoleSchema.default("MEMBER"),
});
export type AddMemberFormValues = z.infer<typeof addMemberSchema>;

export const updateMemberRoleSchema = z.object({
  role: orgRoleSchema,
});
export type UpdateMemberRoleFormValues = z.infer<typeof updateMemberRoleSchema>;
