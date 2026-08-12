"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, TextAreaField, TextField } from "@maisa/ui";
import { useForm } from "react-hook-form";
import { ApiError } from "../../../lib/api-client";
import { parseDecimal } from "../../../lib/format";
import { useCreateBudgetItem, useUpdateBudgetItem } from "../hooks";
import { createBudgetItemSchema, type CreateBudgetItemFormValues } from "../schemas";
import type { BudgetItem } from "../types";

export function BudgetItemForm({ eventId, item, onDone }: { eventId: string; item?: BudgetItem; onDone: () => void }) {
  const isEdit = Boolean(item);
  const create = useCreateBudgetItem(eventId);
  const update = useUpdateBudgetItem(eventId, item?.id ?? "");
  const mutation = isEdit ? update : create;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateBudgetItemFormValues>({
    resolver: zodResolver(createBudgetItemSchema),
    defaultValues: {
      category: item?.category ?? "",
      description: item?.description ?? "",
      estimatedCost: item ? parseDecimal(item.estimatedCost) : 0,
      actualCost: item?.actualCost ? parseDecimal(item.actualCost) : undefined,
    },
  });

  async function onSubmit(values: CreateBudgetItemFormValues) {
    try {
      await mutation.mutateAsync(values);
      onDone();
    } catch {
      // surfaced below via mutation.error
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <TextField label="Category" hint="e.g. Venue & Catering" error={errors.category?.message} {...register("category")} />
      <TextAreaField label="Description" error={errors.description?.message} {...register("description")} />
      <TextField label="Estimated Cost" type="number" min={0} step="0.01" error={errors.estimatedCost?.message} {...register("estimatedCost")} />
      <TextField label="Actual Cost" type="number" min={0} step="0.01" hint="Leave blank until spent" error={errors.actualCost?.message} {...register("actualCost")} />
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
          {isEdit ? "Save Changes" : "Add Line Item"}
        </Button>
      </div>
    </form>
  );
}

export default BudgetItemForm;
