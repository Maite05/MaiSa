import type { PaginatedResult } from "@maisa/types";
import { apiRequest, type ApiEnvelope } from "../../../lib/api-client";
import type { CreateGuestFormValues, ListGuestsQuery, UpdateGuestFormValues } from "../schemas";
import type { Guest } from "../types";

function stripEmptyOptionals<T extends Record<string, unknown>>(input: T): Partial<T> {
  const result: Partial<T> = {};
  for (const [key, value] of Object.entries(input)) {
    if (value !== "") result[key as keyof T] = value as T[keyof T];
  }
  return result;
}

const base = (eventId: string) => `/events/${eventId}/guests`;

export async function listGuests(eventId: string, query: ListGuestsQuery = {}): Promise<PaginatedResult<Guest>> {
  return apiRequest<PaginatedResult<Guest>>(base(eventId), { query });
}

export async function getGuest(eventId: string, id: string): Promise<Guest> {
  const res = await apiRequest<ApiEnvelope<Guest>>(`${base(eventId)}/${id}`);
  return res.data;
}

export async function createGuest(eventId: string, input: CreateGuestFormValues): Promise<Guest> {
  const res = await apiRequest<ApiEnvelope<Guest>>(base(eventId), { method: "POST", body: stripEmptyOptionals(input) });
  return res.data;
}

export async function updateGuest(eventId: string, id: string, input: UpdateGuestFormValues): Promise<Guest> {
  const res = await apiRequest<ApiEnvelope<Guest>>(`${base(eventId)}/${id}`, {
    method: "PATCH",
    body: stripEmptyOptionals(input),
  });
  return res.data;
}

export async function deleteGuest(eventId: string, id: string): Promise<void> {
  await apiRequest<void>(`${base(eventId)}/${id}`, { method: "DELETE" });
}
