import { prisma } from "@maisa/database";
import { NotFoundError, getPagination, paginatedResult } from "@maisa/utils";

import { loadEventOrFail } from "../../lib/hooks";
import type { CreateBudgetItemInput, ListBudgetItemsQuery, UpdateBudgetItemInput } from "./budget.schemas";

export async function listBudgetItems(organizationId: string, eventId: string, query: ListBudgetItemsQuery) {
  await loadEventOrFail(eventId, organizationId);
  const { skip, take, page, limit } = getPagination(query);

  const where = { eventId };
  const [items, total] = await Promise.all([
    prisma.budgetItem.findMany({ where, skip, take, orderBy: { createdAt: "desc" } }),
    prisma.budgetItem.count({ where }),
  ]);

  return paginatedResult(items, total, page, limit);
}

export async function getBudgetItem(organizationId: string, eventId: string, id: string) {
  await loadEventOrFail(eventId, organizationId);
  const item = await prisma.budgetItem.findFirst({ where: { id, eventId } });
  if (!item) {
    throw new NotFoundError("Budget item not found");
  }
  return item;
}

export async function createBudgetItem(organizationId: string, eventId: string, input: CreateBudgetItemInput) {
  await loadEventOrFail(eventId, organizationId);
  return prisma.budgetItem.create({ data: { ...input, eventId } });
}

export async function updateBudgetItem(
  organizationId: string,
  eventId: string,
  id: string,
  input: UpdateBudgetItemInput,
) {
  await getBudgetItem(organizationId, eventId, id);
  return prisma.budgetItem.update({ where: { id }, data: input });
}

export async function deleteBudgetItem(organizationId: string, eventId: string, id: string) {
  await getBudgetItem(organizationId, eventId, id);
  await prisma.budgetItem.delete({ where: { id } });
}
