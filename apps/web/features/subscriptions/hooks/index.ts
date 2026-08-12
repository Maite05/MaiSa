"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { changePlan, getSubscription } from "../api";
import type { ChangePlanFormValues } from "../schemas";

const key = ["subscription"];

export function useSubscription() {
  return useQuery({ queryKey: key, queryFn: getSubscription });
}

export function useChangePlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ChangePlanFormValues) => changePlan(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: key }),
  });
}
