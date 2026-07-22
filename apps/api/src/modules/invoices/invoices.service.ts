import { prisma } from "@maisa/database";
import { NotFoundError, getPagination, paginatedResult } from "@maisa/utils";

import { loadEventOrFail } from "../../lib/hooks";
import type { CreateInvoiceInput, ListInvoicesQuery, UpdateInvoiceInput } from "./invoices.schemas";

export async function listInvoices(organizationId: string, eventId: string, query: ListInvoicesQuery) {
  await loadEventOrFail(eventId, organizationId);
  const { skip, take, page, limit } = getPagination(query);

  const where = { eventId, ...(query.status ? { status: query.status } : {}) };

  const [invoices, total] = await Promise.all([
    prisma.invoice.findMany({ where, skip, take, orderBy: { createdAt: "desc" } }),
    prisma.invoice.count({ where }),
  ]);

  return paginatedResult(invoices, total, page, limit);
}

export async function getInvoiceOrFail(organizationId: string, eventId: string, id: string) {
  await loadEventOrFail(eventId, organizationId);
  const invoice = await prisma.invoice.findFirst({ where: { id, eventId }, include: { payments: true } });
  if (!invoice) {
    throw new NotFoundError("Invoice not found");
  }
  return invoice;
}

export async function createInvoice(organizationId: string, eventId: string, input: CreateInvoiceInput) {
  await loadEventOrFail(eventId, organizationId);
  return prisma.invoice.create({ data: { ...input, eventId } });
}

export async function updateInvoice(
  organizationId: string,
  eventId: string,
  id: string,
  input: UpdateInvoiceInput,
) {
  await getInvoiceOrFail(organizationId, eventId, id);
  return prisma.invoice.update({ where: { id }, data: input });
}

export async function deleteInvoice(organizationId: string, eventId: string, id: string) {
  await getInvoiceOrFail(organizationId, eventId, id);
  await prisma.invoice.delete({ where: { id } });
}
