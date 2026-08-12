"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, TextAreaField, TextField } from "@maisa/ui";
import { useForm } from "react-hook-form";
import { useCreateCalendarEntry, useUpdateCalendarEntry } from "../hooks";
import { calendarEntryFormSchema, type CalendarEntryFormValues } from "../schemas";
import type { CalendarEntry } from "../types";

export function CalendarEntryForm({ item, onDone }: { item?: CalendarEntry; onDone: () => void }) {
  const create = useCreateCalendarEntry();
  const update = useUpdateCalendarEntry();
  const isEdit = Boolean(item);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CalendarEntryFormValues>({
    resolver: zodResolver(calendarEntryFormSchema),
    defaultValues: { title: item?.title ?? "", date: item?.date ?? "", allDay: item?.allDay ?? true, notes: item?.notes ?? "" },
  });

  async function onSubmit(values: CalendarEntryFormValues) {
    if (isEdit && item) {
      await update.mutateAsync({ id: item.id, input: values });
    } else {
      await create.mutateAsync(values);
    }
    onDone();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <TextField label="Title" error={errors.title?.message} {...register("title")} />
      <TextField label="Date" type="date" error={errors.date?.message} {...register("date")} />
      <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px" }}>
        <input type="checkbox" {...register("allDay")} /> All day
      </label>
      <TextAreaField label="Notes" error={errors.notes?.message} {...register("notes")} />
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
        <Button type="button" variant="ghost" onClick={onDone}>
          Cancel
        </Button>
        <Button type="submit" loading={create.isPending || update.isPending}>
          {isEdit ? "Save Changes" : "Add to Calendar"}
        </Button>
      </div>
    </form>
  );
}

export default CalendarEntryForm;
