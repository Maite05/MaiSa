import { z } from "zod";

import { paginationQuerySchema } from "../../lib/pagination-schema";

export const eventStatusSchema = z.enum(["INQUIRY", "PLANNING", "CONFIRMED", "COMPLETED", "CANCELLED"]);

export const createEventSchema = z.object({
  clientId: z.string().cuid(),
  name: z.string().min(1).max(200),
  type: z.string().max(100).optional(),
  status: eventStatusSchema.optional(),
  eventDate: z.coerce.date().optional(),
  venueName: z.string().max(200).optional(),
  guestCountEstimate: z.coerce.number().int().nonnegative().optional(),
});
export type CreateEventInput = z.infer<typeof createEventSchema>;

export const updateEventSchema = createEventSchema.partial();
export type UpdateEventInput = z.infer<typeof updateEventSchema>;

export const listEventsQuerySchema = paginationQuerySchema.extend({
  status: eventStatusSchema.optional(),
  clientId: z.string().cuid().optional(),
});
export type ListEventsQuery = z.infer<typeof listEventsQuerySchema>;
