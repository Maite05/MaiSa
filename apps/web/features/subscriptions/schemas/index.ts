import { z } from "zod";

export const changePlanFormSchema = z.object({
  plan: z.enum(["Starter", "Studio", "Agency"]),
});
export type ChangePlanFormValues = z.infer<typeof changePlanFormSchema>;
