"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, TextField } from "@maisa/ui";
import { useForm } from "react-hook-form";
import { useCreateMarketplaceListing, useUpdateMarketplaceListing } from "../hooks";
import { marketplaceListingFormSchema, type MarketplaceListingFormValues } from "../schemas";
import type { MarketplaceListing } from "../types";

export function MarketplaceListingForm({ item, onDone }: { item?: MarketplaceListing; onDone: () => void }) {
  const create = useCreateMarketplaceListing();
  const update = useUpdateMarketplaceListing();
  const isEdit = Boolean(item);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MarketplaceListingFormValues>({
    resolver: zodResolver(marketplaceListingFormSchema),
    defaultValues: {
      title: item?.title ?? "",
      vendorName: item?.vendorName ?? "",
      price: item?.price ?? 0,
      category: item?.category ?? "",
    },
  });

  async function onSubmit(values: MarketplaceListingFormValues) {
    if (isEdit && item) {
      await update.mutateAsync({ id: item.id, input: values });
    } else {
      await create.mutateAsync(values);
    }
    onDone();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <TextField label="Listing Title" error={errors.title?.message} {...register("title")} />
      <TextField label="Vendor Name" error={errors.vendorName?.message} {...register("vendorName")} />
      <TextField label="Price" type="number" min={0} step="0.01" error={errors.price?.message} {...register("price")} />
      <TextField label="Category" error={errors.category?.message} {...register("category")} />
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
        <Button type="button" variant="ghost" onClick={onDone}>
          Cancel
        </Button>
        <Button type="submit" loading={create.isPending || update.isPending}>
          {isEdit ? "Save Changes" : "Add Listing"}
        </Button>
      </div>
    </form>
  );
}

export default MarketplaceListingForm;
