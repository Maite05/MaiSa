import { Prisma, prisma, type InvoiceStatus } from "@maisa/database";
import { NotFoundError, getPagination, paginatedResult } from "@maisa/utils";

import { getInvoiceOrFail } from "../invoices.service";
import type { CreatePaymentInput, ListPaymentsQuery } from "./payments.schemas";

function deriveInvoiceStatus(currentStatus: InvoiceStatus, amountDue: number, amountPaid: number): InvoiceStatus {
  if (amountPaid >= amountDue && amountDue > 0) return "PAID";
  if (amountPaid > 0) return "PARTIALLY_PAID";
  if (currentStatus === "PAID" || currentStatus === "PARTIALLY_PAID") return "SENT";
  return currentStatus;
}

async function resyncInvoiceTotals(tx: Prisma.TransactionClient, invoiceId: string) {
  const invoice = await tx.invoice.findUniqueOrThrow({ where: { id: invoiceId } });
  const sum = await tx.payment.aggregate({ where: { invoiceId }, _sum: { amount: true } });
  const amountPaid = sum._sum.amount ?? 0;

  return tx.invoice.update({
    where: { id: invoiceId },
    data: {
      amountPaid,
      status: deriveInvoiceStatus(invoice.status, Number(invoice.amountDue), Number(amountPaid)),
    },
  });
}

export async function listPayments(
  organizationId: string,
  eventId: string,
  invoiceId: string,
  query: ListPaymentsQuery,
) {
  await getInvoiceOrFail(organizationId, eventId, invoiceId);
  const { skip, take, page, limit } = getPagination(query);

  const where = { invoiceId };
  const [payments, total] = await Promise.all([
    prisma.payment.findMany({ where, skip, take, orderBy: { paidAt: "desc" } }),
    prisma.payment.count({ where }),
  ]);

  return paginatedResult(payments, total, page, limit);
}

export async function createPayment(
  organizationId: string,
  eventId: string,
  invoiceId: string,
  input: CreatePaymentInput,
) {
  await getInvoiceOrFail(organizationId, eventId, invoiceId);

  return prisma.$transaction(async (tx) => {
    const payment = await tx.payment.create({ data: { ...input, invoiceId } });
    await resyncInvoiceTotals(tx, invoiceId);
    return payment;
  });
}

export async function deletePayment(organizationId: string, eventId: string, invoiceId: string, id: string) {
  await getInvoiceOrFail(organizationId, eventId, invoiceId);

  const payment = await prisma.payment.findFirst({ where: { id, invoiceId } });
  if (!payment) {
    throw new NotFoundError("Payment not found");
  }

  await prisma.$transaction(async (tx) => {
    await tx.payment.delete({ where: { id } });
    await resyncInvoiceTotals(tx, invoiceId);
  });
}
