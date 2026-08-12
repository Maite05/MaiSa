"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createDocument, deleteDocument, listDocuments } from "../api";
import type { CreateDocumentFormValues, ListDocumentsQuery } from "../schemas";

const documentsKey = (eventId: string, query: ListDocumentsQuery = {}) => ["documents", eventId, query] as const;

export function useDocuments(eventId: string, query: ListDocumentsQuery = {}) {
  return useQuery({
    queryKey: documentsKey(eventId, query),
    queryFn: () => listDocuments(eventId, query),
    enabled: Boolean(eventId),
  });
}

export function useCreateDocument(eventId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateDocumentFormValues) => createDocument(eventId, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["documents", eventId] }),
  });
}

export function useDeleteDocument(eventId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteDocument(eventId, id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["documents", eventId] }),
  });
}
