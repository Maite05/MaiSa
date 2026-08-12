import { z } from "zod";

// Mirrors apps/api/src/modules/events/events.schemas.ts field-for-field.

export const eventStatusSchema = z.enum(["INQUIRY", "PLANNING", "CONFIRMED", "COMPLETED", "CANCELLED"]);

export const createEventSchema = z.object({
  clientId: z.string().min(1, "Select a client"),
  name: z.string().min(1, "Name is required").max(200),
  type: z.string().max(100).optional().or(z.literal("")),
  status: eventStatusSchema.optional(),
  eventDate: z.string().optional().or(z.literal("")),
  venueName: z.string().max(200).optional().or(z.literal("")),
  guestCountEstimate: z.coerce.number().int().nonnegative().optional(),
});
export type CreateEventFormValues = z.infer<typeof createEventSchema>;

export const updateEventSchema = createEventSchema.partial();
export type UpdateEventFormValues = z.infer<typeof updateEventSchema>;

export const listEventsQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
  status: eventStatusSchema.optional(),
  clientId: z.string().optional(),
});
export type ListEventsQuery = z.infer<typeof listEventsQuerySchema>;
