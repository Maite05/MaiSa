"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createInvoice,
  createPayment,
  deleteInvoice,
  deletePayment,
  listInvoices,
  listPayments,
  updateInvoice,
} from "../api";
import type { CreateInvoiceFormValues, CreatePaymentFormValues, ListInvoicesQuery, UpdateInvoiceFormValues } from "../schemas";

const invoicesKey = (eventId: string, query: ListInvoicesQuery = {}) => ["invoices", eventId, query] as const;
const paymentsKey = (eventId: string, invoiceId: string) => ["payments", eventId, invoiceId] as const;

export function useInvoices(eventId: string, query: ListInvoicesQuery = {}) {
  return useQuery({
    queryKey: invoicesKey(eventId, query),
    queryFn: () => listInvoices(eventId, query),
    enabled: Boolean(eventId),
  });
}

export function useCreateInvoice(eventId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateInvoiceFormValues) => createInvoice(eventId, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["invoices", eventId] }),
  });
}

export function useUpdateInvoice(eventId: string, id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateInvoiceFormValues) => updateInvoice(eventId, id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["invoices", eventId] }),
  });
}

export function useDeleteInvoice(eventId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteInvoice(eventId, id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["invoices", eventId] }),
  });
}

export function usePayments(eventId: string, invoiceId: string | undefined) {
  return useQuery({
    queryKey: paymentsKey(eventId, invoiceId ?? ""),
    queryFn: () => listPayments(eventId, invoiceId as string),
    enabled: Boolean(eventId && invoiceId),
  });
}

export function useCreatePayment(eventId: string, invoiceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreatePaymentFormValues) => createPayment(eventId, invoiceId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentsKey(eventId, invoiceId) });
      // A new payment can shift the invoice's status (e.g. -> PARTIALLY_PAID/PAID) on the backend.
      queryClient.invalidateQueries({ queryKey: ["invoices", eventId] });
    },
  });
}

export function useDeletePayment(eventId: string, invoiceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deletePayment(eventId, invoiceId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentsKey(eventId, invoiceId) });
      queryClient.invalidateQueries({ queryKey: ["invoices", eventId] });
    },
  });
}
