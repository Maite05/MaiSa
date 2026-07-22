import { z } from "zod";

import { paginationQuerySchema } from "../../lib/pagination-schema";

export const rsvpStatusSchema = z.enum(["PENDING", "ATTENDING", "DECLINED", "MAYBE"]);

export const createGuestSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().optional(),
  phone: z.string().max(40).optional(),
  rsvpStatus: rsvpStatusSchema.optional(),
  plusOnes: z.coerce.number().int().nonnegative().optional(),
  tableNumber: z.string().max(40).optional(),
  dietaryNotes: z.string().max(2000).optional(),
});
export type CreateGuestInput = z.infer<typeof createGuestSchema>;

export const updateGuestSchema = createGuestSchema.partial();
export type UpdateGuestInput = z.infer<typeof updateGuestSchema>;

export const listGuestsQuerySchema = paginationQuerySchema.extend({
  rsvpStatus: rsvpStatusSchema.optional(),
});
export type ListGuestsQuery = z.infer<typeof listGuestsQuerySchema>;
