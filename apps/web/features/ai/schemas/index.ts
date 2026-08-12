import { z } from "zod";

export const sendMessageFormSchema = z.object({
  content: z.string().min(1, "Type a message first").max(4000),
});
export type SendMessageFormValues = z.infer<typeof sendMessageFormSchema>;
