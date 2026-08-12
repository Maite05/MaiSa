"use client";

import { useQuery } from "@tanstack/react-query";
import { getAnalyticsSummary } from "../api";

export function useAnalyticsSummary() {
  return useQuery({ queryKey: ["analytics-summary"], queryFn: getAnalyticsSummary });
}
