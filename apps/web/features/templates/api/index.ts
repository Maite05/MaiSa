import { createMockCrudApi } from "../../../lib/mock-store";
import type { EventTemplate } from "../types";

// Placeholder in-memory data — see lib/mock-store.ts.
export const templatesApi = createMockCrudApi<EventTemplate>("tmpl", [
  { id: "seed-1", name: "Destination Wedding", description: "Multi-day timeline with welcome dinner and farewell brunch.", category: "Wedding" },
  { id: "seed-2", name: "Product Launch Gala", description: "Press check-in, keynote block, and after-party segments.", category: "Corporate" },
]);
