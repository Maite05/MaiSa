import { z } from "zod";

export const leadStageSchema = z.enum(["NEW", "CONTACTED", "QUALIFIED", "WON", "LOST"]);

export const leadFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  company: z.string().max(200).optional().or(z.literal("")),
  email: z.string().email("Enter a valid email"),
  stage: leadStageSchema,
});
export type LeadFormValues = z.infer<typeof leadFormSchema>;
