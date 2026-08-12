"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTimelineItem, deleteTimelineItem, listTimelineItems, updateTimelineItem } from "../api";
import type { CreateTimelineItemFormValues, ListTimelineItemsQuery, UpdateTimelineItemFormValues } from "../schemas";

const timelineKey = (eventId: string, query: ListTimelineItemsQuery = {}) => ["timeline-items", eventId, query] as const;

export function useTimelineItems(eventId: string, query: ListTimelineItemsQuery = {}) {
  return useQuery({
    queryKey: timelineKey(eventId, query),
    queryFn: () => listTimelineItems(eventId, query),
    enabled: Boolean(eventId),
  });
}

export function useCreateTimelineItem(eventId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateTimelineItemFormValues) => createTimelineItem(eventId, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["timeline-items", eventId] }),
  });
}

export function useUpdateTimelineItem(eventId: string, id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateTimelineItemFormValues) => updateTimelineItem(eventId, id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["timeline-items", eventId] }),
  });
}

export function useDeleteTimelineItem(eventId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteTimelineItem(eventId, id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["timeline-items", eventId] }),
  });
}
