import { z } from "zod";

// Mirrors apps/api/src/modules/timeline/timeline.schemas.ts field-for-field.

export const createTimelineItemSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().optional().or(z.literal("")),
  notes: z.string().max(2000).optional().or(z.literal("")),
});
export type CreateTimelineItemFormValues = z.infer<typeof createTimelineItemSchema>;

export const updateTimelineItemSchema = createTimelineItemSchema.partial();
export type UpdateTimelineItemFormValues = z.infer<typeof updateTimelineItemSchema>;

export const listTimelineItemsQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
});
export type ListTimelineItemsQuery = z.infer<typeof listTimelineItemsQuerySchema>;
