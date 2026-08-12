import type { PaginatedResult } from "@maisa/types";
import { apiRequest, type ApiEnvelope } from "../../../lib/api-client";
import type { CreateBudgetItemFormValues, ListBudgetItemsQuery, UpdateBudgetItemFormValues } from "../schemas";
import type { BudgetItem } from "../types";

function stripEmptyOptionals<T extends Record<string, unknown>>(input: T): Partial<T> {
  const result: Partial<T> = {};
  for (const [key, value] of Object.entries(input)) {
    if (value !== "") result[key as keyof T] = value as T[keyof T];
  }
  return result;
}

const base = (eventId: string) => `/events/${eventId}/budget-items`;

export async function listBudgetItems(eventId: string, query: ListBudgetItemsQuery = {}): Promise<PaginatedResult<BudgetItem>> {
  return apiRequest<PaginatedResult<BudgetItem>>(base(eventId), { query });
}

export async function createBudgetItem(eventId: string, input: CreateBudgetItemFormValues): Promise<BudgetItem> {
  const res = await apiRequest<ApiEnvelope<BudgetItem>>(base(eventId), {
    method: "POST",
    body: stripEmptyOptionals(input),
  });
  return res.data;
}

export async function updateBudgetItem(eventId: string, id: string, input: UpdateBudgetItemFormValues): Promise<BudgetItem> {
  const res = await apiRequest<ApiEnvelope<BudgetItem>>(`${base(eventId)}/${id}`, {
    method: "PATCH",
    body: stripEmptyOptionals(input),
  });
  return res.data;
}

export async function deleteBudgetItem(eventId: string, id: string): Promise<void> {
  await apiRequest<void>(`${base(eventId)}/${id}`, { method: "DELETE" });
}
