"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createContract, deleteContract, listContracts, updateContract } from "../api";
import type { CreateContractFormValues, ListContractsQuery, UpdateContractFormValues } from "../schemas";

const contractsKey = (eventId: string, query: ListContractsQuery = {}) => ["contracts", eventId, query] as const;

export function useContracts(eventId: string, query: ListContractsQuery = {}) {
  return useQuery({
    queryKey: contractsKey(eventId, query),
    queryFn: () => listContracts(eventId, query),
    enabled: Boolean(eventId),
  });
}

export function useCreateContract(eventId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateContractFormValues) => createContract(eventId, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["contracts", eventId] }),
  });
}

export function useUpdateContract(eventId: string, id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateContractFormValues) => updateContract(eventId, id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["contracts", eventId] }),
  });
}

export function useDeleteContract(eventId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteContract(eventId, id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["contracts", eventId] }),
  });
}
