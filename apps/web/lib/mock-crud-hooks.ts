"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { MockCrudApi } from "./mock-store";

/**
 * React Query wiring shared by every Tier 2 (mock-backed) feature's
 * hooks/index.ts — same shape as the real features' hand-written hooks
 * (useX / useCreateX / ...), just generated instead of repeated 7 times.
 */
export function createCrudHooks<T extends { id: string }>(queryKey: string, api: MockCrudApi<T>) {
  function useList() {
    return useQuery({ queryKey: [queryKey], queryFn: api.list });
  }

  function useCreate() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (input: Omit<T, "id">) => api.create(input),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: [queryKey] }),
    });
  }

  function useUpdate() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ id, input }: { id: string; input: Partial<Omit<T, "id">> }) => api.update(id, input),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: [queryKey] }),
    });
  }

  function useRemove() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (id: string) => api.remove(id),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: [queryKey] }),
    });
  }

  return { useList, useCreate, useUpdate, useRemove };
}
