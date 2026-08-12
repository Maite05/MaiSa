"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, SelectField, TextField } from "@maisa/ui";
import { useForm } from "react-hook-form";
import { useCreateLead, useUpdateLead } from "../hooks";
import { leadFormSchema, type LeadFormValues } from "../schemas";
import type { Lead } from "../types";

const STAGE_OPTIONS = ["NEW", "CONTACTED", "QUALIFIED", "WON", "LOST"].map((s) => ({ label: s, value: s }));

export function LeadForm({ item, onDone }: { item?: Lead; onDone: () => void }) {
  const create = useCreateLead();
  const update = useUpdateLead();
  const isEdit = Boolean(item);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: { name: item?.name ?? "", company: item?.company ?? "", email: item?.email ?? "", stage: item?.stage ?? "NEW" },
  });

  async function onSubmit(values: LeadFormValues) {
    if (isEdit && item) {
      await update.mutateAsync({ id: item.id, input: values });
    } else {
      await create.mutateAsync(values);
    }
    onDone();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <TextField label="Name" error={errors.name?.message} {...register("name")} />
      <TextField label="Company" error={errors.company?.message} {...register("company")} />
      <TextField label="Email" type="email" error={errors.email?.message} {...register("email")} />
      <SelectField label="Stage" options={STAGE_OPTIONS} error={errors.stage?.message} {...register("stage")} />
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
        <Button type="button" variant="ghost" onClick={onDone}>
          Cancel
        </Button>
        <Button type="submit" loading={create.isPending || update.isPending}>
          {isEdit ? "Save Changes" : "Add Lead"}
        </Button>
      </div>
    </form>
  );
}

export default LeadForm;
