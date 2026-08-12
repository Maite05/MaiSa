"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, TextAreaField, TextField } from "@maisa/ui";
import { useForm } from "react-hook-form";
import { ApiError } from "../../../lib/api-client";
import { useCreateClient, useUpdateClient } from "../hooks";
import { createClientSchema, type CreateClientFormValues } from "../schemas";
import type { Client } from "../types";

export function ClientForm({ client, onDone }: { client?: Client; onDone: () => void }) {
  const isEdit = Boolean(client);
  const create = useCreateClient();
  const update = useUpdateClient(client?.id ?? "");
  const mutation = isEdit ? update : create;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateClientFormValues>({
    resolver: zodResolver(createClientSchema),
    defaultValues: {
      name: client?.name ?? "",
      email: client?.email ?? "",
      phone: client?.phone ?? "",
      notes: client?.notes ?? "",
    },
  });

  async function onSubmit(values: CreateClientFormValues) {
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
        <Button type="submit" loading={mutation.isPending}>
          {isEdit ? "Save Changes" : "Add Client"}
        </Button>
      </div>
    </form>
  );
}

export default ClientForm;
