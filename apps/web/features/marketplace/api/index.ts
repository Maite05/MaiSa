import { createMockCrudApi } from "../../../lib/mock-store";
import type { MarketplaceListing } from "../types";

// Placeholder in-memory data — see lib/mock-store.ts.
export const marketplaceApi = createMockCrudApi<MarketplaceListing>("mkt", [
  { id: "seed-1", title: "Rare Book Curation Session", vendorName: "Bibliotheca Antiqua", price: 1200, category: "Decor" },
  { id: "seed-2", title: "Kaiseki Tasting Menu", vendorName: "Sora Dining", price: 220, category: "Catering" },
]);
