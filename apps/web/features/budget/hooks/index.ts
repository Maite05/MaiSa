"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createBudgetItem, deleteBudgetItem, listBudgetItems, updateBudgetItem } from "../api";
import type { CreateBudgetItemFormValues, ListBudgetItemsQuery, UpdateBudgetItemFormValues } from "../schemas";

const budgetKey = (eventId: string, query: ListBudgetItemsQuery = {}) => ["budget-items", eventId, query] as const;

export function useBudgetItems(eventId: string, query: ListBudgetItemsQuery = {}) {
  return useQuery({
    queryKey: budgetKey(eventId, query),
    queryFn: () => listBudgetItems(eventId, query),
    enabled: Boolean(eventId),
  });
}

export function useCreateBudgetItem(eventId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateBudgetItemFormValues) => createBudgetItem(eventId, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["budget-items", eventId] }),
  });
}

export function useUpdateBudgetItem(eventId: string, id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateBudgetItemFormValues) => updateBudgetItem(eventId, id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["budget-items", eventId] }),
  });
}

export function useDeleteBudgetItem(eventId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteBudgetItem(eventId, id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["budget-items", eventId] }),
  });
}
