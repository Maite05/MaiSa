import { createMockCrudApi } from "../../../lib/mock-store";
import type { ChecklistItem } from "../types";

// Placeholder in-memory data — see lib/mock-store.ts.
export const checklistsApi = createMockCrudApi<ChecklistItem>("checklist", [
  { id: "seed-1", title: "Confirm venue insurance certificate", done: true },
  { id: "seed-2", title: "Renew vendor contracts for the season", done: false },
]);
