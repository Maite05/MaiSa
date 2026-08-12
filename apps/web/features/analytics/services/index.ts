import type { AnalyticsSummary } from "../types";

/** Month-over-month revenue growth as a percent, e.g. 18.7 for +18.7%. */
export function getRevenueGrowthPercent(summary: Pick<AnalyticsSummary, "revenueThisMonth" | "revenueLastMonth">): number {
  if (summary.revenueLastMonth === 0) return 0;
  return ((summary.revenueThisMonth - summary.revenueLastMonth) / summary.revenueLastMonth) * 100;
}
