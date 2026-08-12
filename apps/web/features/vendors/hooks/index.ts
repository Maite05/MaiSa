import { createCrudHooks } from "../../../lib/mock-crud-hooks";
import { vendorsApi } from "../api";
import type { Vendor } from "../types";

export const { useList: useVendors, useCreate: useCreateVendor, useUpdate: useUpdateVendor, useRemove: useRemoveVendor } =
  createCrudHooks<Vendor>("vendors", vendorsApi);
