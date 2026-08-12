import { createCrudHooks } from "../../../lib/mock-crud-hooks";
import { inventoryApi } from "../api";
import type { InventoryItem } from "../types";

export const {
  useList: useInventoryItems,
  useCreate: useCreateInventoryItem,
  useUpdate: useUpdateInventoryItem,
  useRemove: useRemoveInventoryItem,
} = createCrudHooks<InventoryItem>("inventory-items", inventoryApi);
