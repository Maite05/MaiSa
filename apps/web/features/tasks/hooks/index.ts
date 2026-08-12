"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTask, deleteTask, listTasks, updateTask } from "../api";
import type { CreateTaskFormValues, ListTasksQuery, UpdateTaskFormValues } from "../schemas";

const tasksKey = (eventId: string, query: ListTasksQuery = {}) => ["tasks", eventId, query] as const;

export function useTasks(eventId: string, query: ListTasksQuery = {}) {
  return useQuery({ queryKey: tasksKey(eventId, query), queryFn: () => listTasks(eventId, query), enabled: Boolean(eventId) });
}

export function useCreateTask(eventId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateTaskFormValues) => createTask(eventId, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks", eventId] }),
  });
}

export function useUpdateTask(eventId: string, id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateTaskFormValues) => updateTask(eventId, id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks", eventId] }),
  });
}

export function useDeleteTask(eventId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteTask(eventId, id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks", eventId] }),
  });
}
