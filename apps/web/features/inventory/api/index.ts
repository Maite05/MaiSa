import { createMockCrudApi } from "../../../lib/mock-store";
import type { InventoryItem } from "../types";

// Placeholder in-memory data — see lib/mock-store.ts.
export const inventoryApi = createMockCrudApi<InventoryItem>("inv", [
  { id: "seed-1", name: "Ivory Linen Tablecloth (120in round)", sku: "LIN-IVR-120", quantity: 48, location: "Warehouse A" },
  { id: "seed-2", name: "Uplighting Fixture", sku: "AV-UPL-01", quantity: 24, location: "Warehouse B" },
]);
