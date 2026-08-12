import { z } from "zod";

// Mirrors apps/api/src/modules/tasks/tasks.schemas.ts field-for-field.

export const taskStatusSchema = z.enum(["TODO", "IN_PROGRESS", "DONE"]);

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(300),
  status: taskStatusSchema.optional(),
  dueDate: z.string().optional().or(z.literal("")),
  assigneeId: z.string().optional().or(z.literal("")),
});
export type CreateTaskFormValues = z.infer<typeof createTaskSchema>;

export const updateTaskSchema = createTaskSchema.partial();
export type UpdateTaskFormValues = z.infer<typeof updateTaskSchema>;

export const listTasksQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
  status: taskStatusSchema.optional(),
  assigneeId: z.string().optional(),
});
export type ListTasksQuery = z.infer<typeof listTasksQuerySchema>;
