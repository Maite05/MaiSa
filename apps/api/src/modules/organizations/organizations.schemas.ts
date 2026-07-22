import { z } from "zod";

export const createOrganizationSchema = z.object({
  name: z.string().min(1).max(120),
});
export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>;

export const updateOrganizationSchema = z.object({
  name: z.string().min(1).max(120),
});
export type UpdateOrganizationInput = z.infer<typeof updateOrganizationSchema>;

export const orgRoleSchema = z.enum(["OWNER", "ADMIN", "PLANNER", "MEMBER"]);

export const addMemberSchema = z.object({
  email: z.string().email(),
  role: orgRoleSchema.default("MEMBER"),
});
export type AddMemberInput = z.infer<typeof addMemberSchema>;

export const updateMemberRoleSchema = z.object({
  role: orgRoleSchema,
});
export type UpdateMemberRoleInput = z.infer<typeof updateMemberRoleSchema>;

export const organizationIdParamsSchema = z.object({
  id: z.string().cuid(),
});

export const memberParamsSchema = z.object({
  userId: z.string().cuid(),
});
