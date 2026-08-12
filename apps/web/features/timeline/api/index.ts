import type { PaginatedResult } from "@maisa/types";
import { apiRequest, type ApiEnvelope } from "../../../lib/api-client";
import type { CreateTimelineItemFormValues, ListTimelineItemsQuery, UpdateTimelineItemFormValues } from "../schemas";
import type { TimelineItem } from "../types";

function stripEmptyOptionals<T extends Record<string, unknown>>(input: T): Partial<T> {
  const result: Partial<T> = {};
  for (const [key, value] of Object.entries(input)) {
    if (value !== "") result[key as keyof T] = value as T[keyof T];
  }
  return result;
}

const base = (eventId: string) => `/events/${eventId}/timeline-items`;

export async function listTimelineItems(eventId: string, query: ListTimelineItemsQuery = {}): Promise<PaginatedResult<TimelineItem>> {
  return apiRequest<PaginatedResult<TimelineItem>>(base(eventId), { query });
}

export async function createTimelineItem(eventId: string, input: CreateTimelineItemFormValues): Promise<TimelineItem> {
  const res = await apiRequest<ApiEnvelope<TimelineItem>>(base(eventId), {
    method: "POST",
    body: stripEmptyOptionals(input),
  });
  return res.data;
}

export async function updateTimelineItem(eventId: string, id: string, input: UpdateTimelineItemFormValues): Promise<TimelineItem> {
  const res = await apiRequest<ApiEnvelope<TimelineItem>>(`${base(eventId)}/${id}`, {
    method: "PATCH",
    body: stripEmptyOptionals(input),
  });
  return res.data;
}

export async function deleteTimelineItem(eventId: string, id: string): Promise<void> {
  await apiRequest<void>(`${base(eventId)}/${id}`, { method: "DELETE" });
}
