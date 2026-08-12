"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createEvent, deleteEvent, getEvent, listEvents, updateEvent } from "../api";
import type { CreateEventFormValues, ListEventsQuery, UpdateEventFormValues } from "../schemas";

const eventsKey = (query: ListEventsQuery = {}) => ["events", "list", query] as const;
const eventKey = (id: string) => ["events", "detail", id] as const;

export function useEvents(query: ListEventsQuery = {}) {
  return useQuery({ queryKey: eventsKey(query), queryFn: () => listEvents(query) });
}

export function useEvent(id: string | undefined) {
  return useQuery({ queryKey: eventKey(id ?? ""), queryFn: () => getEvent(id as string), enabled: Boolean(id) });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateEventFormValues) => createEvent(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["events", "list"] }),
  });
}

export function useUpdateEvent(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateEventFormValues) => updateEvent(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events", "list"] });
      queryClient.invalidateQueries({ queryKey: eventKey(id) });
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteEvent(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["events", "list"] }),
  });
}
