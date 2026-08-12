"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, SelectField, TextField } from "@maisa/ui";
import { useForm } from "react-hook-form";
import { ApiError } from "../../../lib/api-client";
import { useCreateContract, useUpdateContract } from "../hooks";
import { createContractSchema, type CreateContractFormValues } from "../schemas";
import type { Contract } from "../types";

const STATUS_OPTIONS = [
  { label: "Draft", value: "DRAFT" },
  { label: "Sent", value: "SENT" },
  { label: "Signed", value: "SIGNED" },
  { label: "Void", value: "VOID" },
];

export function ContractForm({ eventId, contract, onDone }: { eventId: string; contract?: Contract; onDone: () => void }) {
  const isEdit = Boolean(contract);
  const create = useCreateContract(eventId);
  const update = useUpdateContract(eventId, contract?.id ?? "");
  const mutation = isEdit ? update : create;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateContractFormValues>({
    resolver: zodResolver(createContractSchema),
    defaultValues: {
      title: contract?.title ?? "",
      status: contract?.status ?? "DRAFT",
      documentUrl: contract?.documentUrl ?? "",
      signedAt: contract?.signedAt ? contract.signedAt.slice(0, 10) : "",
    },
  });

  async function onSubmit(values: CreateContractFormValues) {
    try {
      await mutation.mutateAsync(values);
      onDone();
    } catch {
      // surfaced below via mutation.error
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <TextField label="Title" error={errors.title?.message} {...register("title")} />
      <SelectField label="Status" options={STATUS_OPTIONS} error={errors.status?.message} {...register("status")} />
      <TextField label="Document URL" hint="Link to the signed/unsigned document" error={errors.documentUrl?.message} {...register("documentUrl")} />
      <TextField label="Signed On" type="date" error={errors.signedAt?.message} {...register("signedAt")} />
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
          {isEdit ? "Save Changes" : "Add Contract"}
        </Button>
      </div>
    </form>
  );
}

export default ContractForm;
