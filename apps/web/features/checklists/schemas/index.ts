import { z } from "zod";

export const checklistItemFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(300),
  done: z.boolean().default(false),
  dueDate: z.string().optional().or(z.literal("")),
});
export type ChecklistItemFormValues = z.infer<typeof checklistItemFormSchema>;
