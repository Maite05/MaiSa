"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, TextField } from "@maisa/ui";
import { useForm } from "react-hook-form";
import { useCreateInventoryItem, useUpdateInventoryItem } from "../hooks";
import { inventoryItemFormSchema, type InventoryItemFormValues } from "../schemas";
import type { InventoryItem } from "../types";

export function InventoryItemForm({ item, onDone }: { item?: InventoryItem; onDone: () => void }) {
  const create = useCreateInventoryItem();
  const update = useUpdateInventoryItem();
  const isEdit = Boolean(item);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InventoryItemFormValues>({
    resolver: zodResolver(inventoryItemFormSchema),
    defaultValues: { name: item?.name ?? "", sku: item?.sku ?? "", quantity: item?.quantity ?? 0, location: item?.location ?? "" },
  });

  async function onSubmit(values: InventoryItemFormValues) {
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
      <TextField label="SKU" error={errors.sku?.message} {...register("sku")} />
      <TextField label="Quantity" type="number" min={0} error={errors.quantity?.message} {...register("quantity")} />
      <TextField label="Location" error={errors.location?.message} {...register("location")} />
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

export default InventoryItemForm;
