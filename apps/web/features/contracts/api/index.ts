import type { PaginatedResult } from "@maisa/types";
import { apiRequest, type ApiEnvelope } from "../../../lib/api-client";
import type { CreateContractFormValues, ListContractsQuery, UpdateContractFormValues } from "../schemas";
import type { Contract } from "../types";

function stripEmptyOptionals<T extends Record<string, unknown>>(input: T): Partial<T> {
  const result: Partial<T> = {};
  for (const [key, value] of Object.entries(input)) {
    if (value !== "") result[key as keyof T] = value as T[keyof T];
  }
  return result;
}

const base = (eventId: string) => `/events/${eventId}/contracts`;

export async function listContracts(eventId: string, query: ListContractsQuery = {}): Promise<PaginatedResult<Contract>> {
  return apiRequest<PaginatedResult<Contract>>(base(eventId), { query });
}

export async function createContract(eventId: string, input: CreateContractFormValues): Promise<Contract> {
  const res = await apiRequest<ApiEnvelope<Contract>>(base(eventId), { method: "POST", body: stripEmptyOptionals(input) });
  return res.data;
}

export async function updateContract(eventId: string, id: string, input: UpdateContractFormValues): Promise<Contract> {
  const res = await apiRequest<ApiEnvelope<Contract>>(`${base(eventId)}/${id}`, {
    method: "PATCH",
    body: stripEmptyOptionals(input),
  });
  return res.data;
}

export async function deleteContract(eventId: string, id: string): Promise<void> {
  await apiRequest<void>(`${base(eventId)}/${id}`, { method: "DELETE" });
}
