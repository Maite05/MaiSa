"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, TextAreaField, TextField } from "@maisa/ui";
import { useForm } from "react-hook-form";
import { ApiError } from "../../../lib/api-client";
import { useCreateTimelineItem, useUpdateTimelineItem } from "../hooks";
import { createTimelineItemSchema, type CreateTimelineItemFormValues } from "../schemas";
import type { TimelineItem } from "../types";
import { isValidTimeRange } from "../validators";

export function TimelineItemForm({ eventId, item, onDone }: { eventId: string; item?: TimelineItem; onDone: () => void }) {
  const isEdit = Boolean(item);
  const create = useCreateTimelineItem(eventId);
  const update = useUpdateTimelineItem(eventId, item?.id ?? "");
  const mutation = isEdit ? update : create;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateTimelineItemFormValues>({
    resolver: zodResolver(createTimelineItemSchema),
    defaultValues: {
      title: item?.title ?? "",
      startTime: item?.startTime ? item.startTime.slice(0, 16) : "",
      endTime: item?.endTime ? item.endTime.slice(0, 16) : "",
      notes: item?.notes ?? "",
    },
  });

  const rangeError = !isValidTimeRange(watch("startTime"), watch("endTime")) ? "End time must be after the start time." : null;

  async function onSubmit(values: CreateTimelineItemFormValues) {
    if (!isValidTimeRange(values.startTime, values.endTime)) return;
    try {
      await mutation.mutateAsync(values);
      onDone();
    } catch {
      // surfaced below via mutation.error
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <TextField label="Title" error={errors.title?.message} {...register("title")} />
      <TextField label="Start Time" type="datetime-local" error={errors.startTime?.message} {...register("startTime")} />
      <TextField label="End Time" type="datetime-local" error={errors.endTime?.message ?? rangeError ?? undefined} {...register("endTime")} />
      <TextAreaField label="Notes" error={errors.notes?.message} {...register("notes")} />
      {mutation.isError && (
        <p style={{ color: "#ba1a1a", fontSize: "13px", margin: 0 }}>
          {mutation.error instanceof ApiError ? mutation.error.message : "Something went wrong. Please try again."}
        </p>
      )}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
        <Button type="button" variant="ghost" onClick={onDone}>
          Cancel
        </Button>
        <Button type="submit" loading={mutation.isPending} disabled={Boolean(rangeError)}>
          {isEdit ? "Save Changes" : "Add to Timeline"}
        </Button>
      </div>
    </form>
  );
}

export default TimelineItemForm;
