// No apps/api module exists yet — real analytics would aggregate across
// the Event/Invoice/BudgetItem models that do exist once there's enough
// production data to make aggregation meaningful.
export interface AnalyticsSummary {
  revenueThisMonth: number;
  revenueLastMonth: number;
  activeEvents: number;
  upcomingEventsCount: number;
  avgBudgetUtilizationPercent: number;
}
