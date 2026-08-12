import { createMockCrudApi } from "../../../lib/mock-store";
import type { Vendor } from "../types";

// Placeholder in-memory data — see lib/mock-store.ts. Swap for real
// apiRequest() calls once apps/api grows a vendors module.
export const vendorsApi = createMockCrudApi<Vendor>("vendor", [
  { id: "seed-1", name: "Aurelia Visuals", category: "Photography", contactEmail: "hello@aureliavisuals.com", priceRange: "$$$", rating: 5 },
  { id: "seed-2", name: "Botanique Studio", category: "Florals", contactEmail: "studio@botanique.co", priceRange: "$$", rating: 4 },
  { id: "seed-3", name: "The Glass Atelier", category: "Venue", contactEmail: "events@glassatelier.com", priceRange: "$$$$", rating: 5 },
]);
