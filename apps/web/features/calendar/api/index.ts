import { createMockCrudApi } from "../../../lib/mock-store";
import type { CalendarEntry } from "../types";

// Placeholder in-memory data — see lib/mock-store.ts.
export const calendarApi = createMockCrudApi<CalendarEntry>("cal", [
  { id: "seed-1", title: "Fabric Delivery", date: new Date().toISOString().slice(0, 10), allDay: true },
  { id: "seed-2", title: "Studio Shoot", date: new Date(Date.now() + 5 * 86400000).toISOString().slice(0, 10), allDay: false },
]);
