import type { PaginatedResult } from "@maisa/types";
import { apiRequest, type ApiEnvelope } from "../../../lib/api-client";
import type {
  CreateInvoiceFormValues,
  CreatePaymentFormValues,
  ListInvoicesQuery,
  UpdateInvoiceFormValues,
} from "../schemas";
import type { Invoice, Payment } from "../types";

function stripEmptyOptionals<T extends Record<string, unknown>>(input: T): Partial<T> {
  const result: Partial<T> = {};
  for (const [key, value] of Object.entries(input)) {
    if (value !== "") result[key as keyof T] = value as T[keyof T];
  }
  return result;
}

const invoicesBase = (eventId: string) => `/events/${eventId}/invoices`;
const paymentsBase = (eventId: string, invoiceId: string) => `${invoicesBase(eventId)}/${invoiceId}/payments`;

export async function listInvoices(eventId: string, query: ListInvoicesQuery = {}): Promise<PaginatedResult<Invoice>> {
  return apiRequest<PaginatedResult<Invoice>>(invoicesBase(eventId), { query });
}

export async function createInvoice(eventId: string, input: CreateInvoiceFormValues): Promise<Invoice> {
  const res = await apiRequest<ApiEnvelope<Invoice>>(invoicesBase(eventId), {
    method: "POST",
    body: stripEmptyOptionals(input),
  });
  return res.data;
}

export async function updateInvoice(eventId: string, id: string, input: UpdateInvoiceFormValues): Promise<Invoice> {
  const res = await apiRequest<ApiEnvelope<Invoice>>(`${invoicesBase(eventId)}/${id}`, {
    method: "PATCH",
    body: stripEmptyOptionals(input),
  });
  return res.data;
}

export async function deleteInvoice(eventId: string, id: string): Promise<void> {
  await apiRequest<void>(`${invoicesBase(eventId)}/${id}`, { method: "DELETE" });
}

export async function listPayments(eventId: string, invoiceId: string): Promise<PaginatedResult<Payment>> {
  return apiRequest<PaginatedResult<Payment>>(paymentsBase(eventId, invoiceId));
}

export async function createPayment(eventId: string, invoiceId: string, input: CreatePaymentFormValues): Promise<Payment> {
  const res = await apiRequest<ApiEnvelope<Payment>>(paymentsBase(eventId, invoiceId), {
    method: "POST",
    body: stripEmptyOptionals(input),
  });
  return res.data;
}

export async function deletePayment(eventId: string, invoiceId: string, id: string): Promise<void> {
  await apiRequest<void>(`${paymentsBase(eventId, invoiceId)}/${id}`, { method: "DELETE" });
}
