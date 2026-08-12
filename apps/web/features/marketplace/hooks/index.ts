import { createCrudHooks } from "../../../lib/mock-crud-hooks";
import { marketplaceApi } from "../api";
import type { MarketplaceListing } from "../types";

export const {
  useList: useMarketplaceListings,
  useCreate: useCreateMarketplaceListing,
  useUpdate: useUpdateMarketplaceListing,
  useRemove: useRemoveMarketplaceListing,
} = createCrudHooks<MarketplaceListing>("marketplace-listings", marketplaceApi);
