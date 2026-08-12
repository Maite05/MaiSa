"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, SelectField, TextAreaField, TextField } from "@maisa/ui";
import { useForm } from "react-hook-form";
import { ApiError } from "../../../lib/api-client";
import { useCreateGuest, useUpdateGuest } from "../hooks";
import { createGuestSchema, type CreateGuestFormValues } from "../schemas";
import type { Guest } from "../types";

const RSVP_OPTIONS = [
  { label: "Pending", value: "PENDING" },
  { label: "Attending", value: "ATTENDING" },
  { label: "Declined", value: "DECLINED" },
  { label: "Maybe", value: "MAYBE" },
];

export function GuestForm({ eventId, guest, onDone }: { eventId: string; guest?: Guest; onDone: () => void }) {
  const isEdit = Boolean(guest);
  const create = useCreateGuest(eventId);
  const update = useUpdateGuest(eventId, guest?.id ?? "");
  const mutation = isEdit ? update : create;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateGuestFormValues>({
    resolver: zodResolver(createGuestSchema),
    defaultValues: {
      name: guest?.name ?? "",
      email: guest?.email ?? "",
      phone: guest?.phone ?? "",
      rsvpStatus: guest?.rsvpStatus ?? "PENDING",
      plusOnes: guest?.plusOnes ?? 0,
      tableNumber: guest?.tableNumber ?? "",
      dietaryNotes: guest?.dietaryNotes ?? "",
    },
  });

  async function onSubmit(values: CreateGuestFormValues) {
    try {
      await mutation.mutateAsync(values);
      onDone();
    } catch {
      // surfaced below via mutation.error
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <TextField label="Name" error={errors.name?.message} {...register("name")} />
      <TextField label="Email" type="email" error={errors.email?.message} {...register("email")} />
      <TextField label="Phone" error={errors.phone?.message} {...register("phone")} />
      <SelectField label="RSVP Status" options={RSVP_OPTIONS} error={errors.rsvpStatus?.message} {...register("rsvpStatus")} />
      <TextField label="Plus Ones" type="number" min={0} error={errors.plusOnes?.message} {...register("plusOnes")} />
      <TextField label="Table Number" error={errors.tableNumber?.message} {...register("tableNumber")} />
      <TextAreaField label="Dietary Notes" error={errors.dietaryNotes?.message} {...register("dietaryNotes")} />
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
          {isEdit ? "Save Changes" : "Add Guest"}
        </Button>
      </div>
    </form>
  );
}

export default GuestForm;
