import { createMockCrudApi } from "../../../lib/mock-store";
import type { Lead } from "../types";

// Placeholder in-memory data — see lib/mock-store.ts.
export const leadsApi = createMockCrudApi<Lead>("lead", [
  { id: "seed-1", name: "Priya Desai", company: "Desai & Co.", email: "priya@desaico.com", stage: "QUALIFIED" },
  { id: "seed-2", name: "Marcus Lin", email: "marcus.lin@gmail.com", stage: "NEW" },
]);
