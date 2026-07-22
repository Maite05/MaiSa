import { z } from "zod";

import { paginationQuerySchema } from "../../lib/pagination-schema";

export const taskStatusSchema = z.enum(["TODO", "IN_PROGRESS", "DONE"]);

export const createTaskSchema = z.object({
  title: z.string().min(1).max(300),
  status: taskStatusSchema.optional(),
  dueDate: z.coerce.date().optional(),
  assigneeId: z.string().cuid().optional(),
});
export type CreateTaskInput = z.infer<typeof createTaskSchema>;

export const updateTaskSchema = createTaskSchema.partial();
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;

export const listTasksQuerySchema = paginationQuerySchema.extend({
  status: taskStatusSchema.optional(),
  assigneeId: z.string().cuid().optional(),
});
export type ListTasksQuery = z.infer<typeof listTasksQuerySchema>;
