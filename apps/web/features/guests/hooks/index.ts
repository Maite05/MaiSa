"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createGuest, deleteGuest, listGuests, updateGuest } from "../api";
import type { CreateGuestFormValues, ListGuestsQuery, UpdateGuestFormValues } from "../schemas";

const guestsKey = (eventId: string, query: ListGuestsQuery = {}) => ["guests", eventId, query] as const;

export function useGuests(eventId: string, query: ListGuestsQuery = {}) {
  return useQuery({
    queryKey: guestsKey(eventId, query),
    queryFn: () => listGuests(eventId, query),
    enabled: Boolean(eventId),
  });
}

export function useCreateGuest(eventId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateGuestFormValues) => createGuest(eventId, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["guests", eventId] }),
  });
}

export function useUpdateGuest(eventId: string, id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateGuestFormValues) => updateGuest(eventId, id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["guests", eventId] }),
  });
}

export function useDeleteGuest(eventId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteGuest(eventId, id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["guests", eventId] }),
  });
}
