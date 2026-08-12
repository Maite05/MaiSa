"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getOrganization, updateActiveOrganization } from "../api";
import type { UpdateOrganizationFormValues } from "../schemas";

export function useOrganization(id: string | undefined) {
  return useQuery({
    queryKey: ["organization", id],
    queryFn: () => getOrganization(id as string),
    enabled: Boolean(id),
  });
}

export function useUpdateOrganization(id: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateOrganizationFormValues) => updateActiveOrganization(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["organization", id] }),
  });
}
