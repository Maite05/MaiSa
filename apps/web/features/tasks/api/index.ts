import type { PaginatedResult } from "@maisa/types";
import { apiRequest, type ApiEnvelope } from "../../../lib/api-client";
import type { CreateTaskFormValues, ListTasksQuery, UpdateTaskFormValues } from "../schemas";
import type { Task } from "../types";

function stripEmptyOptionals<T extends Record<string, unknown>>(input: T): Partial<T> {
  const result: Partial<T> = {};
  for (const [key, value] of Object.entries(input)) {
    if (value !== "") result[key as keyof T] = value as T[keyof T];
  }
  return result;
}

const base = (eventId: string) => `/events/${eventId}/tasks`;

export async function listTasks(eventId: string, query: ListTasksQuery = {}): Promise<PaginatedResult<Task>> {
  return apiRequest<PaginatedResult<Task>>(base(eventId), { query });
}

export async function createTask(eventId: string, input: CreateTaskFormValues): Promise<Task> {
  const res = await apiRequest<ApiEnvelope<Task>>(base(eventId), { method: "POST", body: stripEmptyOptionals(input) });
  return res.data;
}

export async function updateTask(eventId: string, id: string, input: UpdateTaskFormValues): Promise<Task> {
  const res = await apiRequest<ApiEnvelope<Task>>(`${base(eventId)}/${id}`, {
    method: "PATCH",
    body: stripEmptyOptionals(input),
  });
  return res.data;
}

export async function deleteTask(eventId: string, id: string): Promise<void> {
  await apiRequest<void>(`${base(eventId)}/${id}`, { method: "DELETE" });
}
