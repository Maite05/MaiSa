import type { GenerateReportFormValues } from "../schemas";
import type { SavedReport } from "../types";

const LATENCY_MS = 150;
function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), LATENCY_MS));
}

let reports: SavedReport[] = [
  { id: "r1", name: "Q3 Revenue Recap", type: "Revenue", generatedAt: new Date(Date.now() - 3 * 86400000).toISOString() },
];
let idCounter = 0;

export async function listReports(): Promise<SavedReport[]> {
  return delay([...reports]);
}

/** "Generating" a report is mocked as instant here — a real implementation would enqueue a job and poll/notify on completion. */
export async function generateReport(input: GenerateReportFormValues): Promise<SavedReport> {
  idCounter += 1;
  const report: SavedReport = { id: `report-mock-${idCounter}`, ...input, generatedAt: new Date().toISOString() };
  reports = [report, ...reports];
  return delay(report);
}

export async function deleteReport(id: string): Promise<void> {
  reports = reports.filter((r) => r.id !== id);
  return delay(undefined);
}
