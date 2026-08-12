"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, color, space, TextField } from "@maisa/ui";
import { useForm } from "react-hook-form";
import { ApiError } from "../../../lib/api-client";
import { formatCurrency, formatDate, parseDecimal } from "../../../lib/format";
import { useCreatePayment, useDeletePayment, usePayments } from "../hooks";
import { createPaymentSchema, type CreatePaymentFormValues } from "../schemas";
import { getBalanceRemaining } from "../services";
import type { Invoice } from "../types";
import { isPaymentAmountValid } from "../validators";

export function InvoicePaymentsPanel({ eventId, invoice }: { eventId: string; invoice: Invoice }) {
  const { data } = usePayments(eventId, invoice.id);
  const createPayment = useCreatePayment(eventId, invoice.id);
  const deletePayment = useDeletePayment(eventId, invoice.id);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<CreatePaymentFormValues>({
    resolver: zodResolver(createPaymentSchema),
    defaultValues: { amount: 0, method: "", paidAt: "", externalRef: "" },
  });

  const remaining = getBalanceRemaining(invoice);
  const amountInvalid = !isPaymentAmountValid(invoice, Number(watch("amount")) || 0);

  async function onSubmit(values: CreatePaymentFormValues) {
    if (!isPaymentAmountValid(invoice, values.amount)) return;
    try {
      await createPayment.mutateAsync(values);
      reset({ amount: 0, method: "", paidAt: "", externalRef: "" });
    } catch {
      // surfaced below via createPayment.error
    }
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: space(2), fontSize: "14px" }}>
        <span>
          {formatCurrency(parseDecimal(invoice.amountPaid))} paid of {formatCurrency(parseDecimal(invoice.amountDue))}
        </span>
        <span style={{ color: color.onSurfaceVariant }}>{formatCurrency(remaining)} remaining</span>
      </div>

      <ul style={{ listStyle: "none", margin: 0, padding: 0, marginBottom: space(2) }}>
        {(data?.data ?? []).length === 0 && (
          <p style={{ fontSize: "13px", color: color.onSurfaceVariant }}>No payments recorded yet.</p>
        )}
        {(data?.data ?? []).map((payment) => (
          <li
            key={payment.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: `${space(1)} 0`,
              borderBottom: `1px solid ${color.borderSubtle}`,
              fontSize: "13px",
            }}
          >
            <span>
              {formatCurrency(parseDecimal(payment.amount))} · {payment.method ?? "Unspecified"} · {formatDate(payment.paidAt)}
            </span>
            <button
              onClick={() => {
                if (window.confirm("Remove this payment?")) deletePayment.mutate(payment.id);
              }}
              style={{ background: "none", border: "none", color: color.error, cursor: "pointer", fontSize: "12px" }}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      {remaining > 0 && (
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: space(1.5) }}>
          <TextField
            label="Payment Amount"
            type="number"
            min={0}
            step="0.01"
            error={errors.amount?.message ?? (amountInvalid && watch("amount") ? "Can't exceed the remaining balance." : undefined)}
            {...register("amount")}
          />
          <TextField label="Method" hint="e.g. Card, Wire Transfer" error={errors.method?.message} {...register("method")} />
          <TextField label="Paid On" type="date" error={errors.paidAt?.message} {...register("paidAt")} />
          {createPayment.isError && (
            <p style={{ color: color.error, fontSize: "13px", margin: 0 }}>
              {createPayment.error instanceof ApiError ? createPayment.error.message : "Something went wrong."}
            </p>
          )}
          <Button type="submit" loading={createPayment.isPending} disabled={amountInvalid}>
            Record Payment
          </Button>
        </form>
      )}
    </div>
  );
}

export default InvoicePaymentsPanel;
