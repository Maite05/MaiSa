import { z } from "zod";

// Mirrors apps/api/src/modules/guests/guests.schemas.ts field-for-field.

export const rsvpStatusSchema = z.enum(["PENDING", "ATTENDING", "DECLINED", "MAYBE"]);

export const createGuestSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  email: z.string().email("Enter a valid email").optional().or(z.literal("")),
  phone: z.string().max(40).optional().or(z.literal("")),
  rsvpStatus: rsvpStatusSchema.optional(),
  plusOnes: z.coerce.number().int().nonnegative().optional(),
  tableNumber: z.string().max(40).optional().or(z.literal("")),
  dietaryNotes: z.string().max(2000).optional().or(z.literal("")),
});
export type CreateGuestFormValues = z.infer<typeof createGuestSchema>;

export const updateGuestSchema = createGuestSchema.partial();
export type UpdateGuestFormValues = z.infer<typeof updateGuestSchema>;

export const listGuestsQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
  rsvpStatus: rsvpStatusSchema.optional(),
});
export type ListGuestsQuery = z.infer<typeof listGuestsQuerySchema>;
