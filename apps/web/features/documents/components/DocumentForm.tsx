"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, TextField } from "@maisa/ui";
import { useForm } from "react-hook-form";
import { ApiError } from "../../../lib/api-client";
import { useCreateDocument } from "../hooks";
import { createDocumentSchema, type CreateDocumentFormValues } from "../schemas";

export function DocumentForm({ eventId, onDone }: { eventId: string; onDone: () => void }) {
  const create = useCreateDocument(eventId);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateDocumentFormValues>({ resolver: zodResolver(createDocumentSchema) });

  async function onSubmit(values: CreateDocumentFormValues) {
    try {
      await create.mutateAsync(values);
      onDone();
    } catch {
      // surfaced below via create.error
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <TextField label="Name" error={errors.name?.message} {...register("name")} />
      <TextField label="File URL" hint="Link to an already-hosted file" error={errors.url?.message} {...register("url")} />
      <TextField label="File Type" hint="e.g. application/pdf" error={errors.mimeType?.message} {...register("mimeType")} />
      {create.isError && (
        <p style={{ color: "#ba1a1a", fontSize: "13px", margin: 0 }}>
          {create.error instanceof ApiError ? create.error.message : "Something went wrong. Please try again."}
        </p>
      )}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
        <Button type="button" variant="ghost" onClick={onDone}>
          Cancel
        </Button>
        <Button type="submit" loading={create.isPending}>
          Add Document
        </Button>
      </div>
    </form>
  );
}

export default DocumentForm;
