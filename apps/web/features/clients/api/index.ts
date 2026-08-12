import type { PaginatedResult } from "@maisa/types";
import { apiRequest, type ApiEnvelope } from "../../../lib/api-client";
import type { CreateClientFormValues, ListClientsQuery, UpdateClientFormValues } from "../schemas";
import type { Client } from "../types";

/** Empty strings from optional text inputs shouldn't be sent as "" — the backend's zod schema wants them omitted entirely. */
function stripEmptyOptionals<T extends Record<string, unknown>>(input: T): Partial<T> {
  const result: Partial<T> = {};
  for (const [key, value] of Object.entries(input)) {
    if (value !== "") result[key as keyof T] = value as T[keyof T];
  }
  return result;
}

export async function listClients(query: ListClientsQuery = {}): Promise<PaginatedResult<Client>> {
  return apiRequest<PaginatedResult<Client>>("/clients", { query });
}

export async function getClient(id: string): Promise<Client> {
  const res = await apiRequest<ApiEnvelope<Client>>(`/clients/${id}`);
  return res.data;
}

export async function createClient(input: CreateClientFormValues): Promise<Client> {
  const res = await apiRequest<ApiEnvelope<Client>>("/clients", { method: "POST", body: stripEmptyOptionals(input) });
  return res.data;
}

export async function updateClient(id: string, input: UpdateClientFormValues): Promise<Client> {
  const res = await apiRequest<ApiEnvelope<Client>>(`/clients/${id}`, {
    method: "PATCH",
    body: stripEmptyOptionals(input),
  });
  return res.data;
}

export async function deleteClient(id: string): Promise<void> {
  await apiRequest<void>(`/clients/${id}`, { method: "DELETE" });
}
