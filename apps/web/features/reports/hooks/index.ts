"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteReport, generateReport, listReports } from "../api";
import type { GenerateReportFormValues } from "../schemas";

const key = ["reports"];

export function useReports() {
  return useQuery({ queryKey: key, queryFn: listReports });
}

export function useGenerateReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: GenerateReportFormValues) => generateReport(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: key }),
  });
}

export function useDeleteReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteReport(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: key }),
  });
}
