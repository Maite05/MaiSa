// No apps/api module exists yet — saved/generated reports (a name + type,
// standing in for what would eventually be an exportable PDF/CSV).
export type ReportType = "Revenue" | "Event Summary" | "Client Activity" | "Budget Variance";

export interface SavedReport {
  id: string;
  name: string;
  type: ReportType;
  generatedAt: string;
}
