import type { AnalyticsSummary } from "../types";

const LATENCY_MS = 150;

// Placeholder mock summary — swap for a real aggregation endpoint once one exists.
const MOCK_SUMMARY: AnalyticsSummary = {
  revenueThisMonth: 84500,
  revenueLastMonth: 71200,
  activeEvents: 6,
  upcomingEventsCount: 4,
  avgBudgetUtilizationPercent: 73,
};

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_SUMMARY), LATENCY_MS));
}
