"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, TextAreaField, TextField } from "@maisa/ui";
import { useForm } from "react-hook-form";
import { useCreateEventTemplate, useUpdateEventTemplate } from "../hooks";
import { eventTemplateFormSchema, type EventTemplateFormValues } from "../schemas";
import type { EventTemplate } from "../types";

export function EventTemplateForm({ item, onDone }: { item?: EventTemplate; onDone: () => void }) {
  const create = useCreateEventTemplate();
  const update = useUpdateEventTemplate();
  const isEdit = Boolean(item);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EventTemplateFormValues>({
    resolver: zodResolver(eventTemplateFormSchema),
    defaultValues: { name: item?.name ?? "", description: item?.description ?? "", category: item?.category ?? "" },
  });

  async function onSubmit(values: EventTemplateFormValues) {
    if (isEdit && item) {
      await update.mutateAsync({ id: item.id, input: values });
    } else {
      await create.mutateAsync(values);
    }
    onDone();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <TextField label="Template Name" error={errors.name?.message} {...register("name")} />
      <TextField label="Category" error={errors.category?.message} {...register("category")} />
      <TextAreaField label="Description" error={errors.description?.message} {...register("description")} />
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
        <Button type="button" variant="ghost" onClick={onDone}>
          Cancel
        </Button>
        <Button type="submit" loading={create.isPending || update.isPending}>
          {isEdit ? "Save Changes" : "Add Template"}
        </Button>
      </div>
    </form>
  );
}

export default EventTemplateForm;
