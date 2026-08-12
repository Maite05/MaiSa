import { z } from "zod";

// Mirrors apps/api/src/modules/auth/auth.schemas.ts field-for-field — keep
// these two in sync if the backend contract changes.

export const signupSchema = z.object({
  name: z.string().min(1, "Name is required").max(120),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Must be at least 8 characters").max(200),
  organizationName: z.string().min(1, "Organization name is required").max(120),
});
export type SignupFormValues = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});
export type LoginFormValues = z.infer<typeof loginSchema>;
