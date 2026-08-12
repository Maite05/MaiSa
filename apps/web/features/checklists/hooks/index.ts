import { createCrudHooks } from "../../../lib/mock-crud-hooks";
import { checklistsApi } from "../api";
import type { ChecklistItem } from "../types";

export const {
  useList: useChecklistItems,
  useCreate: useCreateChecklistItem,
  useUpdate: useUpdateChecklistItem,
  useRemove: useRemoveChecklistItem,
} = createCrudHooks<ChecklistItem>("checklist-items", checklistsApi);
