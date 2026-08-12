import { z } from "zod";

export const calendarEntryFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  date: z.string().min(1, "Date is required"),
  allDay: z.boolean().default(true),
  notes: z.string().max(2000).optional().or(z.literal("")),
});
export type CalendarEntryFormValues = z.infer<typeof calendarEntryFormSchema>;
