import { z } from "zod";

import { paginationQuerySchema } from "../../lib/pagination-schema";

export const createTimelineItemSchema = z.object({
  title: z.string().min(1).max(200),
  startTime: z.coerce.date(),
  endTime: z.coerce.date().optional(),
  notes: z.string().max(2000).optional(),
});
export type CreateTimelineItemInput = z.infer<typeof createTimelineItemSchema>;

export const updateTimelineItemSchema = createTimelineItemSchema.partial();
export type UpdateTimelineItemInput = z.infer<typeof updateTimelineItemSchema>;

export const listTimelineItemsQuerySchema = paginationQuerySchema;
export type ListTimelineItemsQuery = z.infer<typeof listTimelineItemsQuerySchema>;
