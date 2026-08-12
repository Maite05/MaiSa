import { z } from "zod";

export const eventTemplateFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  description: z.string().max(2000).optional().or(z.literal("")),
  category: z.string().min(1, "Category is required").max(120),
});
export type EventTemplateFormValues = z.infer<typeof eventTemplateFormSchema>;
