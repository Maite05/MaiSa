"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, SelectField, TextField } from "@maisa/ui";
import { useForm } from "react-hook-form";
import { ApiError } from "../../../lib/api-client";
import { parseDecimal } from "../../../lib/format";
import { useCreateInvoice, useUpdateInvoice } from "../hooks";
import { createInvoiceSchema, type CreateInvoiceFormValues } from "../schemas";
import type { Invoice } from "../types";

const STATUS_OPTIONS = [
  { label: "Draft", value: "DRAFT" },
  { label: "Sent", value: "SENT" },
  { label: "Partially Paid", value: "PARTIALLY_PAID" },
  { label: "Paid", value: "PAID" },
  { label: "Overdue", value: "OVERDUE" },
  { label: "Cancelled", value: "CANCELLED" },
];

export function InvoiceForm({ eventId, invoice, onDone }: { eventId: string; invoice?: Invoice; onDone: () => void }) {
  const isEdit = Boolean(invoice);
  const create = useCreateInvoice(eventId);
  const update = useUpdateInvoice(eventId, invoice?.id ?? "");
  const mutation = isEdit ? update : create;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateInvoiceFormValues>({
    resolver: zodResolver(createInvoiceSchema),
    defaultValues: {
      status: invoice?.status ?? "DRAFT",
      amountDue: invoice ? parseDecimal(invoice.amountDue) : 0,
      dueDate: invoice?.dueDate ? invoice.dueDate.slice(0, 10) : "",
    },
  });

  async function onSubmit(values: CreateInvoiceFormValues) {
    try {
      await mutation.mutateAsync(values);
      onDone();
    } catch {
      // surfaced below via mutation.error
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <TextField label="Amount Due" type="number" min={0} step="0.01" error={errors.amountDue?.message} {...register("amountDue")} />
      <SelectField label="Status" options={STATUS_OPTIONS} error={errors.status?.message} {...register("status")} />
      <TextField label="Due Date" type="date" error={errors.dueDate?.message} {...register("dueDate")} />
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
          {isEdit ? "Save Changes" : "Create Invoice"}
        </Button>
      </div>
    </form>
  );
}

export default InvoiceForm;
