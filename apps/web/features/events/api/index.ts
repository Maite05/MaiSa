import type { PaginatedResult } from "@maisa/types";
import { apiRequest, type ApiEnvelope } from "../../../lib/api-client";
import type { CreateEventFormValues, ListEventsQuery, UpdateEventFormValues } from "../schemas";
import type { Event } from "../types";

function stripEmptyOptionals<T extends Record<string, unknown>>(input: T): Partial<T> {
  const result: Partial<T> = {};
  for (const [key, value] of Object.entries(input)) {
    if (value !== "") result[key as keyof T] = value as T[keyof T];
  }
  return result;
}

export async function listEvents(query: ListEventsQuery = {}): Promise<PaginatedResult<Event>> {
  return apiRequest<PaginatedResult<Event>>("/events", { query });
}

export async function getEvent(id: string): Promise<Event> {
  const res = await apiRequest<ApiEnvelope<Event>>(`/events/${id}`);
  return res.data;
}

export async function createEvent(input: CreateEventFormValues): Promise<Event> {
  const res = await apiRequest<ApiEnvelope<Event>>("/events", { method: "POST", body: stripEmptyOptionals(input) });
  return res.data;
}

export async function updateEvent(id: string, input: UpdateEventFormValues): Promise<Event> {
  const res = await apiRequest<ApiEnvelope<Event>>(`/events/${id}`, {
    method: "PATCH",
    body: stripEmptyOptionals(input),
  });
  return res.data;
}

export async function deleteEvent(id: string): Promise<void> {
  await apiRequest<void>(`/events/${id}`, { method: "DELETE" });
}
