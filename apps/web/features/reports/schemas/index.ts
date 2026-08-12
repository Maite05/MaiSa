import { z } from "zod";

export const reportTypeSchema = z.enum(["Revenue", "Event Summary", "Client Activity", "Budget Variance"]);

export const generateReportFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  type: reportTypeSchema,
});
export type GenerateReportFormValues = z.infer<typeof generateReportFormSchema>;
