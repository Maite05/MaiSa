"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, TextField } from "@maisa/ui";
import { useForm } from "react-hook-form";
import { useCreateChecklistItem, useUpdateChecklistItem } from "../hooks";
import { checklistItemFormSchema, type ChecklistItemFormValues } from "../schemas";
import type { ChecklistItem } from "../types";

export function ChecklistItemForm({ item, onDone }: { item?: ChecklistItem; onDone: () => void }) {
  const create = useCreateChecklistItem();
  const update = useUpdateChecklistItem();
  const isEdit = Boolean(item);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChecklistItemFormValues>({
    resolver: zodResolver(checklistItemFormSchema),
    defaultValues: { title: item?.title ?? "", done: item?.done ?? false, dueDate: item?.dueDate ?? "" },
  });

  async function onSubmit(values: ChecklistItemFormValues) {
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
      <TextField label="Due Date" type="date" error={errors.dueDate?.message} {...register("dueDate")} />
      <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px" }}>
        <input type="checkbox" {...register("done")} /> Done
      </label>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
        <Button type="button" variant="ghost" onClick={onDone}>
          Cancel
        </Button>
        <Button type="submit" loading={create.isPending || update.isPending}>
          {isEdit ? "Save Changes" : "Add Item"}
        </Button>
      </div>
    </form>
  );
}

export default ChecklistItemForm;
