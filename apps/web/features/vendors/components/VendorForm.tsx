"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, SelectField, TextField } from "@maisa/ui";
import { useForm } from "react-hook-form";
import { useCreateVendor, useUpdateVendor } from "../hooks";
import { vendorFormSchema, type VendorFormValues } from "../schemas";
import type { Vendor } from "../types";

const CATEGORY_OPTIONS = ["Catering", "Photography", "Florals", "Venue", "Entertainment", "Other"].map((c) => ({ label: c, value: c }));
const PRICE_OPTIONS = ["$", "$$", "$$$", "$$$$"].map((p) => ({ label: p, value: p }));

export function VendorForm({ item, onDone }: { item?: Vendor; onDone: () => void }) {
  const create = useCreateVendor();
  const update = useUpdateVendor();
  const isEdit = Boolean(item);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VendorFormValues>({
    resolver: zodResolver(vendorFormSchema),
    defaultValues: {
      name: item?.name ?? "",
      category: item?.category ?? "Catering",
      contactEmail: item?.contactEmail ?? "",
      priceRange: item?.priceRange ?? "$$",
      rating: item?.rating,
    },
  });

  async function onSubmit(values: VendorFormValues) {
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
      <SelectField label="Category" options={CATEGORY_OPTIONS} error={errors.category?.message} {...register("category")} />
      <TextField label="Contact Email" type="email" error={errors.contactEmail?.message} {...register("contactEmail")} />
      <SelectField label="Price Range" options={PRICE_OPTIONS} error={errors.priceRange?.message} {...register("priceRange")} />
      <TextField label="Rating (1-5)" type="number" min={1} max={5} error={errors.rating?.message} {...register("rating")} />
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
        <Button type="button" variant="ghost" onClick={onDone}>
          Cancel
        </Button>
        <Button type="submit" loading={create.isPending || update.isPending}>
          {isEdit ? "Save Changes" : "Add Vendor"}
        </Button>
      </div>
    </form>
  );
}

export default VendorForm;
