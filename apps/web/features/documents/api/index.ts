import type { PaginatedResult } from "@maisa/types";
import { apiRequest, type ApiEnvelope } from "../../../lib/api-client";
import type { CreateDocumentFormValues, ListDocumentsQuery, UpdateDocumentFormValues } from "../schemas";
import type { EventDocument } from "../types";

function stripEmptyOptionals<T extends Record<string, unknown>>(input: T): Partial<T> {
  const result: Partial<T> = {};
  for (const [key, value] of Object.entries(input)) {
    if (value !== "") result[key as keyof T] = value as T[keyof T];
  }
  return result;
}

const base = (eventId: string) => `/events/${eventId}/documents`;

export async function listDocuments(eventId: string, query: ListDocumentsQuery = {}): Promise<PaginatedResult<EventDocument>> {
  return apiRequest<PaginatedResult<EventDocument>>(base(eventId), { query });
}

export async function createDocument(eventId: string, input: CreateDocumentFormValues): Promise<EventDocument> {
  const res = await apiRequest<ApiEnvelope<EventDocument>>(base(eventId), {
    method: "POST",
    body: stripEmptyOptionals(input),
  });
  return res.data;
}

export async function updateDocument(eventId: string, id: string, input: UpdateDocumentFormValues): Promise<EventDocument> {
  const res = await apiRequest<ApiEnvelope<EventDocument>>(`${base(eventId)}/${id}`, {
    method: "PATCH",
    body: stripEmptyOptionals(input),
  });
  return res.data;
}

export async function deleteDocument(eventId: string, id: string): Promise<void> {
  await apiRequest<void>(`${base(eventId)}/${id}`, { method: "DELETE" });
}
