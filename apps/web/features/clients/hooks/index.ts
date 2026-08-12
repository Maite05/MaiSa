"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient, deleteClient, getClient, listClients, updateClient } from "../api";
import type { CreateClientFormValues, ListClientsQuery, UpdateClientFormValues } from "../schemas";

const clientsKey = (query: ListClientsQuery = {}) => ["clients", "list", query] as const;
const clientKey = (id: string) => ["clients", "detail", id] as const;

export function useClients(query: ListClientsQuery = {}) {
  return useQuery({ queryKey: clientsKey(query), queryFn: () => listClients(query) });
}

export function useClient(id: string | undefined) {
  return useQuery({ queryKey: clientKey(id ?? ""), queryFn: () => getClient(id as string), enabled: Boolean(id) });
}

export function useCreateClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateClientFormValues) => createClient(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["clients", "list"] }),
  });
}

export function useUpdateClient(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateClientFormValues) => updateClient(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients", "list"] });
      queryClient.invalidateQueries({ queryKey: clientKey(id) });
    },
  });
}

export function useDeleteClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteClient(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["clients", "list"] }),
  });
}
