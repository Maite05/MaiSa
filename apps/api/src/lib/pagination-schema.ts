import { z } from "zod";

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
});

export const idParamsSchema = z.object({
  id: z.string().cuid(),
});

export const eventIdParamsSchema = z.object({
  eventId: z.string().cuid(),
});

export const eventItemParamsSchema = z.object({
  eventId: z.string().cuid(),
  id: z.string().cuid(),
});
