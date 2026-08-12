"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, SelectField, TextField } from "@maisa/ui";
import { useForm } from "react-hook-form";
import { ApiError } from "../../../lib/api-client";
import { useCreateTask, useUpdateTask } from "../hooks";
import { createTaskSchema, type CreateTaskFormValues } from "../schemas";
import type { Task } from "../types";

const STATUS_OPTIONS = [
  { label: "To Do", value: "TODO" },
  { label: "In Progress", value: "IN_PROGRESS" },
  { label: "Done", value: "DONE" },
];

// Assignee selection is intentionally omitted here — it needs the org
// member picker from features/teams, which this feature doesn't depend on
// to keep the dependency graph simple. Wire a member <SelectField> in once
// that list is available where this form is used.
export function TaskForm({ eventId, task, onDone }: { eventId: string; task?: Task; onDone: () => void }) {
  const isEdit = Boolean(task);
  const create = useCreateTask(eventId);
  const update = useUpdateTask(eventId, task?.id ?? "");
  const mutation = isEdit ? update : create;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateTaskFormValues>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: task?.title ?? "",
      status: task?.status ?? "TODO",
      dueDate: task?.dueDate ? task.dueDate.slice(0, 10) : "",
    },
  });

  async function onSubmit(values: CreateTaskFormValues) {
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
      <SelectField label="Status" options={STATUS_OPTIONS} error={errors.status?.message} {...register("status")} />
      <TextField label="Due Date" type="date" error={errors.dueDate?.message} {...register("dueDate")} />
      {mutation.isError && (
        <p style={{ color: "#ba1a1a", fontSize: "13px", margin: 0 }}>
          {mutation.error instanceof ApiError ? mutation.error.message : "Something went wrong. Please try again."}
        </p>
      )}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
        <Button type="button" variant="ghost" onClick={onDone}>
          Cancel
        </Button>
        <Button type="submit" loading={mutation.isPending}>
          {isEdit ? "Save Changes" : "Add Task"}
        </Button>
      </div>
    </form>
  );
}

export default TaskForm;
